import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateBusinessConfig } from "@/redux/slices/configSlice";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import Select from 'react-select';
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

const BusinessConfigurationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { businessConfig, loading, error } = useBusinessConfig();
  const [localConfig, setLocalConfig] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (businessConfig) {
      setLocalConfig(businessConfig);
    }
  }, [businessConfig]);

  const handleInputChange = (path: string[], value: any) => {
  setLocalConfig((prevConfig) => {
    let newConfig = { ...prevConfig };
    // Iterate through path and create copies for each nested level
    path.reduce((acc, key, index) => {
      if (index === path.length - 1) {
        acc[key] = value; // Set the final property
      } else {
        acc[key] = { ...acc[key] }; // Create a copy for intermediate objects
      }
      return acc[key];
    }, newConfig);

    return newConfig;
  });
  };

  const handleSubmit = async () => {
    try {
      // Now send the flattened config to the backend
      await dispatch(updateBusinessConfig(localConfig)); // Pass localConfig
      toast(<SuccessToast message={"Configuration updated successfully!"} />);
    } catch (error) {
      console.error("Failed to update config:", error);
      toast(<ErrorToast message={"Failed to update configuration."} />);
    }
  };

  const handleFileChange = (path: string[], file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange(path, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (path: string[], selectedOptions: any) => {
    handleInputChange(path, selectedOptions.map((option: any) => option.value));
  };

  const renderFixedFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {[
        { label: "Business Name", key: "businessName" },
        { label: "Address", key: "address" },
        { label: "Phone", key: "phone" },
        { label: "Email", key: "email" },
        { label: "Currency", key: "currency" },
        { label: "Currency Symbol", key: "currencySymbol"},
        { label: "Logo", key: "logo", isImage: true },
        { label: "Favicon", key: "favicon", isImage: true },
      ].map(({ label, key, isImage }) => (
        <div key={key}>
          <label className="block text-gray-700 font-medium mb-2">{label}</label>
          {isImage ? (
            <div>
              {localConfig[key] && (
                <img
                  src={localConfig[key]}
                  alt={`${label} Preview`}
                  className="w-16 h-16 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) =>
                  handleFileChange([key], e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          ) : (
            <input
              type="text"
              value={localConfig[key] || ""}
              onChange={(e) => handleInputChange([key], e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPasswordVerification = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Password Verification Type</label>
        <Select
          value={{
            label: localConfig.passwordVerification?.type || "",
            value: localConfig.passwordVerification?.type || "",
          }}
          onChange={(selectedOption) =>
            handleInputChange(
              ["passwordVerification", "type"],
              selectedOption?.value || ""
            )
          }
          options={[
            { label: "Phone", value: "phone" },
            { label: "Email", value: "email" },
          ]}
          className="block w-full"
          classNamePrefix="select"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">OTP Enabled</label>
        <input
          type="checkbox"
          checked={localConfig.passwordVerification?.optEnabled || false}
          onChange={(e) =>
            handleInputChange(["passwordVerification", "optEnabled"], e.target.checked)
          }
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const renderDynamicFields = (data: any, path: string[] = []) => {
    const fixedKeys = [
      "businessName",
      "address",
      "phone",
      "email",
      "logo",
      "favicon",
      "currency",
      "currencySymbol",
      "passwordVerification",
    ];

    if (path.length === 0) {
      // Filter out fixed keys from the data
      data = Object.fromEntries(
        Object.entries(data || {}).filter(([key]) => !fixedKeys.includes(key))
      );
    }

    if (data && typeof data === "object" && !Array.isArray(data)) {
      const isNotifications = path.includes("notifications");
      return (
        <div className={`${
            isNotifications ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "col-span-1 w-full"
          }`}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <label className="text-gray-700 font-medium mb-2 px-3">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              {renderDynamicFields(value, [...path, key])}
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(data)) {
      if (path.includes("daysBefore")) {
        const options = [0, 1, 2, 3, 5, 7].map((option) => ({
          label: `${option} day${option > 1 ? "s" : ""} before`,
          value: option,
        }));

        return (
          <Select
            isMulti
            value={data.map((value: number) => options.find((option) => option.value === value))}
            onChange={(selectedOptions) =>
              handleSelectChange(path, selectedOptions || [])
            }
            options={options}
            className="block w-full"
            classNamePrefix="select"
          />
        );
      }
    } else {
      return (
        <input
          type={typeof data === "boolean" ? "checkbox" : "text"}
          checked={typeof data === "boolean" ? data : undefined}
          value={typeof data !== "boolean" ? data : undefined}
          onChange={(e) =>
            handleInputChange(
              path,
              typeof data === "boolean" ? e.target.checked : e.target.value
            )
          }
          className={`${
            typeof data === "boolean"
              ? "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              : "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          }`}
        />
      );
    }
  };

  if (loading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Configuration</h1>
      <form>
        {renderFixedFields()}
        {renderPasswordVerification()}
        <div className="grid grid-cols-1 gap-6">
          {renderDynamicFields(localConfig)}
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="px-6 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessConfigurationPage;

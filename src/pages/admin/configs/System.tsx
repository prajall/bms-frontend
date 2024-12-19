import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateSystemConfig } from "@/redux/slices/configSlice";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
// import Select from "react-select";

const SystemConfigurationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { systemConfig, loading, error } = useSystemConfig();
  const [localConfig, setLocalConfig] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (systemConfig) {
      setLocalConfig(systemConfig);
    }
  }, [systemConfig]);

  const handleInputChange = (path: string[], value: any) => {
    setLocalConfig((prevConfig) => {
      let newConfig = { ...prevConfig };
      path.reduce((acc, key, index) => {
        if (index === path.length - 1) {
          acc[key] = value;
        } else {
          acc[key] = { ...acc[key] };
        }
        return acc[key];
      }, newConfig);
      return newConfig;
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateSystemConfig(localConfig));
      toast(<SuccessToast message={"Configuration updated successfully!"} />);
    } catch (error) {
      console.error("Failed to update config:", error);
      toast(<ErrorToast message={"Failed to update configuration."} />);
    }
  };

  const renderDynamicFields = (data: any, path: string[] = []) => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(data).map(([key, value]) => {
            const fieldPath = [...path, key];

            // Reverse readonly behavior
            const isReadOnly =
              !(key === "enable" && path.includes("maintenanceMode")) &&
              path[0] !== "features" &&
              !(key === "apiKey" && path[0] === "payment");

            const isText =
              key === "message" && path.includes("maintenanceMode");

            return (
              <div key={key}>
                <label className="block text-gray-700 font-medium mb-2">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </label>
                {renderDynamicFields(value, fieldPath)}
              </div>
            );
          })}
        </div>
      );
    } else if (Array.isArray(data)) {
      return (
        <div>
          {data.map((item, index) => (
            <div key={index} className="mb-4">
              {renderDynamicFields(item, [...path, `${index}`])}
            </div>
          ))}
        </div>
      );
    } else {
      const isReadOnly =
        !(path.includes("enable") && path.includes("maintenanceMode")) &&
        path[0] !== "features" &&
        !(path[path.length - 1] === "apiKey" && path[0] === "payment");

      const isText =
        path.includes("message") && path.includes("maintenanceMode");

      return isText ? (
        <div className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 text-gray-700">
          {data}
        </div>
      ) : (
        <input
          type={typeof data === "boolean" ? "checkbox" : "text"}
          readOnly={isReadOnly}
          disabled={isReadOnly}
          checked={typeof data === "boolean" ? data : undefined}
          value={typeof data !== "boolean" ? data : undefined}
          onChange={(e) =>
            handleInputChange(
              path,
              typeof data === "boolean" ? e.target.checked : e.target.value
            )
          }
          className={`${
            isReadOnly
              ? "bg-gray-200 cursor-not-allowed"
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Configuration</h1>
      <form>
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

export default SystemConfigurationPage;
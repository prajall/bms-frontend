import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Address {
  country: string;
  province: string;
  city: string;
  addressLine: string;
  houseNo: string;
}

// Define the type for the form data
interface CustomerFormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  image: string;
  address: Address;
  phoneNo: string;
  mobileNo1: string;
  mobileNo2: string;
  user?: any;
}

interface CustomerProps {
  initialData?: CustomerFormData;
  onSubmit: (data: FormData) => void;
}

const Customer: React.FC<CustomerProps> = ({ initialData, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [address, setAddress] = useState<Address>(
    initialData?.address || {
      country: "Nepal",
      province: "",
      city: "",
      addressLine: "",
      houseNo: "",
    }
  );
  const [selectedGender, setselectedGender] = useState(
    initialData?.gender || ""
  );

  const defaultValues: CustomerFormData = {
    name: "",
    email: "",
    password: "",
    gender: "",
    image: "",
    address: {
      country: "Nepal",
      province: "",
      city: "",
      addressLine: "",
      houseNo: "",
    },
    phoneNo: "",
    mobileNo1: "",
    mobileNo2: "",
    ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({ defaultValues });

  // Pre-fill the form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof CustomerFormData, (initialData as any)[key]);
      });
      setValue('email', initialData?.user?.email || '');
      setValue('password', initialData?.user?.password || '');
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (data: CustomerFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "address") {
        Object.entries(address).forEach(([adrsKey, adrsValue]) => {
          formData.append(`address.${adrsKey}`, adrsValue.toString());
        });
      }
    });
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("password", data.password.trim());
    formData.append("gender", data.gender.trim());
    formData.append("phoneNo", data.phoneNo.trim());
    formData.append("mobileNo1", data.mobileNo1.trim());
    formData.append("mobileNo2", data.mobileNo2.trim());
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            {/* Name */}
            <div className="mb-4">
              <Label htmlFor="name">
                Customer Name <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("name", { required: "Customer Name is required" })}
                id="name"
                placeholder="Enter customer name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter Customer Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <Label htmlFor="gender">
                Gender <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={selectedGender}
                onValueChange={(value) => {
                  setselectedGender(value);
                  setValue("gender", value);
                }}
                className="mt-2 flex gap-4"
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="male" />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="female" />
                  <span>Female</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="other" />
                  <span>Other</span>
                </label>
              </RadioGroup>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* phone    */}
            <div className="mb-4">
              <Label htmlFor="phoneNo">
                Phone <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("phoneNo", { required: "Phone No is required" })}
                id="phoneNo"
                placeholder="Enter phone number"
              />
              {errors.phoneNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNo.message}
                </p>
              )}
            </div>

            {/* mobile 1    */}
            <div className="mb-4">
              <Label htmlFor="mobileNo1">Mobile Number 1</Label>
              <Input
                {...register("mobileNo1")}
                id="mobileNo1"
                placeholder="Enter mobile number 1"
              />
              {errors.mobileNo1 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNo1.message}
                </p>
              )}
            </div>

            {/* mobile 1    */}
            <div className="mb-4">
              <Label htmlFor="mobileNo2">Mobile Number 2</Label>
              <Input
                {...register("mobileNo2")}
                id="mobileNo2"
                placeholder="Enter mobile number 2"
              />
              {errors.mobileNo2 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNo2.message}
                </p>
              )}
            </div>

            {/* address */}
            <div className="lg:col-span-2">
              <Label className="text-lg mb-2">Address:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressCountry">
                    Country <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="addressCountry"
                    type="text"
                    value={address.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="addressProvince">
                    Province <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="addressProvince"
                    type="text"
                    value={address.province}
                    onChange={(e) =>
                      handleAddressChange("province", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="addressCity">City</Label>
                  <Input
                    id="addressCity"
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine">Address Line</Label>
                  <Input
                    id="addressLine"
                    type="text"
                    value={address.addressLine}
                    onChange={(e) =>
                      handleAddressChange("addressLine", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="addressHouseNo">House No</Label>
                  <Input
                    id="addressHouseNo"
                    type="text"
                    value={address.houseNo}
                    onChange={(e) =>
                      handleAddressChange("houseNo", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="mb-4">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleImageChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit">{initialData ? "Update" : "Create"}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Customer;

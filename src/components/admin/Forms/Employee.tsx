import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import RoleSelect from '@/components/formElements/RoleSelect';

interface Address {
    country: string;
    province: string;
    city: string;
    addressLine: string;
}

// Define the type for the form data
interface EmployeeFormData {
    name: string;
    email: string;
    password: string;
    gender: string;
    role: string;
    department: string;
    image: string;
    address: Address;
    contactNo: string;
}

interface EmployeeProps {
  initialData?: EmployeeFormData; 
  onSubmit: (data: FormData) => void;
}

const Employee: React.FC<EmployeeProps> = ({ initialData, onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [address, setAddress] = useState<Address>(
        initialData?.address || { country: "Nepal", province: "", city: "", addressLine: "" }
    );
  const [selectedGender, setselectedGender] = useState(initialData?.gender || "");
  const [selectedRole, setSelectedRole] = useState(initialData?.role || "");  
    
    const defaultValues: EmployeeFormData = {
        name: "",
        email: "",
        password: "",
        gender: "",
        role: "",
        department: "",
        image: "",
        address: { country: "Nepal", province: "", city: "", addressLine: "" },
        contactNo: '',
        ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({ defaultValues });

  // Pre-fill the form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof EmployeeFormData, (initialData as any)[key]);
      });
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
  
    const handleRoleChange = (value: string) => {
      setSelectedRole(value.toString());
      setValue("role", value.toString());
    };

  const handleFormSubmit = async (data: EmployeeFormData) => {
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
        formData.append("status", selectedRole.trim());
        formData.append("gender", data.gender.trim());
        formData.append("department", data.department.trim());
        formData.append("contactNo", data.contactNo.trim());
        onSubmit(formData);
    };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            {/* Name */}
            <div className='mb-4'>
              <Label htmlFor="name">
                Employee Name <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("name", { required: "Employee Name is required" })}
                id="name"
                placeholder="Enter employee name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className='mb-4'>
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                {...register("email")}
                id="email"
                type='email'
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      
            {/* Password */}
            <div className='mb-4'>
              <Label htmlFor="password">
                Password 
              </Label>
              <Input
                {...register("password")}
                id="password"
                type='password'
                placeholder="Enter Employee Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="role">
                  Role <span className="text-red-400">*</span>
              </Label>
              <RoleSelect
                selectedRole={selectedRole}
                onChange={handleRoleChange}
                showAddRoleButton={true}
              />
            </div>

            {/* phone    */}
            <div className='mb-4'>
              <Label htmlFor="contactNo">
                Phone <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("contactNo", { required: "Phone No is required" })}
                id="contactNo"             
                placeholder="Enter phone number"
              />
              {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo.message}</p>}
            </div>
            
            {/* Department 1    */}
            <div className='mb-4'>
              <Label htmlFor="department">
                Department
              </Label>
              <Input
                {...register("department")}
                id="department"             
                placeholder="Enter mobile number 2"
              />
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
            </div>
            
            {/* address */}
            <div className="lg:col-span-2">
              <Label>Address</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressCountry">Country</Label>
                  <Input
                    id="addressCountry"
                    type="text"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="addressProvince">Province</Label>
                  <Input
                    id="addressProvince"
                    type="text"
                    value={address.province}
                    onChange={(e) => handleAddressChange("province", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="addressCity">City</Label>
                  <Input
                    id="addressCity"
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine">Address Line</Label>
                  <Input
                    id="addressLine"
                    type="text"
                    value={address.addressLine}
                    onChange={(e) => handleAddressChange("addressLine", e.target.value)}
                  />
                </div>
              </div>
            </div>
                      


            {/* Image */}
            <div className='mb-4'>
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

export default Employee;

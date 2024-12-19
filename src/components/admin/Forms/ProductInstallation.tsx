import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import CustomerSelect from '@/components/formElements/CustomerSelect';
import { ProductSelect } from '@/components/formElements/ProductSelect';

// Define the type for the form data
interface ProductInstallationFormData {
  product: string;
  customer: string;
  installationDate: Date;
  status: string;
  address: string;
  phoneNumber: string;
  additionalNote: string;
  installationCharge: number;
  addedServices: [];
}

interface ProductInstallationProps {
  initialData?: ProductInstallationFormData; 
  onSubmit: (data: FormData) => void;
}

const ProductInstallation: React.FC<ProductInstallationProps> = ({ initialData, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || "");
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const defaultValues: ProductInstallationFormData = {
    product: "",
    customer: "",
    installationDate: new Date(),
    status: "",
    address: "",
    phoneNumber: '',
    additionalNote: '',
    installationCharge: 0,
    addedServices: [],
    ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInstallationFormData>({ defaultValues });

  // Pre-fill the form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof ProductInstallationFormData, (initialData as any)[key]);
      });
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: ProductInstallationFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            
            {/* Product Select */}
            <div className="mb-4">
              <ProductSelect
                selectedProduct={defaultValues.product}
                onChange={(value) => setValue("product", value)}
                showAddProductButton={true}
              />
              {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>}
            </div>

            {/* Customer Select */}
            <div className="mb-4">
              <CustomerSelect
                selectedCustomer={defaultValues.customer}
                onChange={(value) => setValue("customer", value)}
                loadingText="Fetching customers..."
                showAddCustomerButton={true}
              />
              {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer.message}</p>}
            </div>

            {/* Installation Date */}
            <div className="mb-4">
              <Label htmlFor="installationDate">Installation Date</Label>
              <Input
                {...register("installationDate", { required: "Installation Date is required" })}
                id="installationDate"
                type="date"
                placeholder="Select installation date"
              />
              {errors.installationDate && <p className="text-red-500 text-xs mt-1">{errors.installationDate.message}</p>}
            </div>
            
            {/* Status */}
            <div className='mb-4'>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>

            {/* Address */}
            <div className="mb-4">
              <Label htmlFor="address">Address</Label>
              <Input
                {...register("address", { required: "Address is required" })}
                id="address"
                placeholder="Enter installation address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                {...register("phoneNumber", { required: "Phone number is required" })}
                id="phoneNumber"
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Additional Note */}
            <div className="mb-4">
              <Label htmlFor="additionalNote">Additional Note</Label>
              <Input
                {...register("additionalNote")}
                id="additionalNote"
                placeholder="Enter any additional notes"
              />
            </div>

            {/* Installation Charge */}
            <div className="mb-4">
              <Label htmlFor="installationCharge">Installation Charge</Label>
              <Input
                {...register("installationCharge", { required: "Installation charge is required" })}
                id="installationCharge"
                type="number"
                placeholder="Enter installation charge"
              />
              {errors.installationCharge && <p className="text-red-500 text-xs mt-1">{errors.installationCharge.message}</p>}
            </div>

            {/* Added Services */}
            <div className="mb-4">
              <Label htmlFor="addedServices">Added Services</Label>
              <Input
                {...register("addedServices")}
                id="addedServices"
                placeholder="Enter additional services (comma separated)"
              />
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

export default ProductInstallation;

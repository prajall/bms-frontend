import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import TextEditor from '@/components/ui/TextEditor';
import { MultiProduct } from '@/components/formElements/ProductSelect';
import { MultiPart } from '@/components/formElements/PartSelect';

interface ProductOrPart {
  _id: string;
  [key: string]: any; // Add this if there are additional properties you want to allow
}

// Define the type for the form data
interface ServiceFormData {
    title: string;
    serviceType: string;
    products: (string | ProductOrPart)[];
    parts: (string | ProductOrPart)[];
    workDetail: string;
    isRecurring: boolean;
    interval: number;
    serviceCharge: number;
    additionalNotes: string;
    availability: string;
    // serviceProvided: string[];
}

interface ServiceProps {
  initialData?: ServiceFormData; 
  onSubmit: (data: FormData) => void;
}

const type = [
    { value: 'repair', label: 'Repair' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'replacement', label: 'Replacement' },
];

const Service: React.FC<ServiceProps> = ({ initialData, onSubmit }) => {
  const defaultValues: ServiceFormData = {
    title: '',
    serviceType: '',
    products: [],
    parts: [],
    workDetail: '',
    isRecurring: false,
    interval: 0,
    serviceCharge: 0,
    additionalNotes: '',
    availability: '',
    // serviceProvided: [],
    ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({ defaultValues });

  const [selectedType, setSelectedType] = useState(initialData?.serviceType || "");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    (initialData?.products || []).map((product) =>
      typeof product === "object" && "_id" in product ? product._id : product
    )
  );
  const [selectedParts, setSelectedParts] = useState<string[]>(
    (initialData?.parts || []).map((part) =>
      typeof part === "object" ? part._id || "" : part || ""
    )
  );
  const [workDetailContent, setWorkDetailContent] = useState(initialData?.workDetail || '');
  const [addNoteContent, setAddNoteContent] = useState(initialData?.additionalNotes || '');
  const [selectedAvailability, setSelectedAvailability] = useState(initialData?.availability || "");

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof ServiceFormData, (initialData as any)[key]);
      });
      setSelectedType(initialData.serviceType || "");
      setSelectedProducts(
      (initialData.products || []).map((product) =>
        typeof product === "object" && "_id" in product ? product._id : product
      )
    );
    setSelectedParts(
      (initialData.parts || []).map((part) =>
        typeof part === "object" ? part._id || "" : part || ""
      )
    );
      setWorkDetailContent(initialData.workDetail || '');
      setAddNoteContent(initialData.additionalNotes || '');
      setSelectedAvailability(initialData.availability || "");
    }
  }, [initialData, setValue]);


  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue("serviceType", value);
  };

  const handleProductsChange = (values: string[]) => {
    setSelectedProducts(values);
    setValue("products", values); 
  };

  const handlePartsChange = (values: string[]) => {
    setSelectedParts(values);
    setValue("parts", values); 
  };

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(value);
    setValue("availability", value); 
  };

  const handleWorkDetailChange = (content: string) => {
    setWorkDetailContent(content);
    setValue("workDetail", content);
  };

  const handleAddNoteChange = (content: string) => {
      setAddNoteContent(content);
      setValue("additionalNotes", content);
  };


  const handleFormSubmit = async (data: ServiceFormData) => {
    const transformedData = {
        ...data,
        products: data.products.map((product) =>
        typeof product === "object" && "_id" in product ? product._id : product
        ),
        parts: data.parts.map((part) =>
        typeof part === "object" && "_id" in part ? part._id : part
        ),
    };
    
    const formData = new FormData();
    Object.entries(transformedData).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value.toString());
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            
            {/* Name */}
            <div className='mb-4'>
              <Label htmlFor="title">
                Service Title <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("title", { required: "Service title is required" })}
                id="name"
                placeholder="Enter service title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Status */}
            <div className='mb-4'>
              <Label htmlFor="availability">Type</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger id='serviceType'>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                    {type.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}                    
                </SelectContent>
                </Select>
                {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>}
            </div>
            
            {/* Product Select */}
            <div className="mb-4">
              <Label htmlFor="products">Products</Label>
              <MultiProduct
                selectedValues={selectedProducts}
                onChange={handleProductsChange}
                showAddProductButton={true}
              />
              {errors.products && <p className="text-red-500 text-xs mt-1">{errors.products.message}</p>}
            </div>

            {/* Part Select */}
            <div className="mb-4">
              <Label htmlFor="parts">Parts</Label>
              <MultiPart
                selectedValues={selectedParts}
                onChange={handlePartsChange}
                showAddPartButton={true}
              />
              {errors.parts && <p className="text-red-500 text-xs mt-1">{errors.parts.message}</p>}
            </div>

            {/* Interval */}
            <div className="mb-4">
              <Label htmlFor="interval">Interval</Label>
              <Input
                {...register("interval", { required: "Interval is required" })}
                id="interval"
                placeholder="Enter Interval"
              />
              {errors.interval && <p className="text-red-500 text-xs mt-1">{errors.interval.message}</p>}
            </div>

            {/* Service Charge */}
            <div className="mb-4">
              <Label htmlFor="serviceCharge">Service Charge</Label>
              <Input
                {...register("serviceCharge", { required: "Service charge is required" })}
                id="iserviceCharge"
                type="number"
                placeholder="Enter service charge"
              />
              {errors.serviceCharge && <p className="text-red-500 text-xs mt-1">{errors.serviceCharge.message}</p>}
            </div>

            {/* Availability */}
            <div className='mb-4'>
              <Label htmlFor="availability">Availability</Label>
              <Select value={selectedAvailability} onValueChange={handleAvailabilityChange}>
                <SelectTrigger id='availability'>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>                   
                </SelectContent>
                </Select>
                {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability.message}</p>}
            </div>

            {/* Work Detail */}
            <div className="lg:col-span-2">
              <Label htmlFor="workDetail">Work Detail</Label>
              <TextEditor
                value={workDetailContent} 
                onChange={handleWorkDetailChange} 
                id="workDetail"
              />
              {errors.workDetail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.workDetail.message}
                </p>
              )}
              
            </div>

            {/* Additional Note */}
            <div className="mb-4 lg:col-span-2">
              <Label htmlFor="additionalNotes">Additional Note</Label>
              <TextEditor
                value={addNoteContent} 
                onChange={handleAddNoteChange} 
                id="additionalNotes"
              />
              {errors.additionalNotes && <p className="text-red-500 text-xs mt-1">{errors.additionalNotes.message}</p>}
            </div>

            {/* Service Provided */}
            {/* <div className="mb-4">
              <Label htmlFor="serviceProvided">Service Provided</Label>
              <Input
                {...register("serviceProvided")}
                id="serviceProvided"
                placeholder="Enter additional services (comma separated)"
              />
              {errors.serviceProvided && <p className="text-red-500 text-xs mt-1">{errors.serviceProvided.message}</p>}
            </div> */}

          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit">{initialData ? "Update" : "Create"}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Service;

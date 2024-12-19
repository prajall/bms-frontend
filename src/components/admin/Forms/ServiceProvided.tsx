import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import TextEditor from '@/components/ui/TextEditor';
import ServiceSelect from '@/components/formElements/ServiceSelect';
import { ServiceOrderSelect } from '@/components/formElements/SelectServiceOrder';
import { MultiProduct } from '@/components/formElements/ProductSelect';
import { MultiPart } from '@/components/formElements/PartSelect';

interface ServiceReference {
    _id: string;
    name: string;
    title: string;
}

// Define the type for the form data
interface ServiceProvidedFormData {
    service: ServiceReference | string; 
    serviceOrder: ServiceReference | string; 
    title: string;
    date: string;
    serviceCharge: number;
    products: (string | ServiceReference)[];
    parts: (string | ServiceReference)[];
    workDetail: string;
    additionalNotes: string;
}

interface ServiceProvidedProps {
  initialData?: ServiceProvidedFormData; 
  onSubmit: (data: FormData) => void;
}

const formatDateToYYYYMMDD = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

const ServiceProvided: React.FC<ServiceProvidedProps> = ({ initialData, onSubmit }) => {
    const defaultValues: ServiceProvidedFormData = {
        service: '',
        serviceOrder: '',
        title: '',
        date: formatDateToYYYYMMDD(new Date()),
        serviceCharge: 0,
        products: [],
        parts: [],
        workDetail: '',
        additionalNotes: '',
        ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceProvidedFormData>({ defaultValues });

  const [selectedService, setSelectedService] = useState<string>(
        typeof initialData?.service === 'object' ? initialData?.service?._id || '' : initialData?.service || ''
  );
    
    const [selectedServiceOrder, setSelectedServiceOrder] = useState<string>(
        typeof initialData?.serviceOrder === 'object' ? initialData?.serviceOrder?._id || '' : initialData?.serviceOrder || ''
    );
    
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

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof ServiceProvidedFormData, (initialData as any)[key]);
      });
    const service = typeof initialData.service === 'object' ? initialData.service._id : initialData.service || '';
        setValue('service', service);

        const serviceOrder = typeof initialData?.serviceOrder === 'object' ? initialData?.serviceOrder?._id || '' : initialData?.serviceOrder || ''
            setValue('serviceOrder', serviceOrder);
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
        setValue('date', formatDateToYYYYMMDD(initialData.date || new Date()));
        setSelectedService(service);
        setSelectedServiceOrder(serviceOrder);
      setWorkDetailContent(initialData.workDetail || '');
      setAddNoteContent(initialData.additionalNotes || '');
    }
  }, [initialData, setValue]);
    
    const handleServiceChange = (value: string) => {
        setSelectedService(value);
        setValue("service", value);
    };

    const handleServiceOrderChange = (value: string) => {
        setSelectedServiceOrder(value);
        setValue("serviceOrder", value);
    };

  const handleProductsChange = (values: string[]) => {
    setSelectedProducts(values);
    setValue("products", values); 
  };

  const handlePartsChange = (values: string[]) => {
    setSelectedParts(values);
    setValue("parts", values); 
  };

  const handleWorkDetailChange = (content: string) => {
    setWorkDetailContent(content);
    setValue("workDetail", content);
  };

  const handleAddNoteChange = (content: string) => {
      setAddNoteContent(content);
      setValue("additionalNotes", content);
  };


    const handleFormSubmit = async (data: ServiceProvidedFormData) => {
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
                {/* Service Select */}
                <div className="mb-4">
                    <Label htmlFor="service">Service</Label>
                    <ServiceSelect
                        selectedService={selectedService}
                        onChange={handleServiceChange}
                        showAddServiceButton={true}
                    />
                    {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                    </div>
                    
                    {/* Service Select */}
                <div className="mb-4">
                    <Label htmlFor="serviceOrder">Service Order</Label>
                    <ServiceOrderSelect
                        selectedServiceOrder={selectedServiceOrder}
                        onChange={handleServiceOrderChange}
                        showAddServiceOrderButton={false}
                    />
                    {errors.serviceOrder && <p className="text-red-500 text-xs mt-1">{errors.serviceOrder.message}</p>}
                </div>
            
                {/* Name */}
                <div className='mb-4'>
                <Label htmlFor="title">
                    Title <span className="text-red-400">*</span>
                </Label>
                <Input
                    {...register("title", { required: "Service title is required" })}
                    id="name"
                    placeholder="Enter service title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
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

                {/* Date */}
                <div className="mb-4">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        {...register("date", { required: "Service Date is required" })}
                        id="date"
                        type="date"
                        placeholder="Select service date"
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
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

            </div>
            </CardContent>
            <CardFooter className="flex justify-center">
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
            </CardFooter>
        </Card>
    </form>
  );
};

export default ServiceProvided;

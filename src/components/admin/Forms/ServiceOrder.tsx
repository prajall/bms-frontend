import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import ServiceSelect from '@/components/formElements/ServiceSelect';
import CustomerSelect from '@/components/formElements/CustomerSelect';
import { MultiServiceProvided } from '@/components/formElements/SelectServiceProvide';

interface ServiceReference {
    _id: string;
    title?: string; 
    name?: string;
}
// Define the type for the form data
interface ServiceOrderFormData {
    serviceId: ServiceReference | string; 
    customerId: ServiceReference | string;
    date: string;
    nextServiceDate: string;
    serviceCharge: number;
    serviceProvided: string[];
}

interface ServiceOrderProps {
  initialData?: ServiceOrderFormData;
  onSubmit: (data: FormData) => void;
}

const formatDateToYYYYMMDD = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

const ServiceOrder: React.FC<ServiceOrderProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ServiceOrderFormData>({
        defaultValues: {
            serviceId: '',
            customerId: '',
            date: formatDateToYYYYMMDD(new Date()),
            nextServiceDate: formatDateToYYYYMMDD(new Date()),
            serviceCharge: 0,
            serviceProvided: [],
            ...initialData,
        },
    });

    // States for controlled fields
    const [selectedService, setSelectedService] = useState<string>(
        typeof initialData?.serviceId === 'object' ? initialData?.serviceId?._id || '' : initialData?.serviceId || ''
    );
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        typeof initialData?.customerId === 'object' ? initialData?.customerId?._id || '' : initialData?.customerId || ''
    );
    const [selectedServiceProvided, setSelectedServiceProvided] = useState<string[]>(initialData?.serviceProvided || []);

    // Sync form state and controlled states when `initialData` changes
    useEffect(() => {
        if (initialData) {
            const serviceId = typeof initialData.serviceId === 'object' ? initialData.serviceId._id : initialData.serviceId || '';
            setValue('serviceId', serviceId);

            const customerId = typeof initialData.customerId === 'object' ? initialData.customerId._id : initialData.customerId || '';
            setValue('customerId', customerId);
            setValue('serviceProvided', initialData.serviceProvided || []);
            setValue('date', formatDateToYYYYMMDD(initialData.date || new Date()));
            setValue('nextServiceDate', formatDateToYYYYMMDD(initialData.nextServiceDate || new Date()));

            setSelectedService(serviceId);
            setSelectedCustomer(customerId);
            setSelectedServiceProvided(initialData.serviceProvided || []);
        }
    }, [initialData, setValue]);

    const handleServiceChange = (value: string) => {
        setSelectedService(value);
        setValue("serviceId", value);
    };

    const handleCustomerChange = (value: string) => {
        setSelectedCustomer(value);
        setValue("customerId", value);
    };

    const handleServiceProvidedChange = (values: string[]) => {
        setSelectedServiceProvided(values);
        setValue("serviceProvided", values);
    };

    const handleFormSubmit = async (data: ServiceOrderFormData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
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
                            <Label htmlFor="serviceId">Service</Label>
                            <ServiceSelect
                                selectedService={selectedService}
                                onChange={handleServiceChange}
                                showAddServiceButton={true}
                            />
                            {errors.serviceId && <p className="text-red-500 text-xs mt-1">{errors.serviceId.message}</p>}
                        </div>

                        {/* Customer Select */}
                        <div className="mb-4">
                            <Label htmlFor="customerId">Customer</Label>
                            <CustomerSelect
                                selectedCustomer={selectedCustomer}
                                onChange={handleCustomerChange}
                                showAddCustomerButton={true}
                            />
                            {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId.message}</p>}
                        </div>

                        {/* Service Date */}
                        <div className="mb-4">
                            <Label htmlFor="date">Service Date</Label>
                            <Input
                                {...register("date", { required: "Service Date is required" })}
                                id="date"
                                type="date"
                                placeholder="Select service date"
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                        </div>

                        {/* Next Service Date */}
                        <div className="mb-4">
                            <Label htmlFor="nextServiceDate">Next Service Date</Label>
                            <Input
                                {...register("nextServiceDate")}
                                id="nextServiceDate"
                                type="date"
                                placeholder="Select next service date"
                            />
                            {errors.nextServiceDate && <p className="text-red-500 text-xs mt-1">{errors.nextServiceDate.message}</p>}
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

                        {/* Service Provided */}
                        <div className="mb-4">
                            <Label htmlFor="serviceProvided">Service Provided</Label>
                            <MultiServiceProvided
                                selectedValues={selectedServiceProvided}
                                onChange={handleServiceProvidedChange}
                                showAddServiceProvidedButton={true}
                            />
                            {errors.serviceProvided && <p className="text-red-500 text-xs mt-1">{errors.serviceProvided.message}</p>}
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

export default ServiceOrder;

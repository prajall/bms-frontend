import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import ServiceSelect from '@/components/formElements/ServiceSelect';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import Select from "react-select";
import Checkbox from '@/components/ui/Checkbox';
import TextEditor from '@/components/ui/TextEditor';
import { useServiceById } from '@/hooks/useService';
import { useCustomerById } from '@/hooks/useCustomer';

interface ServiceReference {
    _id: string;
    title?: string; 
    name?: string;
}
// Define the type for the form data
export interface ServiceOrderFormData {
    order?: string;
    orderId?: string;
    service?: ServiceReference | string; 
    customer: ServiceReference | string;
    address: string;
    contactNumber: string;
    date?: string;
    isRecurring?: boolean;
    interval?: number;
    nextServiceDate?: string;
    serviceCharge?: number;
    discount?: number;
    paidAmount?: number;
    additionalNotes?: string;
    parentServiceOrder?: string;
    status?: string;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delayed', label: 'Delayed' },
  ];

interface ServiceOrderProps {
    initialData?: ServiceOrderFormData;
    type?: string;
    onSubmit: (data: FormData) => void;
}

const formatDateToYYYYMMDD = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

const ServiceOrder: React.FC<ServiceOrderProps> = ({ initialData, onSubmit, type }) => {
    const { register, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm<ServiceOrderFormData>({
        defaultValues: {
            order: '',
            orderId: '',
            service: '',
            customer: '',
            address: '',
            contactNumber: '',
            date: formatDateToYYYYMMDD(new Date()),
            isRecurring: false,
            interval: 0,
            nextServiceDate: formatDateToYYYYMMDD(new Date()),
            serviceCharge: 0,
            discount: 0,
            paidAmount: 0,
            additionalNotes: '',
            parentServiceOrder: '',
            status: 'pending',
            ...initialData,
        },
    });

    // States for controlled fields
    const [selectedService, setSelectedService] = useState<string>(
        typeof initialData?.service === 'object' ? initialData?.service?._id || '' : initialData?.service || ''
    );
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        typeof initialData?.customer === 'object' ? initialData?.customer?._id || '' : initialData?.customer || ''
    );
    const [selectedRecurring, setSelectedRecurring] = useState<boolean>(initialData?.isRecurring || false);
    const [addNoteContent, setAddNoteContent] = useState(initialData?.additionalNotes || '');
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | undefined>(
        statusOptions.find((option) => option.value === (initialData?.status || 'pending'))
    );

    const { service: fetchedService, loading } = useServiceById(selectedService);
    const { customer: fetchedCustomer } = useCustomerById(selectedCustomer);

    const isRecurringDisabled = !!initialData?.parentServiceOrder || false;
    
    const calculateNextServiceDate = () => {
        const isRecurring = getValues("isRecurring");
        const interval = getValues("interval") || 0; 
        const date = getValues("date");

        if (isRecurring && interval > 0 && date) {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() + interval); // Add interval in days
        setValue("nextServiceDate", formatDateToYYYYMMDD(parsedDate));
        } else {
        setValue("nextServiceDate", '');
        }
    };

    // Sync form state and controlled states when `initialData` changes
    useEffect(() => {
        if (initialData) {
            const service = typeof initialData.service === 'object' ? initialData.service._id : initialData.service || '';
            setValue('service', service);

            const customer = typeof initialData.customer === 'object' ? initialData.customer._id : initialData.customer || '';
            setValue('customer', customer);
            setValue('date', formatDateToYYYYMMDD(initialData.date || new Date()));
            setValue('nextServiceDate', formatDateToYYYYMMDD(initialData.nextServiceDate || new Date()));
            setSelectedService(service);
            setSelectedCustomer(customer);
            setValue('parentServiceOrder', initialData.parentServiceOrder || '');
            setAddNoteContent(initialData.additionalNotes || 'pending');
            setSelectedStatus(
                statusOptions.find((option) => option.value === initialData.status) || statusOptions[0]
            );
            setValue('status', initialData.status || 'pending');
        }
    }, [initialData, setValue]);

    useEffect(() => {
        if (fetchedService && !loading) {
            if (!initialData) {
                setValue("interval", fetchedService.interval || 0);
                setValue("isRecurring", fetchedService.isRecurring || false);
                setSelectedRecurring(fetchedService.isRecurring || false);
            }
            setValue("serviceCharge", fetchedService.serviceCharge || 0);
        }
    }, [fetchedService, loading, setValue]);

    useEffect(() => {
        if (fetchedCustomer && !initialData) {
            setValue("contactNumber", fetchedCustomer.phoneNo || '');
            setValue("address", fetchedCustomer.address?.addressLine || '');
        }
    }, [fetchedCustomer, loading, setValue]);

    useEffect(() => {
        calculateNextServiceDate();
    }, [watch("date"), watch("interval"), watch("isRecurring")]);

    const handleServiceChange = (value: string) => {
        setSelectedService(value);
        setValue("service", value);
    };

    const handleCustomerChange = (value: string) => {
        setSelectedCustomer(value);
        setValue("customer", value);
    };

    const handleAddNoteChange = (content: string) => {
      setAddNoteContent(content);
      setValue("additionalNotes", content);
    };

    const handleFormSubmit = async (data: ServiceOrderFormData) => {
        let filteredData: Partial<ServiceOrderFormData> = { ...data };

        if (type === "create") {
            const { order, orderId, parentServiceOrder, ...rest } = filteredData;
            filteredData = rest as Partial<ServiceOrderFormData>; 
        } else if (type === "recurring") {
            const { order, orderId, ...rest } = filteredData;
            filteredData = rest as Partial<ServiceOrderFormData>; 
        } else if (type === "reorder") {
            const { parentServiceOrder, ...rest } = filteredData;
            filteredData = rest as Partial<ServiceOrderFormData>; 
        } else {
            const { parentServiceOrder, ...rest } = filteredData;
            filteredData = {
                ...rest,
                ...(parentServiceOrder ? { parentServiceOrder } : {}), 
            };
        }
        const { nextServiceDate, isRecurring, ...rest } = filteredData;
        filteredData = {
            ...rest,
            ...(isRecurring ? { nextServiceDate } : {}), 
        };

        const formData = new FormData();
        Object.entries(filteredData).forEach(([key, value]) => {
            formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value.toString());
        });

        onSubmit(formData);
    };




    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
            <Card>
                {
                    (initialData && type === "edit") ? 
                        <CardHeader>
                            <CardTitle>Order ID: <span className="text-green-500">{initialData.orderId}</span></CardTitle>
                        </CardHeader>
                    : ''
                }
                
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                        {/* Service Select */}
                        <div className="mb-4">
                            <Label htmlFor="service">Service<span className="text-red-400">*</span></Label>
                            <ServiceSelect
                                selectedService={selectedService}
                                onChange={handleServiceChange}
                                showAddServiceButton={true}
                            />
                            {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                        </div>

                        {/* Customer Select */}
                        <div className="mb-4">
                            <Label htmlFor="customer">Customer</Label>
                            <SelectCustomer
                                selectedCustomer={selectedCustomer}
                                onChange={handleCustomerChange}
                                showAddCustomerButton={true}
                            />
                            {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer.message}</p>}
                        </div>

                         {/* phone    */}
                        <div className="mb-4">
                            <Label htmlFor="contactNumber">
                            Contact Number <span className="text-red-400">*</span>
                            </Label>
                            <Input
                            {...register("contactNumber", {
                            required: !selectedCustomer && "Contact Number is required",
                            })}
                            id="contactNumber"
                            placeholder="Enter contact number"
                            
                            />
                            {errors.contactNumber && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.contactNumber.message}
                            </p>
                            )}
                        </div>
                        
                        {/* address */}
                        <div className="mb-4">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                {...register("address", {
                                required: !selectedCustomer && "Address is required",
                                })}
                                id="address"
                                type="text"
                                placeholder="Enter address"
                            />
                            {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.address.message}
                            </p>
                            )}
                        </div>
                        {/* Service Date */}
                        <div className="mb-4">
                            <Label htmlFor="date">Service Date<span className="text-red-400">*</span></Label>
                            <Input
                                {...register("date", { required: "Service Date is required" })}
                                id="date"
                                type="date"
                                placeholder="Select service date"
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                        </div>

                        {/* parant order id */}
                        <div className="mb-4 hidden">
                            <Input
                                {...register("parentServiceOrder")}
                                id="parentServiceOrder"
                                name="parentServiceOrder"
                            />
                        </div>

                        {/* Checkbox for IsRecurring */}
                        <div className="mb-4 mt-8">
                        <Checkbox
                            id="isRecurring"
                            label="Is Recurring"
                            checked={selectedRecurring} 
                            onChange={(checked) => {
                            setSelectedRecurring(checked);
                                setSelectedRecurring(checked);
                                setValue("isRecurring", checked);
                                calculateNextServiceDate();
                            }}
                            disabled={isRecurringDisabled}
                        />
                        {errors.isRecurring && <p className="text-red-500 text-xs mt-1">{errors.isRecurring.message}</p>}
                        </div>

                        {/* Interval */}
                            <div className="mb-4">
                                <Label htmlFor="interval">Interval(Days)</Label>
                                <Input
                                {...register("interval", {
                                valueAsNumber: true,
                                required: selectedRecurring && "Interval is required",
                                onChange: () => calculateNextServiceDate(),
                                })}
                                id="interval"
                                placeholder="Enter Interval"
                                disabled={!selectedRecurring || isRecurringDisabled}
                                />
                                {errors.interval && <p className="text-red-500 text-xs mt-1">{errors.interval.message}</p>}
                            </div>

                        {/* Next Service Date */}
                        <div className="mb-4">
                            <Label htmlFor="nextServiceDate">Next Service Date</Label>
                            <Input
                                {...register("nextServiceDate")}
                                id="nextServiceDate"
                                type="date"
                                placeholder="Select next service date"
                                disabled={!selectedRecurring || isRecurringDisabled}
                            />
                            {errors.nextServiceDate && <p className="text-red-500 text-xs mt-1">{errors.nextServiceDate.message}</p>}
                        </div>

                        {/* Service Charge */}
                        <div className="mb-4">
                            <Label htmlFor="serviceCharge">Service Charge<span className="text-red-400">*</span></Label>
                            <Input
                                {...register("serviceCharge", { required: "Service charge is required" })}
                                id="serviceCharge"
                                type="number"
                                placeholder="Enter service charge"
                                readOnly
                            />
                            {errors.serviceCharge && <p className="text-red-500 text-xs mt-1">{errors.serviceCharge.message}</p>}
                        </div>

                        {/* Discount */}
                        <div className="mb-4">
                            <Label htmlFor="discount">Discount (%)</Label>
                            <Input
                                {...register("discount")}
                                id="discount"
                                type="number"
                                placeholder="Enter discount amount"
                            />
                            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
                        </div>

                        {/* Service Charge */}
                        <div className="mb-4">
                            <Label htmlFor="paidAmount">Paid Amount<span className="text-red-400">*</span></Label>
                            <Input
                                {...register("paidAmount")}
                                id="paidAmount"
                                type="number"
                                placeholder="Enter paid amount"
                            />
                            {errors.paidAmount && <p className="text-red-500 text-xs mt-1">{errors.paidAmount.message}</p>}
                        </div>

                        {/* Service status */}
                        <div className="mb-4">
                            <Label htmlFor="status">Status<span className="text-red-400">*</span></Label>
                            <Select
                                id="status"
                                value={selectedStatus} 
                                options={statusOptions}
                                onChange={(selectedOption) => {
                                    if (selectedOption) {
                                    setSelectedStatus(selectedOption);
                                    setValue('status', selectedOption.value); 
                                    } else {
                                    setSelectedStatus(undefined); 
                                    setValue('status', ''); 
                                    }
                                }}
                                placeholder="Select status"
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                />

                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
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
                    <Button type="submit">
                        {(initialData && type !== "reorder" && type !== "recurring") ? "Update" : "Create"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default ServiceOrder;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ServiceOrderSelect } from '@/components/formElements/SelectServiceOrder';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import { useServiceOrderById } from '@/hooks/useServiceOrder';

interface ServiceReference {
    _id: string;
    title?: string; 
    name?: string;
}
// Define the type for the form data
interface ServiceBillingFormData {
    serviceOrder: ServiceReference | string; 
    customer: ServiceReference | string;
    totalAmount: number;
    paidAmount: number;
    previousDue: number;
    remainingAmount: number;
}

interface ServiceBillingProps {
  initialData?: ServiceBillingFormData;
  onSubmit: (data: FormData) => void;
}

const ServiceBilling: React.FC<ServiceBillingProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServiceBillingFormData>({
        defaultValues: {
            serviceOrder: '',
            customer: '',
            totalAmount: 0,
            paidAmount: 0,
            previousDue: 0,
            remainingAmount: 0,
            ...initialData,
        },
    });

    // States for controlled fields
    const [selectedServiceOrder, setSelectedServiceOrder] = useState<string>(
        typeof initialData?.serviceOrder === 'object' ? initialData?.serviceOrder?._id || '' : initialData?.serviceOrder || ''
    );
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        typeof initialData?.customer === 'object' ? initialData?.customer?._id || '' : initialData?.customer || ''
    );

    const { serviceOrder: fetchedServiceOrder, loading } = useServiceOrderById(selectedServiceOrder);

    const paidAmount = watch("paidAmount");
    const totalAmount = watch("totalAmount");

    useEffect(() => {
        const paid = Number(paidAmount) || 0;
        const total = Number(totalAmount) || 0;

        const calculatedRemaining = total - paid; 

        setValue("remainingAmount", calculatedRemaining > 0 ? calculatedRemaining : 0);
    }, [paidAmount, totalAmount, setValue]);

    // Sync form state and controlled states when `initialData` changes
    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key as keyof ServiceBillingFormData, (initialData as any)[key]);
            });

            const serviceOrder = typeof initialData?.serviceOrder === 'object' ? initialData?.serviceOrder?._id || '' : initialData?.serviceOrder || ''
            setValue('serviceOrder', serviceOrder);

            const customer = typeof initialData?.customer === 'object' ? initialData?.customer?._id || '' : initialData?.customer || ''
            setValue('customer', customer);

            setSelectedServiceOrder(serviceOrder);
            setSelectedCustomer(customer);
        }
    }, [initialData, setValue]);

    useEffect(() => {
        if (fetchedServiceOrder && !loading) {
            setValue("customer", fetchedServiceOrder.customerId?._id || '');
            setValue("previousDue",  fetchedServiceOrder.previousDue || 0);
            const totalAmount = 
            (fetchedServiceOrder.serviceCharge || 0) + 
            (fetchedServiceOrder.previousDue || 0);

        setValue("totalAmount", totalAmount);
            setSelectedCustomer(fetchedServiceOrder.customerId?._id || '');
        }
    }, [fetchedServiceOrder, loading, setValue]);

    const handleServiceOrderChange = (value: string) => {
        setSelectedServiceOrder(value);
        setValue("serviceOrder", value);
    };

    const handleCustomerChange = (value: string) => {
        setSelectedCustomer(value);
        setValue("customer", value);
    };

    const handleFormSubmit = async (data: ServiceBillingFormData) => {
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
                            <Label htmlFor="serviceId">Service Order</Label>
                            <ServiceOrderSelect
                                selectedServiceOrder={selectedServiceOrder}
                                onChange={handleServiceOrderChange}
                                showAddServiceOrderButton={false}
                            />
                            {errors.serviceOrder && <p className="text-red-500 text-xs mt-1">{errors.serviceOrder.message}</p>}
                        </div>

                        {/* Customer Select */}
                        <div className="mb-4">
                            <Label htmlFor="customerId">Customer</Label>
                            <SelectCustomer
                                selectedCustomer={selectedCustomer}
                                onChange={handleCustomerChange}
                                showAddCustomerButton={true}
                                readOnly={true}
                            />
                            {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer.message}</p>}
                        </div>

                        {/* Service total amount */}
                        <div className="mb-4">
                            <Label htmlFor="paidAmount">Payment Amount</Label>
                            <Input
                                {...register("paidAmount", { required: "Payment amount is required" })}
                                id="paidAmount"
                                type="number"
                                placeholder="Payment Amount"
                            />
                            {errors.paidAmount && <p className="text-red-500 text-xs mt-1">{errors.paidAmount.message}</p>}
                        </div>

                        {/* Next Service Date */}
                        <div className="mb-4">
                            <Label htmlFor="previousDue">Due</Label>
                            <Input
                                {...register("previousDue")}
                                id="previousDue"
                                type="number"
                                placeholder="Due Amount"
                                readOnly
                            />
                            {errors.previousDue && <p className="text-red-500 text-xs mt-1">{errors.previousDue.message}</p>}
                        </div>

                        {/* Service Charge */}
                        <div className="mb-4">
                            <Label htmlFor="remainingAmount">Remaining Amount</Label>
                            <Input
                                {...register("remainingAmount")} 
                                id="remainingAmount"
                                type="number"
                                readOnly
                            />
                            {errors.remainingAmount && <p className="text-red-500 text-xs mt-1">{errors.remainingAmount.message}</p>}
                        </div>

                        {/* Service Charge */}
                        <div className="mb-4">
                            <Label htmlFor="totalAmount">Total Amount</Label>
                            <Input
                                {...register("totalAmount")}
                                id="totalAmount"
                                type="number"
                                readOnly
                            />
                            {errors.totalAmount && <p className="text-red-500 text-xs mt-1">{errors.totalAmount.message}</p>}
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

export default ServiceBilling;

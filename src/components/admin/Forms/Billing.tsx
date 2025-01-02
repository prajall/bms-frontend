import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ServiceOrderSelect } from '@/components/formElements/SelectServiceOrder';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import { useServiceOrderById } from '@/hooks/useService';

interface ServiceReference {
    _id: string;
    title?: string; 
    name?: string;
}
// Define the type for the form data
interface BillingFormData {
    date?: string;
    order?: string;
    serviceOrder: string; 
    customer?: ServiceReference | string;
    totalAmount?: number;
    paidAmount?: number;
    totalPaid?: number;
    remainingAmount?: number;
    orderId?: string;
    discount?: number;
    tax?: number;  
}

const formatDateToYYYYMMDD = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

interface BillingProps {
  initialData?: BillingFormData;
  onSubmit: (data: FormData) => void;
}

const Billing: React.FC<BillingProps> = ({ initialData, onSubmit }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BillingFormData>({
        defaultValues: {
            date: formatDateToYYYYMMDD(new Date()),
            order: '',
            serviceOrder: '',
            customer: '',
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0,
            orderId: '',
            discount: 0,  
            tax: 0,     
            ...initialData,
        },
    });

    // States for controlled fields
    // const [selectedServiceOrder, setSelectedServiceOrder] = useState<string>(
    //     typeof initialData?.serviceOrder === 'object' ? initialData?.serviceOrder?._id || '' : initialData?.serviceOrder || ''
    // );
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        typeof initialData?.customer === 'object' ? initialData?.customer?._id || '' : initialData?.customer || ''
    );
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(initialData?.orderId || 'Please Chose Order');

    const serviceOrderId = watch("serviceOrder");

    const { serviceOrder: fetchedServiceOrder, previousBillings, loading } = useServiceOrderById(serviceOrderId);
    const [initialRemainingAmount, setInitialRemainingAmount] = useState(0);


    // Sync form state and controlled states when `initialData` changes
    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key as keyof BillingFormData, (initialData as any)[key]);
            });
            setValue('serviceOrder', initialData?.serviceOrder || '');

            const customer = typeof initialData?.customer === 'object' ? initialData?.customer?._id || '' : initialData?.customer || ''
            setValue('customer', customer);
            setOrderId(initialData?.orderId || '');
            // setSelectedServiceOrder(serviceOrder);
            setSelectedCustomer(customer);
        }
    }, [initialData, setValue]);

    useEffect(() => {
        if (fetchedServiceOrder && !loading) {
            const payStatus = fetchedServiceOrder.paymentStatus;
            if (payStatus === 'paid' && !initialData) {
                setPaymentMessage("Payment has already been made.");
                return; 
            }
            setValue("customer", fetchedServiceOrder.customer?._id || '');
            setValue("order", fetchedServiceOrder.order || '')
            
            const totalPaidAmount = previousBillings.reduce((sum, billing) => {
                return sum + (billing.paidAmount || 0); 
            }, 0);
            // Calculate remaining amount
            const initialRemaining = (fetchedServiceOrder.serviceCharge || 0) - totalPaidAmount;
            const validRemaining = initialRemaining >= 0 ? initialRemaining : 0;

            setInitialRemainingAmount(validRemaining); 
            setValue("remainingAmount", validRemaining); 

            setValue("totalAmount", fetchedServiceOrder.serviceCharge || 0);
            setSelectedCustomer(fetchedServiceOrder.customer?._id || '');
        }
    }, [fetchedServiceOrder, previousBillings, loading, setValue]);

    useEffect(() => {
        const paid = Number(watch("paidAmount")) || 0;
        const initialRemaining = initialRemainingAmount;

        const calculatedRemaining = initialRemaining - paid;

        if (calculatedRemaining >= 0) {
            setValue("remainingAmount", calculatedRemaining);
        }
    }, [watch("paidAmount"), initialRemainingAmount, setValue]);

    // const handleServiceOrderChange = (value: string) => {
    //     setSelectedServiceOrder(value);
    //     setValue("serviceOrder", value);
    //     setPaymentMessage(null);
    // };

    const handleCustomerChange = (value: string) => {
        setSelectedCustomer(value);
        setValue("customer", value);
    };

    const handleFormSubmit = async (data: BillingFormData) => {
         const formData = new FormData();
        formData.append('date', data.date ? data.date : formatDateToYYYYMMDD(new Date()));
        formData.append('customer', data.customer ? String(data.customer) : "");
        formData.append('totalAmount', data.totalAmount !== undefined ? data.totalAmount.toString() : "0");
        formData.append('paidAmount', data.paidAmount !== undefined ? data.paidAmount.toString() : "0");
        formData.append('discount', data.discount !== undefined ? data.discount.toString() : "0");
        formData.append('tax', data.tax !== undefined ? data.tax.toString() : "0");
        const serviceOrders = [{
            serviceOrder: data.serviceOrder,
            orderId: data.orderId,  
            order: data.order, 
        }];
        const serviceOrdersJson = JSON.stringify(serviceOrders);
        formData.append('serviceOrders', serviceOrdersJson);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
                        
                        {/* Service Select */}
                        <div className="mb-4">
                            <Label htmlFor="order">Service Order</Label>
                            {/* <ServiceOrderSelect
                                selectedServiceOrder={selectedServiceOrder}
                                onChange={handleServiceOrderChange}
                                showAddServiceOrderButton={false}
                            /> */}
                            <Input type='hidden' id='serviceOrder' />
                            <Input type='hidden' id='orderId' />
                            <Input type='hidden' id='order' />
                            {orderId && <p className="text-orange-500 bold">{orderId}</p>}
                            {errors.serviceOrder && <p className="text-red-500 text-xs mt-1">{errors.serviceOrder.message}</p>}
                            {paymentMessage && <p className="text-green-500 bold">{paymentMessage}</p>}
                        </div>

                        {/* Billing Date */}
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

                        {/* Customer Select */}
                        <div className="mb-4">
                            <Label htmlFor="customer">Customer</Label>
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
                        {/* <div className="mb-4">
                            <Label htmlFor="previousDue">Due</Label>
                            <Input
                                {...register("previousDue")}
                                id="previousDue"
                                type="number"
                                placeholder="Due Amount"
                                readOnly
                            />
                            {errors.previousDue && <p className="text-red-500 text-xs mt-1">{errors.previousDue.message}</p>}
                        </div> */}

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

                        {/* Discount */}
                        <div className="mb-4">
                            <Label htmlFor="discount">Discount</Label>
                            <Input
                                {...register("discount", { required: "Discount amount is required" })}
                                id="discount"
                                type="number"
                                placeholder="Discount Amount"
                            />
                            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
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

                        {/* Tax */}
                        <div className="mb-4">
                            <Label htmlFor="tax">Tax</Label>
                            <Input
                                {...register("tax", { required: "Tax amount is required" })}
                                id="tax"
                                type="number"
                                placeholder="Tax Amount"
                            />
                            {errors.tax && <p className="text-red-500 text-xs mt-1">{errors.tax.message}</p>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button type="submit">Create</Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default Billing;

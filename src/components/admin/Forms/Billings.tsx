import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ServiceOrderSelect } from '@/components/formElements/SelectServiceOrder';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import { useServiceOrderByOrderId } from '@/hooks/useService';
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

interface ServiceReference {
  _id: string;
  orderId?: string;
  order?: string;
  service?: {
    title: string;
  };
  serviceCharge?: number;
  remainingBalance?: number;
}

interface BillingsFormData {
  date: string;
  orderId: string;
  serviceOrders: ServiceReference[];
  customer?: ServiceReference | string;
  totalAmount?: number;
  paidAmount?: number;
  previousPaidAmount?: number;
  remainingAmount?: number;
  discount?: number;
  tax?: number;
  finalTotal?: number;
}

const formatDateToYYYYMMDD = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; 
};

interface BillingsProps {
  initialData?: BillingsFormData;
  onSubmit: (data: FormData) => void;
}

const Billings: React.FC<BillingsProps> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BillingsFormData>({
    defaultValues: {
      date: formatDateToYYYYMMDD(new Date()),
      orderId: '',
      serviceOrders: [],
      customer: '',
      totalAmount: 0,
      paidAmount: 0,
      previousPaidAmount: 0,
      remainingAmount: 0,
      discount: 0,
      tax: 0,
      finalTotal: 0,
      ...initialData,
    },
  });

  const [selectedServiceOrder, setSelectedServiceOrder] = useState<string>(
    typeof initialData?.orderId === 'object' ? '' : String(initialData?.orderId)
  );
  const [serviceOrders, setServiceOrders] = useState<ServiceReference[]>(initialData?.serviceOrders || []);
  const [selectedCustomer, setSelectedCustomer] = useState<string>(
    typeof initialData?.customer === 'object'
      ? initialData?.customer?._id || ''
      : initialData?.customer || ''
  );

  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const { serviceOrder, previousBillings, loading } = useServiceOrderByOrderId(selectedServiceOrder);

  const updateServiceOrders = (newServiceOrders: ServiceReference[]) => {
    setServiceOrders(newServiceOrders);
    setValue('serviceOrders', newServiceOrders);
  };

  useEffect(() => {
    if (initialData) {
      setValue('date', formatDateToYYYYMMDD(initialData.date || new Date()));
      setValue('orderId', initialData.orderId);
      const transformedServiceOrders = initialData.serviceOrders.map((order: any) => ({
        _id: order.serviceOrder._id,
        orderId: order.orderId,
        order: order.order,
        serviceCharge: order.serviceOrder?.serviceCharge,
        // remainingBalance: order.remainingBalance || 0,
        service: {
          title: order.serviceOrder.service?.title || '',
        },
        status: order.serviceOrder?.status,
        paymentStatus: order.serviceOrder?.paymentStatus,
      }));

      setValue('serviceOrders', transformedServiceOrders);
      const customer =
        typeof initialData?.customer === 'object'
          ? initialData?.customer?._id || ''
          : initialData?.customer || '';
      setValue('customer', customer);
      updateServiceOrders(transformedServiceOrders || []);
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (selectedServiceOrder && serviceOrder && !loading) {
      const fetchedCustomer = serviceOrder.customer?._id || '';
      if (serviceOrders.length > 0 && fetchedCustomer !== selectedCustomer) {
        toast(<ErrorToast message={"Customer mismatch. Cannot add this service order."} />);
        return;
      }
      const newServiceOrders = serviceOrder.order
        .filter((newOrder: any) => {
          if (newOrder.paymentStatus === "paid" && !initialData) {
            setPaymentMessage("Payment has already been made.");
            return false; 
          }
          return true; 
        })
        .map((newOrder: any) => {
        const totalPaid = previousBillings
          .filter((billing) => billing.serviceOrder === newOrder._id)
          .reduce((sum, billing) => sum + (billing.paidAmount || 0), 0);
        return {
          ...newOrder,
          orderId: serviceOrder.orderId,
          remainingBalance: (newOrder.serviceCharge || 0) - totalPaid,
        };
        }) || [];
      
      setServiceOrders((prev) => {
        const uniqueOrders: ServiceReference[] = [
          ...prev,
          ...newServiceOrders.filter(
            (newOrder: ServiceReference) => !prev.some((existingOrder) => existingOrder._id === newOrder._id)
          ),
        ];
        setValue('serviceOrders', uniqueOrders); 
        return uniqueOrders;
      });


    //   setServiceOrders((prev) => {
    //   const uniqueOrders = [
    //     ...prev,
    //     ...newServiceOrders.filter(
    //       (newOrder:any) => !prev.some((existingOrder) => existingOrder._id === newOrder._id)
    //     ),
    //   ];
    //   return uniqueOrders;
    // });

      if (!selectedCustomer) {
        setSelectedCustomer(fetchedCustomer);
        setValue('customer', fetchedCustomer);
      }

      const totalPreviousPaid = previousBillings.reduce(
        (sum, billing) => sum + (billing.paidAmount || 0),
        0
      );

      setValue('previousPaidAmount', totalPreviousPaid);

      const totalAmount = [...serviceOrders, ...newServiceOrders].reduce(
      (sum, order) => sum + (order.serviceCharge || 0),
        0
      );

      const remainingAmount = totalAmount - totalPreviousPaid;

      setValue('totalAmount', totalAmount);
      setValue('remainingAmount', remainingAmount > 0 ? remainingAmount : 0);
    }
  }, [selectedServiceOrder, serviceOrder, loading, previousBillings]);

  useEffect(() => {
    const totalPaid = Number(watch('paidAmount')) || 0;
    const previousPaid = Number(watch('previousPaidAmount')) || 0;
    const totalAmount = Number(watch('totalAmount')) || 0;
    const discountPercentage = Number(watch('discount')) || 0;
    const taxPercentage = Number(watch('tax')) || 0;

    const discountAmount = (totalAmount * discountPercentage) / 100;
    const taxableAmount = totalAmount - discountAmount; 
    const taxAmount = (taxableAmount * taxPercentage) / 100;

    const remainingAmount = taxableAmount + taxAmount - (previousPaid + totalPaid);
    const finalTotal = Math.max(taxableAmount + taxAmount, 0);

    setValue('remainingAmount', remainingAmount > 0 ? remainingAmount : 0);
    setValue('finalTotal', finalTotal);
  }, [watch('paidAmount'), watch('previousPaidAmount'), watch('totalAmount'), watch('discount'), watch('tax')]);

  const handleServiceOrderRemove = (id: string) => {
    setServiceOrders((prev) => {
      const updatedOrders = prev.filter((order) => order._id !== id);
      const newTotalAmount = updatedOrders.reduce(
        (sum, order) => sum + (order.serviceCharge || 0),
        0
      );

      const previousPaidAmount = Number(watch('previousPaidAmount')) || 0;
      const paidAmount = Number(watch('paidAmount')) || 0;
      const newRemainingAmount = newTotalAmount - (previousPaidAmount + paidAmount);

      setValue('totalAmount', newTotalAmount);
      setValue('remainingAmount', Math.max(newRemainingAmount, 0));

      return updatedOrders;
    });
  };

  const handleServiceOrderChange = (value: string) => {
    setSelectedServiceOrder(value);
    setValue('orderId', value);
    setPaymentMessage(null);
  };

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    setValue('customer', value);
  };

  const handleFormSubmit = async (data: BillingsFormData) => {
    if (!data.serviceOrders || data.serviceOrders.length === 0) {
      toast(<ErrorToast message="Service Orders cannot be empty." />);
      return;
    }
  
    const minimalServiceOrders = data.serviceOrders.map((order) => ({
      serviceOrder: order._id,
      orderId: order.orderId,
      order: order.order,
    }));

    const transformedData = {
      ...data,
      serviceOrders: minimalServiceOrders,
    };

    const { orderId, ...dataWithoutOrderId } = transformedData;

    const formData = new FormData();

    Object.entries(dataWithoutOrderId).forEach(([key, value]) => {
      formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value.toString());
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            {/*Billing Date */}
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

            {/* Customer */}
            <div className="mb-4">
              <Label htmlFor="customer">Customer</Label>
              <SelectCustomer
                selectedCustomer={selectedCustomer}
                onChange={handleCustomerChange}
                readOnly
              />
            </div>

            {/* Order ID */}
            <div className="mb-4">
              <Label htmlFor="orderId">Order ID</Label>
              <ServiceOrderSelect
                selectedServiceOrder={selectedServiceOrder}
                onChange={handleServiceOrderChange}
                showAddServiceOrderButton={false}
                type={"OrderId"}
              />
              {errors.orderId && <p className="text-red-500 text-xs mt-1">{errors.orderId.message}</p>}
              {paymentMessage && <p className="text-green-500 bold">{paymentMessage}</p>}
            </div>
          </div>

          {/* Service Order Table */}
          <div className="mb-4">
            <Label>Service Orders</Label>
            <table className="table-auto w-full border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">SN</th>
                  <th className="border border-gray-300 px-4 py-2">Order ID</th>
                  <th className="border border-gray-300 px-4 py-2">Service</th>
                  <th className="border border-gray-300 px-4 py-2">Service Charge</th>
                  {/* <th className="border border-gray-300 px-4 py-2">Remaining Balance</th> */}
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {serviceOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.orderId}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.service?.title}</td>
                    <td className="border border-gray-300 px-4 py-2">Rs.{order.serviceCharge}</td>
                    {/* <td className="border border-gray-300 px-4 py-2">Rs.{order.remainingBalance || 0}</td> */}
                    <td className="border border-gray-300 px-4 py-2">
                      <Button variant="outline" onClick={() => handleServiceOrderRemove(order._id)}>
                        ✗
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border border-gray-300 px-4 py-2 text-right" colSpan={3}>
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Rs.{watch('totalAmount') || 0}</td>
                  {/* <td className="border border-gray-300 px-4 py-2">Rs.{watch('remainingAmount') || 0}</td> */}
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paid and Remaining Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <Label htmlFor="discount">Discount(%)</Label>
              <Input {...register('discount')} id="discount" type="number" placeholder="Enter Discount" />
            </div>

            <div className="mb-4">
              <Label htmlFor="tax">Tax(%)</Label>
              <Input {...register('tax')} id="tax" type="number" placeholder="Enter Tax" />
            </div>

            <div className="mb-4">
              <Label htmlFor="finalTotal">Final Total</Label>
              <Input {...register('finalTotal')} id="finalTotal" type="number" readOnly />
            </div>
            <div className="mb-4">
              <Label htmlFor="paidAmount">Paid Amount</Label>
              <Input
                {...register('paidAmount', { required: 'Paid amount is required' })}
                id="paidAmount"
                type="number"
                placeholder="Enter Paid Amount"
              />
              {errors.paidAmount && <p className="text-red-500 text-xs mt-1">{errors.paidAmount.message}</p>}
            </div>

            <div className="mb-4">
              <Label htmlFor="remainingAmount">Remaining Amount</Label>
              <Input {...register('remainingAmount')} id="remainingAmount" type="number" readOnly />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Billings;

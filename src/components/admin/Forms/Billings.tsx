import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ServiceOrderSelect } from '@/components/formElements/SelectServiceOrder';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import { useServiceOrderByOrderId } from '@/hooks/useService';

interface ServiceReference {
  _id: string;
  title?: string;
  serviceCharge?: number;
}

interface BillingsFormData {
  orderId: ServiceReference | string;
  serviceOrders: ServiceReference[];
  customer?: ServiceReference | string;
  totalAmount?: number;
  paidAmount?: number;
  previousPaidAmount?: number;
  remainingAmount?: number;
}

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
      orderId: '',
      serviceOrders: [],
      customer: '',
      totalAmount: 0,
      paidAmount: 0,
      previousPaidAmount: 0,
      remainingAmount: 0,
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
  console.log(selectedServiceOrder);
  const { serviceOrder, previousBillings, loading } = useServiceOrderByOrderId(selectedServiceOrder);

  useEffect(() => {
    if (initialData) {
      setValue('orderId', initialData.orderId);
      setValue('serviceOrders', initialData.serviceOrders);
      const customer =
        typeof initialData?.customer === 'object'
          ? initialData?.customer?._id || ''
          : initialData?.customer || '';
      setValue('customer', customer);
      setServiceOrders(initialData.serviceOrders || []);
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (selectedServiceOrder && serviceOrder && !loading) {
      const fetchedCustomer = serviceOrder.customer?._id || '';

      if (serviceOrders.length > 0 && fetchedCustomer !== selectedCustomer) {
        alert('Customer mismatch. Cannot add this service order.');
        return;
      }

      setServiceOrders((prev) => [...prev, ...serviceOrder.order]);

      if (!selectedCustomer) {
        setSelectedCustomer(fetchedCustomer);
        setValue('customer', fetchedCustomer);
      }

      const totalPreviousPaid = previousBillings.reduce(
        (sum, billing) => sum + (billing.paidAmount || 0),
        0
      );

      setValue('previousPaidAmount', totalPreviousPaid);

      const totalAmount = serviceOrders.reduce(
        (sum, order) => sum + (order.serviceCharge || 0),
        0
      );

      const remainingAmount = totalAmount - totalPreviousPaid;

      setValue('totalAmount', totalAmount);
      setValue('remainingAmount', remainingAmount > 0 ? remainingAmount : 0);
    }
  }, [serviceOrder, loading, selectedCustomer, previousBillings, serviceOrders, setValue]);

  useEffect(() => {
    const totalPaid = Number(watch('paidAmount')) || 0;
    const previousPaid = Number(watch('previousPaidAmount')) || 0;
    const totalAmount = Number(watch('totalAmount')) || 0;

    const remainingAmount = totalAmount - (previousPaid + totalPaid);

    setValue('remainingAmount', remainingAmount > 0 ? remainingAmount : 0);
  }, [watch('paidAmount'), watch('previousPaidAmount'), watch('totalAmount'), setValue]);

  const handleServiceOrderRemove = (id: string) => {
    setServiceOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const handleServiceOrderChange = (value: string) => {
    setSelectedServiceOrder(value);
    setValue('orderId', value);
  };

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    setValue('customer', value);
  };

  const handleFormSubmit = async (data: BillingsFormData) => {
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
          </div>

          {/* Service Order Table */}
          <div className="mb-4">
            <Label>Service Orders</Label>
            <table className="table-auto w-full border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Service Charge</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {serviceOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="border border-gray-300 px-4 py-2">{order.title}</td>
                    <td className="border border-gray-300 px-4 py-2">${order.serviceCharge}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button variant="outline" onClick={() => handleServiceOrderRemove(order._id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="font-bold">
                  <td className="border border-gray-300 px-4 py-2 text-right" colSpan={2}>
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-2">${watch('totalAmount') || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paid and Remaining Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            <div className="mb-4">
              <Label htmlFor="previousPaidAmount">Previous Billing Paid</Label>
              <Input {...register('previousPaidAmount')} id="previousPaidAmount" type="number" readOnly />
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

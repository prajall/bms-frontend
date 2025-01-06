import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import { statusOptions } from '@/components/admin/Forms/ServiceOrder';
import Select from "react-select";
import { useReactToPrint, UseReactToPrintOptions } from 'react-to-print';
import * as XLSX from 'xlsx';
import ReportHeader from './ReportHeader';

interface Customer {
  name: string;
  phoneNo: string;
  address: {
    country: string;
    province: string;
    city?: string;
    addressLine?: string;
    houseNo?: string;
  };
}

interface Service {
  _id: string;
  title: string;
}

interface ServiceOrder {
  _id: string;
  orderId: string;
  service: Service;
  customer: Customer;
  date: string;
  address: string;
  contactNumber: string;
  isRecurring: boolean;
  serviceCharge: number;
  interval?: string;
  nextServiceDate?: string;
  additionalNotes: string;
  status: string;
  paymentStatus: string;
  remainingAmount: number;
}

interface ReportData {
  totalOrders: number;
  totalServiceCharge: number;
  totalRemainingAmount: number;
  serviceOrders: ServiceOrder[];
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ServiceOrderReport: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState({
    orderId: '',
    startDate: '',
    endDate: '',
    isRecurring: '',
    customer: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const contentRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setLoading(true);
      setError(null);
      
    const params: Record<string, string> = {};
    Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof typeof filters];
        if (value) {
        params[key] = value;
        }
    });
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/report/service-order`, {
        params,
        withCredentials: true,
      });
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);
    
    // Export to Excel
  const exportToExcel = () => {
  if (!data) return;

  // Map the serviceOrders to include only the displayed fields
  const tableData = data.serviceOrders.map((order, index) => ({
    SN: index + 1,
    'Order ID': order.orderId,
    Date: formatDate(order.date),
    Service: order.service.title,
    Customer: order.customer.name,
    'Is Recurring': order.isRecurring ? 'Yes' : 'No',
    Interval: order.isRecurring ? order.interval || '-' : '-',
    'Next Service Date': order.isRecurring && order.nextServiceDate ? formatDate(order.nextServiceDate) : '-',
    'Payment Status': order.paymentStatus,
    'Service Charge': order.serviceCharge,
    'Remaining Amount': order.remainingAmount || 0,
  }));

  // Create the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Service Orders');

  // Write the file
  XLSX.writeFile(workbook, 'ServiceOrderReport.xlsx');
};
  // Print Table
    const handlePrint = useReactToPrint({
     contentRef,
    documentTitle: 'Service Order Report',
  } as UseReactToPrintOptions);

  return (
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Service Order Report</h1>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Filter by Order ID"
          value={filters.orderId}
          onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Filter by Start Date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Filter by End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        
        <SelectCustomer
            selectedCustomer={filters.customer}
            onChange={(customer) => setFilters({ ...filters, customer })}
            showAddCustomerButton={false}
         />

        <Select
            id="status"
            value={filters.status ? { value: filters.status, label: filters.status } : null}
            options={statusOptions}
            onChange={(selectedOption) => {
            if (selectedOption) {
                setFilters({ ...filters, status: selectedOption.value });
            } else {
                setFilters({ ...filters, status: '' });
            }
            }}
            placeholder="Select status"
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
        />
        {/* Filter by Is Recurring */}
        <div className="flex items-center space-x-4">
            <span className="font-semibold">Is Recurring:</span>
            <label className="flex items-center space-x-2">
            <input
                type="radio"
                name="isRecurring"
                value="true"
                checked={filters.isRecurring === 'true'}
                onChange={(e) => setFilters({ ...filters, isRecurring: e.target.value })}
                className="form-radio"
            />
            <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
            <input
                type="radio"
                name="isRecurring"
                value="false"
                checked={filters.isRecurring === 'false'}
                onChange={(e) => setFilters({ ...filters, isRecurring: e.target.value })}
                className="form-radio"
            />
            <span>No</span>
            </label>
        </div>  
        {/* Actions */}
      <div className="flex justify-end mb-4 space-x-4">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>
        <button
          onClick={() => handlePrint && handlePrint()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Print
        </button>
      </div>

      </div>
          
      <div ref={contentRef}>
          
      {/* Report Header */}
        <ReportHeader title={"Service Order Report"} />

      {/* Filter Information */}
      {/* <div className="mb-4 bg-gray-100 p-4 rounded-md">
        <ul className="list-disc ml-4">
          {filters.customer && <li>Customer Name: {filters.customer}</li>}
          {filters.startDate && <li>Start Date: {formatDate(filters.startDate)}</li>}
          {filters.endDate && <li>End Date: {formatDate(filters.endDate)}</li>}
          {filters.status && <li>Status: {filters.status}</li>}
          {filters.isRecurring && (
            <li>Is Recurring: {filters.isRecurring === 'true' ? 'Yes' : 'No'}</li>
          )}
        </ul>
      </div> */}

      {/* Orders Table */}
      {data ? (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">SN</th>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2 w-[130px]">Date</th>
              <th className="border border-gray-300 px-4 py-2">Service</th>
              <th className="border border-gray-300 px-4 py-2">Customer</th>
              <th className="border border-gray-300 px-4 py-2">Is Recurring</th>
              <th className="border border-gray-300 px-4 py-2">Interval</th>
              <th className="border border-gray-300 px-4 py-2">Next Service Date</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Service Charge</th>
              <th className="border border-gray-300 px-4 py-2">Remaining Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.serviceOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{order.orderId}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(order.date)}</td>
                <td className="border border-gray-300 px-4 py-2">{order.service.title}</td>
                <td className="border border-gray-300 px-4 py-2">{order.customer.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{order.isRecurring ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 px-4 py-2">{order.isRecurring ? order.interval || '-' : '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.isRecurring && order.nextServiceDate
                    ? formatDate(order.nextServiceDate)
                    : '-'}
                </td>
                    <td className="border border-gray-300 px-4 py-2">{order.paymentStatus}</td>
                    <td className="border border-gray-300 px-4 py-2">Rs.{order.serviceCharge}</td>
                <td className="border border-gray-300 px-4 py-2 ">Rs.{order.remainingAmount || 0}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
            <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">Totals:</td>
            <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Orders: { data.totalOrders }</td>
              <td className="border border-gray-300 px-4 py-2">
                Rs.{data.totalServiceCharge || data.serviceOrders.reduce((acc, order) => acc + order.serviceCharge, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Rs.{data.totalRemainingAmount || data.serviceOrders.reduce((acc, order) => acc + order.remainingAmount || 0, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No data available.</p>
      )}
    </div>
      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};

export default ServiceOrderReport;

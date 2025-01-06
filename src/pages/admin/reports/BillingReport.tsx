import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import SelectCustomer from '@/components/formElements/SelectCustomer';
import Select from "react-select";
import { useReactToPrint, UseReactToPrintOptions } from 'react-to-print';
import * as XLSX from 'xlsx';
import ReportHeader from './ReportHeader';

interface Customer {
  name: string;
}

interface Service {
  _id: string;
  title: string;
}

interface ServiceOrder {
  orderId: string;
  service: Service;
  date: string;
  address: string;
  contactNumber: string;
}

interface Billing {
    invoice: string;
    date: string;
    customer: Customer;
    serviceOrders: ServiceOrder[];
    totalAmount: number;
    totalPaid: number;
    status: string;
}

interface ReportData {
    totalBillings: number;
    totalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    finalTotal: number;
    billings: Billing[];
}

const statusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: 'partial', label: 'Partial' },
  ];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const BillingReport: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
    const [filters, setFilters] = useState({
        invoice: '',
        orderId: '',
        from: '',
        to: '',
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/report/billings`, {
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
  if (!data || !data.billings) return;

  // Map the billings to include all table data, including service orders
  const tableData: any[] = [];

  data.billings.forEach((billing: any, index: number) => {
    if (billing.serviceOrders.length > 0) {
      billing.serviceOrders.forEach((order: any, orderIndex: number) => {
        tableData.push({
          SN: orderIndex === 0 ? index + 1 : '', 
          Invoice: orderIndex === 0 ? billing.invoice : '', 
          Date: orderIndex === 0 ? formatDate(billing.date) : '', 
          Customer: orderIndex === 0 ? billing.customer.name : '', 
          'Order ID': order.orderId,
          'Order Date': formatDate(order.serviceOrder.date),
          'Service Title': order.serviceOrder.service?.title || 'N/A',
          'Order Address': order.serviceOrder.address,
          'Order Contact': order.serviceOrder.contactNumber,
          Status: orderIndex === 0 ? billing.status : '', 
          'Total Amount': orderIndex === 0 ? billing.totalAmount : '', 
          'Paid Amount': orderIndex === 0 ? billing.totalPaid : '', 
          'Remaining Amount': orderIndex === 0
            ? billing.totalAmount - billing.totalPaid
            : '',
        });
      });
    }  else {
      // If no service orders, add a single row for the billing
      tableData.push({
            SN: index + 1,
            Invoice: billing.invoice,
            Date: formatDate(billing.date),
            Customer: billing.customer.name,
            'Order ID': 'No Orders',
            'Order Date': 'N/A',
            'Service Title': 'N/A',
            'Order Address': 'N/A',
            'Order Contact': 'N/A',
            Status: billing.status,
            'Total Amount': billing.totalAmount,
            'Paid Amount': billing.totalPaid,
            'Remaining Amount': billing.totalAmount - billing.totalPaid,
      });
    }
  });

  // Create the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Billing Report');

  // Write the file
  XLSX.writeFile(workbook, 'BillingReport.xlsx');
};

  // Print Table
    const handlePrint = useReactToPrint({
     contentRef,
    documentTitle: 'Billing Report',
  } as UseReactToPrintOptions);

  return (
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Report</h1>

      {/* Filters */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Filter by Invoice No."
          value={filters.invoice}
          onChange={(e) => setFilters({ ...filters, invoice: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Filter by Order ID"
          value={filters.orderId}
          onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Filter by From Date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Filter by To Date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
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
      <ReportHeader title={"Service Billing Report"} />

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
                <th rowSpan={2} className="border border-gray-300 px-4 py-2">SN</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Invoice</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Date</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Customer</th>
                <th colSpan={3} className="border border-gray-300 px-4 py-2 text-start">Service Orders</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Status</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Total Amount</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Paid Amount</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Remaining Amount</th>
            </tr>
            <tr>
                <th className="border border-gray-300 px-4 py-2">Order</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>   
                <th className="border border-gray-300 px-4 py-2">Service</th>                 
            </tr>
          </thead>
          <tbody>
            {data.billings?.map((billing: any, index: number) => (
                <React.Fragment key={billing.invoice}>
                <tr className="hover:bg-gray-100">
                    <td
                className="border border-gray-300 px-4 py-2 text-center"
                rowSpan={billing.serviceOrders.length || 1}
            >
                {index + 1}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                {billing.invoice}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                {formatDate(billing.date)}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                {billing.customer.name}
            </td>
            {billing.serviceOrders.length > 0 ? (
                <>
                <td className="border border-gray-300 px-4 py-2">
                    {billing.serviceOrders[0].orderId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {formatDate(billing.serviceOrders[0].serviceOrder?.date)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {billing.serviceOrders[0].serviceOrder?.service?.title || "N/A"}
                </td>
                </>
            ) : (
                <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={3}
                >
                No Orders
                </td>
            )}
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                {billing.status}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                Rs.{billing.totalAmount}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                Rs.{billing.totalPaid}
            </td>
            <td
                className="border border-gray-300 px-4 py-2"
                rowSpan={billing.serviceOrders.length || 1}
            >
                Rs.{billing.totalAmount - billing.totalPaid}
            </td>
            </tr>
            {billing.serviceOrders.slice(1).map((order: any, orderIndex: number) => (
            <tr key={`${billing.invoice}-order-${orderIndex}`}>
                <td className="border border-gray-300 px-4 py-2">{order.orderId}</td>
                <td className="border border-gray-300 px-4 py-2">
                {formatDate(order.serviceOrder?.date)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                {order.serviceOrder?.service?.title || "N/A"}
                </td>
            </tr>
             ))}
            </React.Fragment>
            ))}
            <tr className="bg-gray-100 font-bold">
            <td colSpan={6} className="border border-gray-300 px-4 py-2 text-right">Totals:</td>
            <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Billings: { data.totalBillings }</td>
              <td className="border border-gray-300 px-4 py-2">
                Rs.{data.totalAmount || data.billings?.reduce((acc, bill) => acc + bill.totalAmount, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                Rs.{data.totalPaid || data.billings?.reduce((acc, bill) => acc + bill.totalPaid || 0, 0)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                Rs.{data.remainingAmount || data.billings?.reduce((acc, bill) => acc + bill.totalAmount - bill.totalPaid, 0)}
              </td>
              {/* <td className="border border-gray-300 px-4 py-2">
                Rs.{data.finalTotal || 0}
                </td> */}
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

export default BillingReport;

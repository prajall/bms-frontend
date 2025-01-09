import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import SelectCustomer from "@/components/formElements/SelectCustomer";
import { ProductSelect } from "@/components/formElements/ProductSelect";
import { PartSelect } from "@/components/formElements/PartSelect";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import ReportHeader from "./ReportHeader";

const POSReport: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    product: "",
    part: "",
    customer: "",
    from: "",
    to: "",
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/report/pos`, {
        params,
        withCredentials: true,
      });
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const exportToExcel = () => {
    if (!data || !data.posRecords) return;

    const tableData = data.posRecords.map((record: any, index: number) => ({
      SN: index + 1,
      Invoice: record.orderId,
      Date: new Date(record.createdAt).toLocaleDateString(),
      Customer: record.customer?.name || "Walking Customer",
      "Total Price": record.totalPrice,
      Tax: record.tax,
      Subtotal: record.subTotal,
      Discount: record.discount,
      Products: record.products.map(
        (product: any) =>
          `${product.product?.name || "N/A"} (Qty: ${product.quantity}, Price: ${product.price})`
      ).join(", "),
      Parts: record.parts.map(
        (part: any) =>
          `${part.part?.name || "N/A"} (Qty: ${part.quantity}, Price: ${part.price})`
      ).join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "POS Report");
    XLSX.writeFile(workbook, "POSReport.xlsx");
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "POS Report",
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">POS Report</h1>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductSelect
          selectedProduct={filters.product}
          onChange={(product) => setFilters({ ...filters, product })}
          showAddProductButton={false}
        />
        <PartSelect
          selectedPart={filters.part}
          onChange={(part) => setFilters({ ...filters, part })}
          showAddPartButton={false}
        />
        <SelectCustomer
          selectedCustomer={filters.customer}
          onChange={(customer) => setFilters({ ...filters, customer })}
          showAddCustomerButton={false}
        />
        <Input
          type="date"
          placeholder="From Date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <Input
          type="date"
          placeholder="To Date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
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
        <ReportHeader title="POS Report" />

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {data ? (
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2">SN</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Invoice</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Date</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Customer</th>
                <th colSpan={3} className="border border-gray-300 px-4 py-2 text-start">Products</th>
                <th colSpan={3} className="border border-gray-300 px-4 py-2 text-start">Parts</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Subtotal</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Discount</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Tax</th>
                <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-start">Total Price</th>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Qty.</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Part</th>
                <th className="border border-gray-300 px-4 py-2">Qty.</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>   
              </tr>
            </thead>
            <tbody>
              {data.posRecords.map((record: any, index: number) => (
                <React.Fragment key={record._id}>
                {/* Main Row */}
                <tr>
                  <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    } // Rowspan for products/parts
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {index + 1}
                  </td>
                  <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    {record.orderId}
                  </td>
                  <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    {record.customer?.name || "Walking Customer"}
                  </td>

                    {/* First Product Row */}
                  <td className="border border-gray-300 px-4 py-2">
                    {record.products[0]?.product?.name || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.products[0]?.quantity || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.products[0]?.price.toFixed(2) || "-"}
                  </td>

                    {/* First Part Row */}
                  <td className="border border-gray-300 px-4 py-2">
                    {record.parts[0]?.part?.name || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.parts[0]?.quantity || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.parts[0]?.price.toFixed(2) || "-"}
                  </td>

                    {/* Total Price, Tax, Subtotal, Discount */}
                    <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    Rs.{record.subTotal.toFixed(2)}
                    </td>
                    <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    {record.discount}%
                    </td>
                    <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                   {record.tax}%
                  </td>                   
                  <td
                    rowSpan={
                      Math.max(record.products.length, record.parts.length) || 1
                    }
                    className="border border-gray-300 px-4 py-2"
                  >
                    Rs.{record.totalPrice.toFixed(2)}
                  </td>
                </tr>

                {/* Remaining Product and Part Rows */}
                {Array.from({
                  length: Math.max(
                    record.products.length,
                    record.parts.length
                  ) - 1,
                }).map((_, i) => (
                  <tr key={`${record._id}-row-${i}`}>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.products[i + 1]?.product?.name || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.products[i + 1]?.quantity || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.products[i + 1]?.price.toFixed(2) || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.parts[i + 1]?.part?.name || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.parts[i + 1]?.quantity || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.parts[i + 1]?.price.toFixed(2) || "-"}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">
                  Totals:
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {data.posRecords.reduce(
                    (acc: number, record: any) =>
                      acc +
                      record.products.reduce(
                        (productAcc: number, product: any) =>
                          productAcc + (product.quantity || 0),
                        0
                      ),
                    0
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {data.posRecords.reduce(
                    (acc: number, record: any) =>
                      acc +
                      record.products.reduce(
                        (productAcc: number, product: any) =>
                          productAcc + (product.price || 0),
                        0
                      ),
                    0
                  ).toFixed(2)}
                </td>
                <td></td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {data.posRecords.reduce(
                    (acc: number, record: any) =>
                      acc +
                      record.parts.reduce(
                        (partAcc: number, part: any) => partAcc + (part.quantity || 0),
                        0
                      ),
                    0
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {data.posRecords.reduce(
                    (acc: number, record: any) =>
                      acc +
                      record.parts.reduce(
                        (partAcc: number, part: any) => partAcc + (part.price || 0),
                        0
                      ),
                    0
                  ).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Rs.
                  {data.posRecords.reduce(
                    (acc: number, record: any) => acc + record.subTotal,
                    0
                  ).toFixed(2)}
                </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                  {/* {data.posRecords.reduce(
                    (acc: number, record: any) => acc + record.discount,
                    0
                  )} */}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {/* Rs.
                  {data.posRecords.reduce(
                    (acc: number, record: any) => acc + record.tax,
                    0
                  )} */}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Rs.
                  {data.posRecords.reduce(
                    (acc: number, record: any) => acc + record.totalPrice,
                    0
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default POSReport;

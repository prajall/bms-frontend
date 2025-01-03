import React, { forwardRef } from "react";

type InvoiceProps = {
  bill: any; 
};

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ bill }, ref) => {
  return (
    <div>

      {/* Invoice Content */}
      <div ref={ref}>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md">
          {/* Header Section */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-sm text-gray-500">Invoice No: {bill?.invoice}</p>
              <p className="text-sm text-gray-500">Date: {bill?.date}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-lg">BILLED TO:</h2>
              <p>{bill?.customer ?? "Unknown Customer"}</p>
              <p>{bill?.customerPhone}</p>
              <p>{bill?.customerAddress}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-semibold text-sm">Item</th>
                <th className="text-left py-2 px-4 font-semibold text-sm">Unit</th>
                <th className="text-left py-2 px-4 font-semibold text-sm">Price</th>
              </tr>
            </thead>
            <tbody>
              {bill?.serviceOrders?.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.serviceOrder?.service?.title}</td>
                  <td className="py-2 px-4">1</td>
                  <td className="py-2 px-4">${item.serviceOrder?.serviceCharge}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="mt-6 flex justify-end text-right">
            <div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">Subtotal:</span>
                <span>${bill?.subtotal || 0}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">
                  Tax (${bill?.taxRate || 0}%):
                </span>
                <span>${bill?.tax || 0}</span>
              </div>
              <div className="flex justify-between mt-2 border-t border-black pt-2">
                <span className="font-bold text-lg">Total Due:</span>
                <span className="font-bold text-lg">${bill?.totalDue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Invoice;

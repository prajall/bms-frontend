import React, { forwardRef } from "react";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

type InvoiceProps = {
  bill: any; 
};

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ bill }, ref) => {
  const { businessConfig, loading } = useBusinessConfig();
  console.log(bill);
  const businessLogo = businessConfig?.logo || "";
  const symbol = businessConfig?.currencySymbol || "Rs."

  const subtotal = bill?.totalAmount || 0;

  // Calculate discount amount
  const discountAmount = (subtotal * (bill?.discount || 0)) / 100;

  // Calculate total after discount
  const totalAfterDiscount = subtotal - discountAmount;

  // Calculate tax amount
  const taxAmount = (totalAfterDiscount * (bill?.tax || 0)) / 100;

  // Final total after tax
  const totalAmtAfterTax = totalAfterDiscount + taxAmount;

  // Calculate balance due
  const balanceDue = totalAmtAfterTax - (bill?.totalPaid || 0);
  return (
    <div>

      {/* Invoice Content */}
      <div ref={ref}>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md">
          {/* Header Section */}
          <div>
            {!loading && businessLogo ? (
            <img src={businessLogo} alt="Logo" className="mx-auto h-10" />
          ) : (
            <span></span>
          )}
          </div>
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-sm text-gray-500">Invoice No: <strong>{bill?.invoice}</strong></p>
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
                  <td className="py-2 px-4">{ symbol } {item.serviceOrder?.serviceCharge}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="mt-6 flex justify-end text-right">
            <div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">Subtotal:</span>
                <span>{ symbol } {(bill.totalAmount || subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">
                  Discount ({bill?.discount || 0}%):
                </span>
                <span>- { symbol } {(bill.discountAmount || discountAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">Total After Discount:</span>
                <span>{ symbol } {(bill.taxableAmount || totalAfterDiscount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">Tax ({bill?.tax || 0}%):</span>
                <span>{ symbol } {(bill.taxAmount || taxAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2 border-t border-black pt-2">
                <span className="font-bold text-lg">Final Total:</span>
                <span className="font-bold text-lg">{ symbol } {(bill.finalTotal || totalAmtAfterTax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">Amount Paid:</span>
                <span>{ symbol } {bill?.totalPaid.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-sm">Balance Due:</span>
                <span>{ symbol } {balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Invoice;

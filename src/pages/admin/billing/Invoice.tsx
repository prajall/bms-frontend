import React, { useRef, useEffect } from "react";

const Invoice: React.FC<{ bill: any; }> = ({
  bill,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (componentRef.current) {
      const printContent = componentRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice-${bill?.invoice || "Document"}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
                .max-w-3xl {
                  max-width: 800px;
                  margin: auto;
                  padding: 20px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .border-b {
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 10px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f4f4f4;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      } else {
        console.error("Failed to open print window.");
      }
    } else {
      console.warn("Component ref is null, unable to print.");
    }
  };

  useEffect(() => {
    if (bill) {
      console.log("Preparing to print:", bill);
      handlePrint();
    }
  }, [bill]);

  return (
    <div>
      <div ref={componentRef}>
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
                <th className="text-left py-2 px-4 font-semibold text-sm">Quantity</th>
                <th className="text-left py-2 px-4 font-semibold text-sm">Unit Price</th>
                <th className="text-left py-2 px-4 font-semibold text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Uncomment this block to dynamically render items */}
              {/* {bill?.items?.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">${item.total.toFixed(2)}</td>
                </tr>
              ))} */}
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
};

export default Invoice;

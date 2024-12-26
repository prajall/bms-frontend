export const printPreview = (bill: any) => {
  // Create the print content with HTML structure and Tailwind CSS styles
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Bill</title>
      <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        @media print {
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body class="bg-white text-gray-800 p-6">
      <!-- Header Section -->
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold">INVOICE</h1>
          <p class="text-sm text-gray-500">Invoice No: ${bill.invoice}</p>
          <p class="text-sm text-gray-500">Date: ${bill.date}</p>
        </div>
        <div class="text-right">
          <h2 class="font-bold text-lg">BILLED TO:</h2>
          <p>${bill.customer}</p>
          <p>${bill.customerPhone}</p>
          <p>${bill.customerAddress}</p>
        </div>
      </div>

      <!-- Items Table -->
      <table class="w-full border-collapse border">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2 px-4 border-b font-semibold text-sm">Item</th>
            <th class="text-left py-2 px-4 border-b font-semibold text-sm">Quantity</th>
            <th class="text-left py-2 px-4 border-b font-semibold text-sm">Unit Price</th>
            <th class="text-left py-2 px-4 border-b font-semibold text-sm">Total</th>
          </tr>
        </thead>
        <tbody>
          ${bill.items
            .map(
              (item: any) => `
            <tr class="border-b">
              <td class="py-2 px-4">${item.name}</td>
              <td class="py-2 px-4">${item.quantity}</td>
              <td class="py-2 px-4">$${item.unitPrice.toFixed(2)}</td>
              <td class="py-2 px-4">$${item.total.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <!-- Summary Section -->
      <div class="mt-6 flex justify-end text-right">
        <div>
          <div class="flex justify-between">
            <span class="font-semibold text-sm">Subtotal:</span>
            <span>$${bill.subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between mt-2">
            <span class="font-semibold text-sm">Tax (${bill.taxRate}%):</span>
            <span>$${bill.tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between mt-2 border-t border-black pt-2">
            <span class="font-bold text-lg">Total Due:</span>
            <span class="font-bold text-lg">$${bill.totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Open a new window for the print preview
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print and close the window after printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  } else {
    console.error("Unable to open print window. Check popup blocker settings.");
  }
};

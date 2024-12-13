import React, { useEffect, useState } from "react";
import { CartItem } from "./Cart";
import { Customer } from "../customers/Index";
import Modal from "@/components/ui/Model";
import axios from "axios";

const Bill = ({
  items,
  discount,
  VATAmount,
  customerId,
  isOpen,
  onClose,
}: {
  items: CartItem[];
  discount: number;
  VATAmount: number;
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const calculateTotal = () => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.sellingPrice,
      0
    );
    const total = subtotal - discount + VATAmount;
    return { subtotal, total };
  };
  const [customer, setCustomer] = useState<Customer>();

  const { subtotal, total } = calculateTotal();

  const currentDate = new Date().toLocaleDateString();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bill Details" size="lg">
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold">Invoice</h2>
          <p className="text-sm">{currentDate}</p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">Customer Information</h3>
          <p>
            <strong>Name:</strong> "Customer Info"
          </p>
          <p>
            <strong>Phone:</strong> "Customer Info"
          </p>
          <p>
            <strong>Address:</strong> "Customer Info"
          </p>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Item</th>
                <th className="border border-gray-300 p-2 text-right">
                  Quantity
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  Unit Price
                </th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    ${item.sellingPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    ${(item.quantity * item.sellingPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT:</span>
            <span>${VATAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Bill;

import React, { useEffect, useState } from "react";
import { CartItem } from "./Cart";
import { Customer } from "../customers/Index";
import Modal from "@/components/ui/Model";
import axios from "axios";
import { Button } from "@/components/ui/button";

const Bill = ({
  discount,
  discountAmount,
  TAX_RATE,
  customerId,
  items,
  tax,
  total,
  subTotal,
}: {
  items: CartItem[];
  discount: number;
  discountAmount: number;
  TAX_RATE: number;
  tax: number;
  total: number;
  customerId: string;
  subTotal: number;
}) => {
  const [customer, setCustomer] = useState<Customer>({
    name: "Walking Customer",
    id: "string",
    user: "string",
    image: "string",
    gender: "string",
    address: "string",
    phoneNo: "string",
  });

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="p-6 space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-bold">Invoice</h2>
        <p className="text-sm">{currentDate}</p>
      </div>

      {/* Customer Info */}

      <div className="flex flex-wrap justify-between">
        <div className="p-2 flex-1">
          <p className="font-semibold">Issued</p>
          <p>{currentDate}</p>
        </div>
        <div className="pl-4 p-2 flex-1 border-x">
          <p className="font-semibold">Billed to</p>
          <p>{customer.name}</p>
        </div>
        <div className="pl-4 p-2 flex-1">
          <p className="font-semibold">From</p>
          <p>Company Name</p>
          <p>Employee name</p>
          <p>Company address</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-4">
        <table className="w-full border-collapse border-b ">
          <thead>
            <tr className="border-b">
              <th className="  p-2 text-left">Item</th>
              <th className=" p-2 text-right">Quantity</th>
              <th className=" p-2 text-right">Unit Price</th>
              <th className=" p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className=" p-2">{item.name}</td>
                <td className=" p-2 text-right">{item.quantity}</td>
                <td className=" p-2 text-right">
                  Rs {item.sellingPrice.toLocaleString()}
                </td>
                <td className=" p-2 text-right">
                  Rs {(item.quantity * item.sellingPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="w-80 ml-auto space-y-2 ">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs {subTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>{discount} %</span>
        </div>
        <div className="flex justify-between">
          <span>VAT ({(TAX_RATE * 100).toFixed(2)}%):</span>
          <span>Rs {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Bill;

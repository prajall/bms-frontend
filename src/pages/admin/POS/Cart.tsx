"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableLayout from "@/components/admin/TableLayout";
import Bill from "./Bill";

export interface Item {
  _id: string;
  sellingPrice: number;
  name: string;
  baseImage: {
    small: string;
    medium: string;
    large: string;
  };
  modelNo: string;
}
export type CartItem = Item & { quantity: number; type: string };

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEmptyCart: () => void;
  onPay: () => void;
}

const Cart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onEmptyCart,
  onPay,
}: CartProps) => {
  const TAX_RATE = 0.13;

  const subtotal = items.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const columns = [
    {
      name: "Name",
      width: "30%",
      selector: (row: CartItem) => row.name,
      cell: (row: CartItem) => (
        <div className="flex items-center gap-2 ">
          {row.baseImage && (
            <img
              src={row.baseImage.small}
              alt={row.name}
              width={40}
              height={40}
              className=" py-2 "
            />
          )}
          <p className="line-clamp-1 text-xs">{row.name}</p>
        </div>
      ),
    },
    {
      name: "Quantity",
      selector: (row: CartItem) => row.quantity,
      cell: (row: CartItem) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(row._id, row.quantity - 1)}
            disabled={row.quantity <= 1}
          >
            -
          </Button>
          <span className="w-6 text-center">{row.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(row._id, row.quantity + 1)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row: CartItem) => `NRP ${row.sellingPrice.toLocaleString()}`,
    },
    {
      name: "Sub-Total",
      selector: (row: CartItem) =>
        `NRP ${(row.sellingPrice * row.quantity).toLocaleString()}`,
    },
    {
      name: "Action",
      style: {
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },

      cell: (row: CartItem) => (
        <Button
          variant="ghost"
          className="mx-auto"
          size="sm"
          onClick={() => onRemoveItem(row._id)}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <TableLayout
          columns={columns}
          data={items}
          onAction={() => {}}
          showSearch={false}
        />
      </div>

      <div className="border-t p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sub-Total:</span>
            <span>NRP {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (13%):</span>
            <span>NRP {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>NRP {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 border-t pt-4 justify-end">
          {/* <Button variant="destructive" className="w-32" onClick={onEmptyCart}>
            Empty Cart
          </Button> */}
          <Button className="w-32" onClick={onPay}>
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Cart;

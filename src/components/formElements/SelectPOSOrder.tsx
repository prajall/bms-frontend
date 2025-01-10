import React from "react";
import AddButton from "../ui/buttons/AddButton";
import { usePOSOrders } from "@/hooks/usePOS";
import Select from "react-select";

interface POSOrderSelectProps {
  selectedPOSOrder: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddPOSOrderButton?: boolean;
  type?: string;
}

const POSOrderSelect: React.FC<POSOrderSelectProps> = ({
  selectedPOSOrder,
  onChange,
  loadingText = "Loading POS order...",
  showAddPOSOrderButton = false,
  type = '',
}) => {
  const { posOrders, loading, refetch } = usePOSOrders();
  let options = [];
  if (type === 'OrderId') {
    options = posOrders.map((order) => ({
      value: order.orderId || order._id,
      label: order.orderId,
    }));
  } else {
    options = posOrders.map((order) => ({
    value: order._id,
    label: order.orderId,
  }));
  }
  

  const handleAddPOSOrder = () => {
    console.log("Navigate to the add POS order page or show a modal.");
    // Handle navigation or modal logic for adding POS orders
  };

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <Select
          id="posorder"
          options={options}
          value={options.find((option) => option.value === selectedPOSOrder) || null}
          onChange={(option) => onChange(option ? option.value : "")}
          placeholder="Select a POS order"
          noOptionsMessage={() => "No POS orders available"}
        />
      )}

      {/* Only show "Add POSOrder" button if no POS orders and button is enabled */}
      <div className="mt-2">
        {posOrders.length === 0 && showAddPOSOrderButton && (
          <AddButton
            title="Add POS Order"
            onClick={handleAddPOSOrder}
            size="small"
          />
        )}
      </div>
    </div>
  );
};

export { POSOrderSelect };

import React from "react";
import AddButton from "../ui/buttons/AddButton";
import { useServiceOrders } from "@/hooks/useService";
import Select from "react-select";

interface ServiceOrderSelectProps {
  selectedServiceOrder: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddServiceOrderButton?: boolean;
}

const ServiceOrderSelect: React.FC<ServiceOrderSelectProps> = ({
  selectedServiceOrder,
  onChange,
  loadingText = "Loading service order...",
  showAddServiceOrderButton = false,
}) => {
  const { serviceOrders, loading, refetch } = useServiceOrders();
  const options = serviceOrders.map((order) => ({
    value: order._id,
    label: order.orderId || order._id,
  }));

  const handleAddServiceOrder = () => {
    console.log("Navigate to the add service order page or show a modal.");
    // Handle navigation or modal logic for adding service orders
  };

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <Select
          id="serviceorder"
          options={options}
          value={options.find((option) => option.value === selectedServiceOrder) || null}
          onChange={(option) => onChange(option ? option.value : "")}
          placeholder="Select a service order"
          noOptionsMessage={() => "No service orders available"}
        />
      )}

      {/* Only show "Add ServiceOrder" button if no service orders and button is enabled */}
      <div className="mt-2">
        {serviceOrders.length === 0 && showAddServiceOrderButton && (
          <AddButton
            title="Add Service Order"
            onClick={handleAddServiceOrder}
            size="small"
          />
        )}
      </div>
    </div>
  );
};

export { ServiceOrderSelect };

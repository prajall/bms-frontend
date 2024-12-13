import React, { useState, useEffect } from "react";
import axios from "axios";

import AddButton from "../ui/buttons/AddButton";
import Modal from "../ui/Model";
import AddCustomer from "@/pages/admin/customers/Create";
import Select from "react-select";

interface Customer {
  _id: string;
  name: string;
  status: string;
}

interface CustomerSelectProps {
  selectedCustomer: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddCustomerButton?: boolean;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({
  selectedCustomer,
  onChange,
  loadingText = "Loading customers...",
  showAddCustomerButton = false,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  const apiUrl = `${import.meta.env.VITE_API_URL}/customer`;

  // Fetch customers with optional search query
  const fetchCustomers = async (query: string = "") => {
    // setLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        params: { search: query },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.success) {
        const activeCustomers = response.data.data.customers;
        setCustomers(activeCustomers);
      } else {
        console.error(response.data.message || "Failed to fetch customers.");
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler); // Cleanup timeout on query change
  }, [searchQuery]);

  // Fetch customers when debounced search query changes
  useEffect(() => {
    fetchCustomers(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Initial fetch for customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const options = customers.map((customer) => ({
    value: customer._id,
    label: customer.name,
    image: "https://via.placeholder.com/40",
  }));

  return (
    <>
      <div className="w-full flex justify-between">
        {loading ? (
          <div>{loadingText}</div>
        ) : (
          <Select
            id="customer"
            options={options}
            // value={
            //   options.find((option) => option.value === selectedCustomer) || null
            // }
            onChange={(option) => onChange(option ? option.value : "")}
            onInputChange={(inputValue, { action }) => {
              if (action === "input-change") {
                setSearchQuery(inputValue); // Update search query state
              }
            }}
            placeholder="Select or type a customer"
            noOptionsMessage={() => "No customers found"}
            className="w-70"
          />
        )}

        <AddButton
          title="Add Customer"
          onClick={handleAddCustomer}
          size="medium"
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Customer"
        size="4xl"
      >
        <AddCustomer
          onSuccess={() => {
            handleCloseModal();
            fetchCustomers();
          }}
        />
      </Modal>
    </>
  );
};

export default CustomerSelect;

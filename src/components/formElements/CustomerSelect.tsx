import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AddButton from '../ui/buttons/AddButton';
import Modal from '../ui/Model';
import AddCustomer from '@/pages/admin/customers/Create';
import Select from 'react-select';

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

  // Fixed API URL for fetching customers
  const apiUrl = `${import.meta.env.VITE_API_URL}/customer`;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
          const response = await axios.get(apiUrl, {
              withCredentials: true,
            });
        if (response.status === 200 && response.data.success) {
          const activeCustomers = response.data.data.customers
          setCustomers(activeCustomers);
          setLoading(false);
        } else {
          console.error(response.data.message || "Failed to fetch customers.");
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [apiUrl]);

  const handleAddCustomer = () => {
    setIsModalOpen(true);
  };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

  const options = customers.map((customer) => ({
    value: customer.name,
    label: customer.name,
  }));

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
          <Select 
            id="customer"
            options={options}
            value={options.find((option) => option.value === selectedCustomer) || null} 
            // onChange={(option) => onChange((option as { value: string; label: string }).value)} 
            onChange={(option) => onChange(option ? option.value : "")}
            placeholder="Select or type a customer"
            noOptionsMessage={() => "Select or type a customer"}
          />
      )}
          
          <div className="mt-2">
              {customers.length === 0 && showAddCustomerButton && (
                <AddButton title="Add Customer" onClick={handleAddCustomer} size="small"/>
                )}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create Customer" size="4xl">
        <AddCustomer
            onSuccess={() => {
            handleCloseModal();
        }} 
        />
    </Modal>
    </div>
    </div>
  );
};

export default CustomerSelect;

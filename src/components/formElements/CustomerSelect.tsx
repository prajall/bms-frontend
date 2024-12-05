import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';
import ComboBox from '../ui/Combobox';
import Modal from '../ui/Model';
import AddCustomer from '@/pages/admin/customers/Create';

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
          const response = await axios.get(apiUrl);
          console.log(response.data.data.customers);
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
      <Label htmlFor="customer">Customer</Label>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <ComboBox
          id="customer"
          options={options}
          value={selectedCustomer}
          onChange={onChange}
          placeholder="Select or type a customer"
          noOptionsText="No customers available"
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

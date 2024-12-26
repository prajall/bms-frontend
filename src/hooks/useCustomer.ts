import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Customer {
    _id: string;
    name: string;
    phoneNo?: string;
    address?: {
        addressLine: string;
        city: string;
        country: string;
        province: string;
        houseNo: string;
     };
}

const useCustomerById = (id: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomerById = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/customer/${id}`;
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200 && response.data.success) {
          setCustomer(response.data.data);
        } else {
          console.error(response.data.message || "Failed to fetch customer by ID.");
        }
      } catch (err) {
        console.error("Failed to fetch customer by ID:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerById();
    }
  }, [id]);

  return { customer, loading };
};

export { useCustomerById };
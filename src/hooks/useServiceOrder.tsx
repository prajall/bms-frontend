import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface ServiceOrder {
    _id: string;
    title: string;
     customer?: {
        _id: string;
        name: string;
     };
    previousDue: number;
    serviceCharge: number;
}

const useServiceOrders = () => {
  const [serviceOrders, setServiceOrder] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchServiceOrder = useCallback(async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/service-order`;
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      console.log("API Response:", response.data); // Debug
      if (response.status === 200 && response.data.success) {
        setServiceOrder(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch service order:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceOrder();
  }, [fetchServiceOrder]);

  return { serviceOrders, loading, refetch: fetchServiceOrder };
};

const useServiceOrderById = (id: string) => {
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServiceOrderById = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/service-order/${id}`;
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.message === "Service order retrieved successfully") {
          setServiceOrder(response.data.data);
        } else {
          console.error(response.data.message || "Failed to fetch service order by ID.");
        }
      } catch (err) {
        console.error("Failed to fetch service order by ID:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceOrderById();
    }
  }, [id]);

  return { serviceOrder, loading };
};

export { useServiceOrders, useServiceOrderById };

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SuccessToast, ErrorToast } from '@/components/ui/customToast';


export interface ServiceOrder {
  _id: string;
  title: string;
    customer?: {
      _id: string;
      name: string;
    };
  // previousDue: number;
  serviceCharge: number;
  interval?: number;
  isRecurring?: boolean;
  orderId?: string;
  remainingAmount?: number;
  paidAmount?: number;
  paymentStatus?: string;
}

const useServiceById = (id: string) => {
  const [service, setService] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServiceById = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/service/${id}`;
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200 && response.data.success) {
          setService(response.data.data);
        } else {
          console.error(response.data.message || "Failed to fetch service by ID.");
        }
      } catch (err) {
        console.error("Failed to fetch service by ID:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceById();
    }
  }, [id]);

  return { service, loading };
};

const createServiceOrder = async (formData: FormData, onSuccess: () => void) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/service-order`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });

        if (response.status === 201 && response.data.success) {
            toast(<SuccessToast message={response.data.message} />, {
                autoClose: 5000, 
            });
            onSuccess();
        } else {
            toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
                autoClose: 4000,
            });
        }
    } catch (error: any) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || "Failed to create service order.";
            toast(<ErrorToast message={errorMessage} />, {
                autoClose: 4000, 
            });
        } else {
            toast(<ErrorToast message={"Network error. Please try again later."} />, {
                autoClose: 4000, 
            });
        }              
    }
};

const useServiceOrders = () => {
  const [serviceOrders, setServiceOrder] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchServiceOrder = useCallback(async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/service-order/mini-list`;
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
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
  const [previousBillings, setPreviousBillings] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServiceOrderById = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/service-order/${id}`;
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.message === "Service order retrieved successfully") {
          setServiceOrder(response.data.data.serviceOrder);
          setPreviousBillings(response.data.data.previousBillings || []);
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

  return { serviceOrder, previousBillings, loading };
};

export { useServiceById,createServiceOrder, useServiceOrders, useServiceOrderById };

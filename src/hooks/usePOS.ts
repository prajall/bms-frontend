
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface PosOrder {
  _id: string;
  title: string;
  customer?: {
    _id: string;
    name: string;
  };
  order?: any;
  orderId?: string;
}

const usePOSOrders = () => {
  const [ posOrders, setPosOrders] = useState<PosOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPOSOrder = useCallback(async () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/pos/mini-list`;
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      if (response.status === 200 && response.data.success) {
        setPosOrders(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch pos order:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPOSOrder();
  }, [fetchPOSOrder]);

  return { posOrders, loading, refetch: fetchPOSOrder };
};

const usePOSOrderById = (id: string) => {
  const [posOrder, setPosOrder] = useState<PosOrder | null>(null);
  const [pastBillings, setPastBillings] = useState<PosOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPOSOrderById = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/pos/${id}`;
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.message === "POS order retrieved successfully") {
          setPosOrder(response.data.data.pos);
          setPastBillings(response.data.data.previousBillings || []);
        } else {
          console.error(response.data.message || "Failed to fetch POS order by ID.");
        }
      } catch (err) {
        console.error("Failed to fetch POS order by ID:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPOSOrderById();
    }
  }, [id]);

  return { posOrder, setPastBillings, loading };
};

export { usePOSOrders, usePOSOrderById };
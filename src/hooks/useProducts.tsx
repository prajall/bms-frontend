import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  modelNo: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/product/mini-list`;
      try {
        const response = await axios.get(apiUrl, {
              withCredentials: true,
            });
        if (response.status === 200 && response.data.success) {
          const activeProducts = response.data.data.products
          setProducts(activeProducts);
        } else {
          console.error(response.data.message || "Failed to fetch products.");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

export default useProducts;

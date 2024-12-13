import { useState, useEffect } from 'react';
import axios from 'axios';

interface ServiceProvided {
  _id: string;
  title: string;
}

const useServiceProvided = () => {
  const [serviceprovided, setServiceProvided] = useState<ServiceProvided[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServiceProvided = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/service-provided`;
      try {
        const response = await axios.get(apiUrl, {
              withCredentials: true,
        });
        if (response.status === 200 && response.data.success) {
          const activeServiceProvided = response.data.data
          setServiceProvided(activeServiceProvided);
        } else {
          console.error(response.data.message || "Failed to fetch service provided.");
        }
      } catch (err) {
        console.error("Failed to fetch service provided:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProvided();
  }, []);

  return { serviceprovided, loading };
};

export default useServiceProvided;

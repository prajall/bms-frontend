import { useState, useEffect } from 'react';
import axios from 'axios';

interface Part {
  _id: string;
  name: string;
  status: string;
}

const useParts = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchParts = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/part/mini-list`;
      try {
        const response = await axios.get(apiUrl, {
              withCredentials: true,
        });
        if (response.status === 200 && response.data.success) {
          const activeParts = response.data.data.parts
          setParts(activeParts);
        } else {
          console.error(response.data.message || "Failed to fetch parts.");
        }
      } catch (err) {
        console.error("Failed to fetch parts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  return { parts, loading };
};

export default useParts;

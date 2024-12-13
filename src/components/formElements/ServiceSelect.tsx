import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AddButton from '../ui/buttons/AddButton';
import Modal from '../ui/Model';
import AddService from '@/pages/admin/services/service/Create';
import Select from 'react-select';

interface Service {
  _id: string;
  title: string;
  status: string;
}

interface ServiceSelectProps {
  selectedService: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddServiceButton?: boolean;
}

const ServiceSelect: React.FC<ServiceSelectProps> = ({
  selectedService,
  onChange,
  loadingText = "Loading services...",
  showAddServiceButton = false,
}) => {
  const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

  // Fixed API URL for fetching services
  const apiUrl = `${import.meta.env.VITE_API_URL}/service`;

  useEffect(() => {
    const fetchServices = async () => {
      try {
          const response = await axios.get(apiUrl, {
              withCredentials: true,
            });
          if (response.status === 200 && response.data.success) {
          const activeServices = response.data.data.services
          setServices(activeServices);
          setLoading(false);
        } else {
          console.error(response.data.message || "Failed to fetch services.");
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setLoading(false);
      }
    };

    fetchServices();
  }, [apiUrl]);

  const handleAddService = () => {
    setIsModalOpen(true);
  };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

  const options = services.map((service) => ({
    value: service._id,
    label: service.title,
  }));

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
          <Select 
            id="service"
            options={options}
            value={options.find((option) => option.value === selectedService) || null} 
            // onChange={(option) => onChange((option as { value: string; label: string }).value)} 
            onChange={(option) => onChange(option ? option.value : "")}
            placeholder="Select or type a service"
            noOptionsMessage={() => "Select or type a service"}
          />
      )}
          
          <div className="mt-2">
              {services.length === 0 && showAddServiceButton && (
                <AddButton title="Add Service" onClick={handleAddService} size="small"/>
                )}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create service" size="4xl">
        <AddService
            onSuccess={() => {
            handleCloseModal();
        }} 
        />
    </Modal>
    </div>
    </div>
  );
};

export default ServiceSelect;

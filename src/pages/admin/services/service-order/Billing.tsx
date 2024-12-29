import { useEffect, useState } from "react";
import axios from "axios";
import Billing from "@/components/admin/Forms/Billing";
import { createBilling } from "@/hooks/useBilling";

type ServiceBillingProps = {
    orderId: string;
    onSuccess: () => void;
};

interface Billing {
    serviceOrder: string;
    orderId: string;
}

const ServiceBilling = ({ orderId, onSuccess }: ServiceBillingProps) => {
    const [initialData, setInitialData] = useState<Billing | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch product data from the API
        const fetchServiceOrder = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/service-order/${orderId}`, {
              withCredentials: true,
            });
            if (response.data.success) {
                const order = response.data.data.serviceOrder;
                const mappedData: Billing = {
                    serviceOrder: order._id,
                    orderId: order.orderId,
                }
                setInitialData(mappedData);
            } else {
                console.error("Failed to fetch service order data.")
            }  
        } catch (error) {
            console.error("Failed to fetch service data.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchServiceOrder();
    }, [orderId]);


    const handleAddServiceBilling = async (formData: FormData) => {
        createBilling(formData, () => {
            onSuccess(); 
        });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <div className="relative">
            <Billing initialData={initialData} onSubmit={handleAddServiceBilling} />
        </div>
    );
}

export default ServiceBilling
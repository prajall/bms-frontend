import { useEffect, useState } from "react";
import axios from "axios";
import ServiceOrder from "@/components/admin/Forms/ServiceOrder";
import { createServiceOrder } from "@/hooks/useService";

type ReOrderProps = {
    orderId: string;
    onSuccess: () => void;
};

interface ServiseRecurring {
    order: string;
    customer: string;
    contactNumber: string;
    address: string;
    orderId: string;
    // isRecurring: boolean;
    // date: string;
}

const ReOrder = ({ orderId, onSuccess }: ReOrderProps) => {
    const [initialData, setInitialData] = useState<ServiseRecurring | null>(null);
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
                const mappedData: ServiseRecurring = {
                    order: order.order,
                    orderId: order.orderId,
                    customer: order.customer?._id,
                    contactNumber: order.contactNumber || '',
                    address: order.address || '',
                    // isRecurring: false,
                    // date: order.nextServiceDate,
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


    const handleAddServiceOrder = async (formData: FormData) => {
        createServiceOrder(formData, () => {
            onSuccess(); 
        });
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <div className="relative">
            <ServiceOrder initialData={initialData} type={"reorder"} onSubmit={handleAddServiceOrder} />
        </div>
    );
}

export default ReOrder
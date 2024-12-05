import React,{ useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Customer from "@/components/admin/Forms/Customer";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const EditCustomer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Assume `id` comes from route params
    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product data from the API
        const fetchCustomer = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/${id}`, {
              withCredentials: true,
            });
            setInitialData(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch customer data.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchCustomer();
    }, [id]);

    const handleEditCustomer = async (formData: FormData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/customer/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                // withCredentials: true,
            });
            if (response.status === 200 && response.data.success) {
                toast.success(response.data.message); 
                navigate("/admin/customers");
            } else {
                // Handle unexpected cases (optional safeguard)
                toast.error(response.data.message || "Unexpected response format.");
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to update customer.";
                toast.error(errorMessage);
            } else {
                toast.error("Network error. Please try again later.");
            }
        }
    };

    if (!initialData) return <p>Loading...</p>;

    return (
        <div>
            <Breadcrumb pageName="Edit Customer" />
            <Customer initialData={initialData} onSubmit={handleEditCustomer} />
        </div>
    );
};

export default EditCustomer;

import React,{ useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Service from "@/components/admin/Forms/Service";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { useNavigate } from "react-router-dom";


const EditService: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Assume `id` comes from route params
    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product data from the API
        const fetchService = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/service/${id}`, {
              withCredentials: true,
            });
            setInitialData(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch service data.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchService();
    }, [id]);

    const handleEditService = async (formData: FormData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/service/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                // withCredentials: true,
            });
            if (response.status === 200 && response.data.success) {
                toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000, 
                });
                navigate("/admin/service");
            } else {
                toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
                    autoClose: 4000,
                });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to create service.";
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

    if (!initialData) return <p>Loading...</p>;

    return (
        <div>
            <Breadcrumb pageName="Edit Service" />
            <Service initialData={initialData} onSubmit={handleEditService} />
        </div>
    );
};

export default EditService;

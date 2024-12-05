import React,{ useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Role from "@/components/admin/Forms/Role";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { useNavigate } from "react-router-dom";


const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product data from the API
        const fetchRole = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/role/${id}`, {
              withCredentials: true,
            });
            setInitialData(response.data.data);
        } catch (error) {
            toast(<ErrorToast message={"Failed to fetch role data."} />, {
                    autoClose: 4000,
                });
        } finally {
            setIsLoading(false);
        }
        };

        fetchRole();
    }, [id]);

    const handleEditRole = async (formData: FormData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/role/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                // withCredentials: true,
            });
            if (response.status === 200 && response.data.success) {
                toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000, 
                });
                navigate("/admin/roles");
            } else {
                toast(<ErrorToast message={response.data.message || "An unexpected error occurre."} />, {
                    autoClose: 4000,
                });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to update role.";
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
            <Breadcrumb pageName="Edit Role" />
            <Role initialData={initialData} onSubmit={handleEditRole} />
        </div>
    );
};

export default EditRole;

import React, {useState} from "react";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import ProductCategory from "@/components/admin/Forms/ProductCategory";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type AddCategoryProps = {
  onSuccess: () => void;
};

const AddCategogy = ({ onSuccess }: AddCategoryProps) => {
    const handleAddCategory = async (formData: FormData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/category`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (response.status === 201 && response.data.success) {
                toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000, 
                });
                onSuccess();
            } else {
                toast(<ErrorToast message={response.data.message || "An unexpected error occurre."} />, {
                    autoClose: 4000,
                });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to create category.";
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

    return (
        <div className="relative">
            {/* <Breadcrumb pageName="Add Category" /> */}
            <ProductCategory onSubmit={handleAddCategory} />
        </div>
    );
}

export default AddCategogy
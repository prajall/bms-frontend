import React from "react";
import axios from "axios";
import ProductForm from "@/components/admin/Forms/Product";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type AddProductProps = {
  onSuccess: () => void;
};

const AddProduct  = ({ onSuccess }: AddProductProps) => {
    const handleAddProduct = async (formData: FormData) => {
            try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/product`, formData, {
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
                const errorMessage = error.response.data.message || "Failed to create product.";
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
            {/* <Breadcrumb pageName="Add Product" /> */}
            <ProductForm initialData={undefined} onSubmit={handleAddProduct} />
        </div>
    );
}

export default AddProduct
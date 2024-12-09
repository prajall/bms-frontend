import React, { useState } from "react";
import axios from "axios";
import Role from "@/components/admin/Forms/Role";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type AddRoleProps = {
  onSuccess: () => void;
};

const AddRole = ({ onSuccess }: AddRoleProps) => {
    const handleAddRole = async (formData: FormData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/role`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            
            if (response.status === 201 && response.data.success) {
                toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000,
                });
                onSuccess();
            } else {
                toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
                    autoClose: 4000,
                });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to create role.";
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
            {/* <Breadcrumb pageName="Add Role" /> */}
            <Role onSubmit={handleAddRole} />
        </div>
    );
}

export default AddRole
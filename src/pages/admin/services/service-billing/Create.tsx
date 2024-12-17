import React, { useState } from "react";
import axios from "axios";
import ServiceBilling from "@/components/admin/Forms/ServiceBilling";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type AddServiceBillingProps = {
  onSuccess: () => void;
};

const AddServiceBilling = ({ onSuccess }: AddServiceBillingProps) => {
    const handleAddServiceBilling = async (formData: FormData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/service-billing`, formData, {
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
                const errorMessage = error.response.data.message || "Failed to create service billing.";
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
            <ServiceBilling onSubmit={handleAddServiceBilling} />
        </div>
    );
}

export default AddServiceBilling
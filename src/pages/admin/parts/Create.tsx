import React from "react";
import axios from "axios";
import PartForm from "@/components/admin/Forms/Part";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type AddPartProps = {
  onSuccess: (newPart: any) => void;
};

const AddPart = ({ onSuccess }: AddPartProps) => {
  const handleAddPart = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/part`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 201 && response.data.success) {
        toast(<SuccessToast message={response.data.message} />, {
          autoClose: 5000,
        });
        console.log(response.data);
        onSuccess(response.data.data);
      } else {
        toast(
          <ErrorToast
            message={response.data.message || "An unexpected error occurre."}
          />,
          {
            autoClose: 4000,
          }
        );
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Failed to create part.";
        toast(<ErrorToast message={errorMessage} />, {
          autoClose: 4000,
        });
      } else {
        toast(
          <ErrorToast message={"Network error. Please try again later."} />,
          {
            autoClose: 4000,
          }
        );
      }
    }
  };

  return (
    <div className="relative">
      {/* <Breadcrumb pageName="Add Part" /> */}
      <PartForm initialData={undefined} onSubmit={handleAddPart} />
    </div>
  );
};

export default AddPart;

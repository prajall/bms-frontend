import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import PartForm from "@/components/admin/Forms/Part";
import { PartFormData } from "@/components/admin/Forms/Part";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const EditPart: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [initialData, setInitialData] = useState<PartFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch part data from the API
    const fetchPart = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/part/${id}`, {
          withCredentials: true,
        });
          if (response.data.success) {
          const part = response.data.data;
          setInitialData(part);
        }
      } catch (error) {
        console.log("Failed to fetch part data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPart();
  }, [id]);

  const handleEditPart = async (formData: FormData) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/part/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.status === 200 && response.data.success) {
            toast(<SuccessToast message={response.data.message} />, {
              autoClose: 5000, 
            });
        navigate("/admin/parts");
        } else {
        toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
              autoClose: 4000,
            });
        }
    } catch (error: any) {
      if (error.response && error.response.data) {
          const errorMessage = error.response.data.message || "Failed to update part.";
              toast(<ErrorToast message={errorMessage} />, {
                autoClose: 4000, 
              });
      } else {
          toast(<ErrorToast message="Network error. Please try again later." />, {
            autoClose: 4000, 
          });
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Display loading message while fetching data
  }

  return (
    <div className="relative">
      <Breadcrumb pageName="Edit Part" />
      <PartForm initialData={initialData} onSubmit={handleEditPart} />
    </div>
  );
};

export default EditPart;

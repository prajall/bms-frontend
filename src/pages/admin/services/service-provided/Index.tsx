import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
} from "@/components/ui/buttons/IconBtn";
import AddServiceProvided from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ServiceProvided = {
    id: string;
    service: string;
    serviceOrder: string;
    title: string;
    date: string;
    products: string[];
    parts: string[];
    serviceCharge: string;
    workDetail: string;
    additionalNotes: string;
};

const ServiceProvidedIndex = () => {
  const [serviceData, setServiceData] = useState<ServiceProvided[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServiceData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-provided`
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.map((item: any) => ({
            id: item._id,
            title: item.title || "",
            service: item.serviceId?.title || "",
            serviceOrder: item.serviceOrderId?._id || '',
            date: item.date
                ? new Date(item.date).toISOString().split("T")[0]
                : "",
            products: item.products.length
                ? item.products.map((product: any) => product.name).join(", ")
                : "",
            parts: item.parts.length
                ? item.parts.map((part: any) => part.name).join(", ")
                : "",
            serviceCharge: item.serviceCharge
                ? item.serviceCharge.toString()
                : "0",
            workDetail: stripHtmlTags(item.workDetail || ""),
            additionalNotes: stripHtmlTags(item.additionalNotes || ""),
        }));
        setServiceData(formattedData);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch service.");
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  const stripHtmlTags = (str: any) => {
    if (!str) return "";
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service proviced?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/service-provided/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchServiceData(); // Refresh data
        } else {
          toast(
            <ErrorToast
              message={response.data.message || "Unexpected response format."}
            />,
            {
              autoClose: 4000,
            }
          );
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.message || "Failed to delete service provided.";
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
    }
  };

  const columns = [
    {
      name: "SN",
      // selector: (_: Service, index: number) => index + 1,
      cell: (_: ServiceProvided, index: number) => index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Title",
      selector: (row: ServiceProvided) => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: "Service",
      selector: (row: ServiceProvided) => row.service,
      sortable: true,
      },
    {
      name: "Order",
      selector: (row: ServiceProvided) => row.serviceOrder,
      sortable: true,
      },
    { name: "Date", selector: (row: ServiceProvided) => row.date },
    { name: "Products", selector: (row: ServiceProvided) => row.products, wrap: true },
    { name: "Parts", selector: (row: ServiceProvided) => row.parts, wrap: true },
    { name: "Charge", selector: (row: ServiceProvided) => row.serviceCharge },
    // {
    //   name: "Work Details",
    //   selector: (row: ServiceProvided) => row.workDetail,
    //   wrap: true,
    // },
    // {
    //   name: "Additional Note",
    //   selector: (row: ServiceProvided) => row.additionalNotes,
    //   wrap: true,
    // },
    {
      name: "Action",
      cell: (row: ServiceProvided) => (
        <div className="inline-flex space-x-2">
          <ShowIcon link={`/admin/service_provided/show/${row.id}`} />
          <EditIcon link={`/admin/service_provided/edit/${row.id}`} />
          <DeleteIcon onClick={() => handleAction("delete", row.id)} />
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    fetchServiceData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 justify-between mt-1">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            className="w-full pl-10" // Adds padding to avoid overlapping with the icon
            placeholder="Search Services provided"
          />
        </div>
        <AddButton title="Add Service" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={serviceData}
        onAction={handleAction}
      />

      {/* Modal for Adding Service */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Service Provided"
        size="6xl"
      >
        <AddServiceProvided
          onSuccess={() => {
            handleCloseModal();
            fetchServiceData();
          }}
        />
      </Modal>
    </div>
  );
};

export default ServiceProvidedIndex;

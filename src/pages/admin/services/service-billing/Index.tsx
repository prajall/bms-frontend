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
import AddServiceBilling from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ServiceBilling = {
    id: string;
    serviceOrder: string;
    customer: string;
    totalAmount: number;
    paidAmount: number;
    previousDue: number;
    remainingAmount: number;
};

const ServiceBillingIndex = () => {
  const [serviceBillingData, setServiceBillingData] = useState<ServiceBilling[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServiceBillingData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-billing`
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.map((item: any) => ({
            id: item._id,
            serviceOrder: item.serviceOrder?._id || "",
            customer: item.customer?.name || "",
            totalAmount: item.totalAmount,
            paidAmount: item.paidAmount,
            previousDue: item.previousDue,
            remainingAmount: item.remainingAmount,
        }));
        setServiceBillingData(formattedData);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch service order.");
      }
    } catch (error) {
      console.error("Error fetching service order data:", error);
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service order?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/service-billing/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchServiceBillingData(); // Refresh data
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
            error.response.data.message || "Failed to delete service order.";
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
        // selector: (_: ServiceBilling, index: number) => index + 1,
        cell: (_: ServiceBilling, index: number) => index + 1,
        sortable: false,
        width: "60px",
        },
        {
        name: "Service Order",
        selector: (row: ServiceBilling) => row.serviceOrder,
            sortable: true,
            wrap: true
        },
        {
        name: "Customer",
        selector: (row: ServiceBilling) => row.customer,
            sortable: true,
            wrap: true
        },
        { name: "Paid Amount", selector: (row: ServiceBilling) => row.paidAmount, wrap: true, sortable: true },
        { name: "Due", selector: (row: ServiceBilling) => row.previousDue, sortable: true },
        { name: "Remaining Amount", selector: (row: ServiceBilling) => row.remainingAmount, sortable: true },
        { name: "Total Amount", selector: (row: ServiceBilling) => row.totalAmount, sortable: true },
        {
        name: "Action",
        cell: (row: ServiceBilling) => (
            <div className="inline-flex space-x-2">
            <ShowIcon link={`/admin/service_billing/show/${row.id}`} />
            <EditIcon link={`/admin/service_billing/edit/${row.id}`} />
            <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            </div>
        ),
        sortable: false,
        },
  ];

  useEffect(() => {
    fetchServiceBillingData();
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
            placeholder="Search Service Billings"
          />
        </div>
        <AddButton title="Add Service Billing" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={serviceBillingData}
        onAction={handleAction}
      />

      {/* Modal for Adding Service Billing */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Service Billing"
        size="4xl"
      >
        <AddServiceBilling
          onSuccess={() => {
            handleCloseModal();
            fetchServiceBillingData();
          }}
        />
      </Modal>
    </div>
  );
};

export default ServiceBillingIndex;

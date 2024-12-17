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
import AddServiceOrder from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useServiceOrders } from "@/hooks/useServiceOrder";

type ServiceOrder = {
    id: string;
    service: string;
    customer: string;
    serviceCharge: string;
    serviceDate: Date;
    nextDate: Date;
};

const ServiceOrderIndex = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { serviceOrders, loading, refetch } = useServiceOrders();

  const serviceOrderData = serviceOrders.map((item: any) => ({
    id: item._id,
    service: item.serviceId?.title || "",
    customer: item.customerId?.name || "",
    serviceCharge: item.serviceCharge ? item.serviceCharge.toString() : "0",
    serviceDate: item.date
      ? new Date(item.date).toISOString().split("T")[0]
      : "",
    nextDate: item.nextServiceDate
      ? new Date(item.nextServiceDate).toISOString().split("T")[0]
      : "",
  }));

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service order?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/service-order/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          refetch(); // Refresh data
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
        // selector: (_: ServiceOrder, index: number) => index + 1,
        cell: (_: ServiceOrder, index: number) => index + 1,
        sortable: false,
        width: "60px",
        },
        {
        name: "Order ID",
        selector: (row: ServiceOrder) => row.id,
            sortable: true,
            wrap: true
        },
        {
        name: "Service",
        selector: (row: ServiceOrder) => row.service,
            sortable: true,
            wrap: true
        },
        { name: "Customer", selector: (row: ServiceOrder) => row.customer, wrap: true, sortable: true },
        { name: "Charge", selector: (row: ServiceOrder) => row.serviceCharge },
        { name: "Date", selector: (row: ServiceOrder) => row.serviceDate, sortable: true },
        { name: "Next Date", selector: (row: ServiceOrder) => row.nextDate, sortable: true },
        {
        name: "Action",
        cell: (row: ServiceOrder) => (
            <div className="inline-flex space-x-2">
            <ShowIcon link={`/admin/service_order/show/${row.id}`} />
            <EditIcon link={`/admin/service_order/edit/${row.id}`} />
            <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            </div>
        ),
        sortable: false,
        },
  ];

  // useEffect(() => {
  //   fetchServiceOrderData();
  // }, []);

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
            placeholder="Search ServiceOrders"
          />
        </div>
        <AddButton title="Add ServiceOrder" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={serviceOrderData}
        onAction={handleAction}
      />

      {/* Modal for Adding ServiceOrder */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Service Order"
        size="6xl"
      >
        <AddServiceOrder
          onSuccess={() => {
            handleCloseModal();
            refetch();;
          }}
        />
      </Modal>
    </div>
  );
};

export default ServiceOrderIndex;

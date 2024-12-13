import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import { Button } from "@/components/ui/button";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
} from "@/components/ui/buttons/IconBtn";
import AddCustomer from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

export type Customer = {
  id: string;
  user: string;
  name: string;
  image: string;
  gender: string;
  address: string;
  phoneNo: string;
};

const CustomerIndex = () => {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/customer`
      );
      if (response.status === 200 && response.data.success) {
        console.log(response.data.data.customers);
        const formattedData = response.data.data.customers.map(
          (customer: any) => ({
            id: customer._id,
            name: customer.name,
            gender: customer.gender,
            image: customer.image || "",
            address: `${customer.address.houseNo}, ${customer.address.addressLine}, ${customer.address.city}, ${customer.address.province}, ${customer.address.country}`,
            phoneNo: customer.mobileNo1,
          })
        );
        setCustomerData(formattedData);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch customers.");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/customer/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchCustomerData(); // Refresh data
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
            error.response.data.message || "Failed to delete customer.";
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
      // selector: (_: Customer, index: number) => index + 1,
      cell: (_: Customer, index: number) => index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Image",
      cell: (row: Customer) => (
        <img
          src={row.image}
          alt={row.name}
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        />
      ),
      sortable: false,
      width: "90px",
    },
    {
      name: "Name",
      selector: (row: Customer) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row: Customer) => row.gender,
      sortable: true,
      width: "100px",
    },
    {
      name: "Address",
      selector: (row: Customer) => row.address,
      sortable: true,
    },
    { name: "Phone", selector: (row: Customer) => row.phoneNo },
    {
      name: "Action",
      cell: (row: Customer) => (
        <div className="inline-flex space-x-2">
          <ShowIcon link={`/admin/customer/show/${row.id}`} />
          <EditIcon link={`/admin/customer/edit/${row.id}`} />
          <DeleteIcon onClick={() => handleAction("delete", row.id)} />
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <Breadcrumb pageName="Customer List" />
      <div className="absolute top-10 right-0 p-4">
        <AddButton title="Add Customer" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={customerData}
        onAction={handleAction}
      />

      {/* Modal for Adding Customer */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Customer"
        size="4xl"
      >
        <AddCustomer
          onSuccess={() => {
            handleCloseModal();
            fetchCustomerData();
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomerIndex;

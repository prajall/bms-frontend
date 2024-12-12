import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
} from "@/components/ui/buttons/IconBtn";
import AddProductInstallation from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type ProductInstallation = {
  id: string;
  user: string;
  name: string;
  image: string;
  gender: string;
  address: string;
  phoneNo: string;
};

const ProductInstallationIndex = () => {
  const [productInstallationData, setProductInstallationData] = useState<
    ProductInstallation[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductInstallationData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product-installation`
      );
      if (response.status === 200 && response.data.success) {
        if (
          Array.isArray(response.data.data.productInstallations) &&
          response.data.data.productInstallations.length > 0
        ) {
          const formattedData = response.data.data.productInstallations.map(
            (customer: any) => ({})
          );
          setProductInstallationData(formattedData);
          setErrorMessage("");
        }
      } else {
        setErrorMessage(
          response.data.message || "Failed to fetch product Installations."
        );
      }
    } catch (error) {
      console.error("Error fetching product Installation data:", error);
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product Installation?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/product-installations/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchProductInstallationData(); // Refresh data
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
            error.response.data.message ||
            "Failed to delete product Installation.";
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
      // selector: (_: ProductInstallation, index: number) => index + 1,
      cell: (_: ProductInstallation, index: number) => index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Image",
      cell: (row: ProductInstallation) => (
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
      selector: (row: ProductInstallation) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row: ProductInstallation) => row.gender,
      sortable: true,
      width: "100px",
    },
    {
      name: "Address",
      selector: (row: ProductInstallation) => row.address,
      sortable: true,
    },
    { name: "Phone", selector: (row: ProductInstallation) => row.phoneNo },
    {
      name: "Action",
      cell: (row: ProductInstallation) => (
        <div className="inline-flex space-x-2">
          <ShowIcon link={`/admin/productInstallation/show/${row.id}`} />
          <EditIcon link={`/admin/productInstallation/edit/${row.id}`} />
          <DeleteIcon onClick={() => handleAction("delete", row.id)} />
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    fetchProductInstallationData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <Breadcrumb pageName="Product Installation List" />
      <div className="absolute top-10 right-0 p-4">
        <AddButton title="Create Installation" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={productInstallationData}
        onAction={handleAction}
      />

      {/* Modal for Adding ProductInstallation */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Installation"
        size="4xl"
      >
        <AddProductInstallation
          onSuccess={() => {
            handleCloseModal();
            fetchProductInstallationData();
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductInstallationIndex;

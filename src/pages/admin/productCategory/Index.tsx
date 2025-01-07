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
import AddCategogy from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import usePermission from "@/hooks/usePermission";

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
};

const ProductCategoryIndex = () => {
  const canCreateCategory = usePermission("category", "create");
  const canEditCategory = usePermission("category", "edit");
  const canDeleteCategory = usePermission("category", "delete");
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/category`
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.categories.map(
          (category: any) => ({
            id: category._id,
            name: category.name,
            description: category.description,
            image: category.image || "",
            status: category.status,
          })
        );
        setCategoryData(formattedData);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/category/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchCategoryData();
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
      // selector: (_: Category, index: number) => index + 1,
      cell: (_: Category, index: number) => index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Image",
      selector: (row: Category) => (
        <img src={row.image} alt={row.name} width="50" height="50" />
      ),
      sortable: false,
      width: "90px",
    },
    {
      name: "Name",
      selector: (row: Category) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Description",
      selector: (row: Category) => row.description,
      sortable: true,
    },
    { name: "Status", selector: (row: Category) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row: Category) => (
        <div className="inline-flex space-x-2">
          {/* <ShowIcon link={`/admin/category/show/${row.id}`} /> */}
          {canEditCategory && (
            <EditIcon link={`/admin/category/edit/${row.id}`} />
          )}
           {canDeleteCategory && (
              <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            )}
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    fetchCategoryData();
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
            <Search className="h-5 w-5"/>
          </span>
          <Input className="pl-10 w-[300px] md:w-[400px]" placeholder="Search Category" />
        </div>
        {canCreateCategory && <AddButton title="Add Category" onClick={handleOpenModal} />}
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={categoryData}
        onAction={handleAction}
        showSearch={false}
      />

      {/* Modal for Adding Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Category"
        size="xl"
      >
        <AddCategogy
          onSuccess={() => {
            handleCloseModal();
            fetchCategoryData();
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductCategoryIndex;

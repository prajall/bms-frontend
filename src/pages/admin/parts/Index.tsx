import React, { useState, useEffect } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import AddButton from "@/components/ui/buttons/AddButton";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
} from "@/components/ui/buttons/IconBtn";
import Modal from "@/components/ui/Model";
import AddPart from "./Create";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Part = {
  id: string;
  image: string;
  name: string;
  sellingPrice: string;
  costPrice: string;
  category: string;
  unit: string;
  stock: string;
};

const columns = [
  {
    name: "SN",
    selector: (_: Part, index: number) => index + 1,
    sortable: false,
    width: "70px",
  },
  {
    name: "Image",
    selector: (row: Part) => (
      <img src={row.image} alt={row.name} width="50" height="50" />
    ),
    sortable: false,
    width: "90px",
  },
  {
    name: "Part Name",
    selector: (row: Part) => row.name,
    sortable: true,
    wrap: true,
    // innerWidth: "700px",
    width: "25%",
  },
  {
    name: "Selling Price",
    selector: (row: Part) => row.sellingPrice,
    sortable: true,
  },
  {
    name: "Cost Price",
    selector: (row: Part) => row.costPrice,
    sortable: true,
  },
  { name: "Stock", selector: (row: Part) => row.stock, sortable: true },
  {
    name: "Action",
    cell: (row: Part) => (
      <div className="inline-flex space-x-2">
        <ShowIcon link={`/admin/part/show/${row.id}`} />
        <EditIcon link={`/admin/part/edit/${row.id}`} />
        {/* <DeleteIcon onClick={() => handleAction('delete', row.id)} /> */}
      </div>
    ),
    sortable: false,
    width: "10%",
  },
];

const handleAction = (action: string, id: string) => {
  console.log(`Action: ${action} on part with SKU: ${id}`);
  // Implement your action logic here (e.g., Edit or Delete the part)
};

const PartIndex = () => {
  const [partData, setpartData] = useState<Part[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchpartData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/part`
        );

        if (response.status === 200 && response.data.success) {
          const formattedData = response.data.data.parts.map((part: any) => ({
            id: part._id,
            image: part.baseImage?.small || "",
            name: part.name,
            sellingPrice: part.sellingPrice,
            costPrice: part.costPrice,
            stock: part.stock,
          }));
          setpartData(formattedData);
          setErrorMessage("");
        } else {
          setErrorMessage(response.data.message || "Failed to fetch Parts.");
        }
      } catch (error) {
        console.error("Error fetching Parts data:", error);
      }
    };

    fetchpartData();
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
            placeholder="Search Parts"
          />
        </div>
        <AddButton title="Add Product" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Pass dynamic title */}
      <TableLayout columns={columns} data={partData} onAction={handleAction} />

      {/* Modal for Adding Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Part"
        size="6xl"
      >
        <AddPart
          onSuccess={(newPart) => {
            setpartData((partData) => [...partData, newPart]); //add new
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default PartIndex;

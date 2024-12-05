import React, { useState, useEffect } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/ui/buttons/AddButton";
import { DeleteIcon, EditIcon, ShowIcon } from "@/components/ui/buttons/IconBtn";
import Modal from "@/components/ui/Model";
import AddPart from "./Create";

type Part = {
  id: string;
  image: string;
  name: string;
  sku: string;
  sellingPrice: string;
  costPrice: string;
  category: string;
  unit: string;
  stock: string;
};

const columns = [
  {
    name: 'SN',
    selector: (_: Part, index: number) => index + 1,
    sortable: false,
    width: '70px',
  },
  {
    name: 'Image',
    selector: (row: Part) => <img src={row.image} alt={row.name} width="50" height="50" />,
    sortable: false,
    width: '90px',
  },
  { name: 'Part Name', selector: (row: Part) => row.name, sortable: true, wrap: true },
  { name: 'SKU', selector: (row: Part) => row.sku, sortable: true },
  { name: 'Selling Price', selector: (row: Part) => row.sellingPrice, sortable: true },
  { name: 'Cost Price', selector: (row: Part) => row.costPrice, sortable: true },
  { name: 'Category', selector: (row: Part) => row.category, sortable: true, wrap: true },
  { name: 'Unit', selector: (row: Part) => row.unit, sortable: true },
  { name: 'Stock', selector: (row: Part) => row.stock, sortable: true },
  {
    name: 'Action',
    cell: (row: Part) => (
      <div className="inline-flex space-x-2">
        <ShowIcon link={`/admin/part/show/${row.id}`} />
        <EditIcon link={`/admin/part/edit/${row.id}`} />
        <DeleteIcon onClick={() => handleAction('delete', row.id)} />
      </div>
    ),
    sortable: false
  }
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product`);
        
        if (response.status === 200 && response.data.success) {
          const formattedData = response.data.data.parts.map((part: any) => ({
            id: part._id, 
            image: part.baseImage.small || "", 
            name: part.name,
            sku: part.sku,
            sellingPrice: part.sellingPrice,
            costPrice: part.costPrice,
            category: part.category,
            unit: part.weight.unit,
            stock: part.stock,
          }));
          setpartData(formattedData);
          setErrorMessage(""); 
        } else {
          setErrorMessage(response.data.message || "Failed to fetch categories.");
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
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
      <Breadcrumb pageName="Part List" />
      <div className="absolute top-10 right-0 p-4">
        <AddButton title='Add Part'  onClick={handleOpenModal} />
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {/* Pass dynamic title */}
      <TableLayout columns={columns} data={partData} onAction={handleAction} />

      {/* Modal for Adding Category */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Part" size="6xl">
         <AddPart />
      </Modal>
    </div>
  );
}

export default PartIndex

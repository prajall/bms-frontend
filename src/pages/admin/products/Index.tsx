import React, { useState, useEffect } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/ui/buttons/AddButton";
import { DeleteIcon, EditIcon, ShowIcon } from "@/components/ui/buttons/IconBtn";
import Modal from "@/components/ui/Model";
import AddProduct from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type Product = {
  id: string;
  image: string;
  name: string;
  sku: string;
  sellingPrice: string;
  costPrice: string;
  category: string;
  // unit: string;
  stock: string;
};

const ProductIndex = () => {
  const [productData, setproductData] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchproductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product`);
        if (response.status === 200 && response.data.success) {
          const formattedData = response.data.data.products.map((product: any) => ({
            id: product._id, 
            image: product.baseImage?.small || "",  
            name: product.name,
            sku: product.sku,
            sellingPrice: product.sellingPrice,
            costPrice: product.costPrice,
            category: product.category?.name || '',
            // unit: product.weight.unit,
            stock: product.stock,
          }));
          setproductData(formattedData);
          setErrorMessage(""); 
        } else {
          setErrorMessage(response.data.message || "Failed to fetch product.");
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
  };
  
  const handleAction = async (action: string, id: string) => {
      if (action === 'delete') {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/product/${id}`);
          if (response.status === 200 && response.data.success) {
            toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000, 
                });
            fetchproductData(); 
          } else {
            toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
                autoClose: 4000,
            });
          }
        } catch (error : any) {
          if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to delete Product.";
                toast(<ErrorToast message={errorMessage} />, {
                    autoClose: 4000, 
                });
            } else {
                toast(<ErrorToast message={"Network error. Please try again later."} />, {
                    autoClose: 4000, 
                });              
            }
        }
      }
  };

  const columns = [
  {
    name: 'SN',
    selector: (_: Product, index: number) => index + 1,
    sortable: false,
    width: '70px',
  },
  {
    name: 'Image',
    selector: (row: Product) => <img src={row.image} alt={row.name} width="50" height="50" />,
    sortable: false,
    width: '90px',
  },
  { name: 'Product Name', selector: (row: Product) => row.name, sortable: true, wrap: true },
  { name: 'SKU', selector: (row: Product) => row.sku, sortable: true },
  { name: 'Selling Price', selector: (row: Product) => row.sellingPrice, sortable: true },
  { name: 'Cost Price', selector: (row: Product) => row.costPrice, sortable: true },
  { name: 'Category', selector: (row: Product) => row.category, sortable: true, wrap: true },
  // { name: 'Unit', selector: (row: Product) => row.unit, sortable: true },
  { name: 'Stock', selector: (row: Product) => row.stock, sortable: true },
  {
    name: 'Action',
    cell: (row: Product) => (
      <div className="inline-flex space-x-2">
        <ShowIcon link={`/admin/product/show/${row.id}`} />
        <EditIcon link={`/admin/products/edit/${row.id}`} />
        {/* <DeleteIcon onClick={() => handleAction('delete', row.id)} /> */}
      </div>
    ),
    sortable: false
  }
];

  useEffect(() => {
    fetchproductData();
  }, []);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <Breadcrumb pageName="Product List" />
      <div className="absolute top-10 right-0 p-4">
        <AddButton title='Add Product'  onClick={handleOpenModal} />
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {/* Pass dynamic title */}
      <TableLayout columns={columns} data={productData} onAction={handleAction} />

      {/* Modal for Adding Category */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Product" size="6xl">
        <AddProduct
          onSuccess={() => {
          handleCloseModal();
          fetchproductData();
        }} 
        />
      </Modal>
    </div>
  );
}

export default ProductIndex

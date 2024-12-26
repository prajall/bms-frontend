import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import ProductForm from "@/components/admin/Forms/Product";
import { ProductFormData } from "@/components/admin/Forms/Product";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [initialData, setInitialData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from the API
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/${id}`, {
          withCredentials: true,
        });
          if (response.data.success) {
          const product = response.data.data.product;
          // Map API response to the form's structure
          const mappedData: ProductFormData = {
            id: product._id,
            name: product.name,
            sku: product.sku,
            brand: product.brand || "",
            description: product.description || "",
            costPrice: product.costPrice || 0,
            sellingPrice: product.sellingPrice || 0,
            discount: product.discount || 0,
            category: product.category?._id || "",
            images: product.images || [],
            stock: product.stock || 0,
            status: product.status || "inactive",
            tags: product.tags || [],
            modelNo: product.modelNo || "",
            serialNo: product.serialNo || "",
            condition: product.condition || "new",
            manufactureDate: product.manufactureDate || "",
            warranty: product.warranty || 0,
            keyFeatures: product.keyFeatures || [],
            minimumOrderQuantity: product.minimumOrderQuantity || 1,
            dimensions: {
              unit: product.dimensions?.unit || "",
              width: product.dimensions?.width || 0,
              height: product.dimensions?.height || 0,
              length: product.dimensions?.length || 0,
            },
            weight: {
              unit: product.weight?.unit || "",
              value: product.weight?.value || 0,
            },
            variants: product.variants || [],
            seo: {
              slug: product.seo?.slug || "",
            metaTitle: product.seo?.metaTitle || "",
            metaDescription: product.seo?.metaDescription || "",
            }
            
          };
          setInitialData(mappedData);
        }
      } catch (error) {
        console.log("Failed to fetch product data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditProduct = async (formData: FormData) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200 && response.data.success) {
            toast(<SuccessToast message={response.data.message} />, {
              autoClose: 5000, 
            });
        navigate("/admin/product");
        } else {
        toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
              autoClose: 4000,
            });
        }
    } catch (error: any) {
      if (error.response && error.response.data) {
          const errorMessage = error.response.data.message || "Failed to update category.";
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
      <Breadcrumb pageName="Edit Product" />
      <ProductForm initialData={initialData} onSubmit={handleEditProduct} />
    </div>
  );
};

export default EditProduct;

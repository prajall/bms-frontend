import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import ImageUploader from "@/components/ImageUploader";
import CategorySelect from "@/components/formElements/CategorySelect";
import BrandSelect from "@/components/formElements/BrandSelect";
import VariantsSelect from "@/components/formElements/VariantsSelect";
import TextEditor from "@/components/ui/TextEditor";


interface Warranty {
  duration: number;
  description: string;
}

interface Dimensions {
  width?: number;
  height?: number;
  length?: number;
  unit: string;
}

interface Weight {
  value?: number;
  unit: string;
}

interface SEO {
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  category: number | string;
  images: (File | string)[];
  stock: number;
  status: string;
  tags: string[];
  modelNo: string;
  serialNo: string;
  condition: string;
  manufactureDate: string;
  warranty: Warranty;
  keyFeatures: string[];
  minimumOrderQuantity: number;
  dimensions: Dimensions;
  weight: Weight;
  variants: any[];
  seo: SEO;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> | null;
  onSubmit: (data: FormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<(File | string)[]>(initialData?.images || []);
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || "active");
  const [selectedCondition, setSelectedCondition] = useState(initialData?.condition || "new");
  const [selectedCategory, setSelectedCategory] = useState('');  
  const [selectedBrand, setSelectedBrand] = useState(''); 
  const [selectedVariants, setSelectedVariants] = useState(''); 
  const [editorContent, setEditorContent] = React.useState('');
  const [keyFeatures, setKeyFeatures] = useState<string[]>(initialData?.keyFeatures || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [warranty, setWarranty] = useState<Warranty>(
    initialData?.warranty || { duration: 0, description: "" }
  );
  const [dimensions, setDimensions] = useState<Dimensions>(
    initialData?.dimensions || { width: 0, height: 0, length: 0, unit: "cm" }
  );
  const [weight, setWeight] = useState<Weight>(initialData?.weight || { value: 0, unit: "kg" });
  const [seo, setSEO] = useState<SEO>(initialData?.seo || { slug: "" ,metaTitle: "",  metaDescription: "" });
  

  const defaultValues: ProductFormData = {
    name: "",
    sku: "",
    brand: "",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    discount: 0,
    category: '',
    images: [],
    stock: 0,
    status: "active",
    tags: [],
    modelNo: "",
    serialNo: "",
    condition: "new",
    manufactureDate: "",
    warranty: {
      duration: 0,
      description: "",
    },
    keyFeatures: [],
    minimumOrderQuantity: 0,
    dimensions: { width: 0, height: 0, length: 0, unit: "cm" },
    weight: { value: 0, unit: "kg" },
    variants: [],
    seo: { slug: "" ,metaTitle: "",  metaDescription: "" },
    ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({ defaultValues });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof ProductFormData, (initialData as any)[key]);
      });
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (initialData?.description) {
      setEditorContent(initialData.description); 
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.images) {
      setImages(initialData.images);
    }
  }, [initialData]);

  const addImage = () => {
    setImages((prev) => [...prev, null!]);
  };

  const handleImageUpload = (index: number, image: File) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = image; 
      return updatedImages;
    });
  };

  const handleRemoveImage = (index: number) => {
    // const updatedImages = [...images];
    // updatedImages.splice(index, 1);
    // setImages(updatedImages);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (value: string | number) => {
    setSelectedCategory(value.toString());
    setValue("category", value.toString());
  };

  const handleBrandChange = (value: string | number) => {
    setSelectedBrand(value.toString());
    setValue("brand", value.toString());
  };

  const handleVariantsChange = (value: string | number) => {
    setSelectedVariants(value.toString());
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("description", content);
  };

  const handleAddFeature = (feature: string) => {
    if (feature.trim() && !keyFeatures.includes(feature)) {
      setKeyFeatures((prev) => [...prev, feature]);
    }
  };

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget as HTMLInputElement;
      handleAddFeature(input.value);
      input.value = ""; // Clear the input after adding the feature
    }
  };

  const handleAddTags = (tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
  };

  const handleRemoveTags = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget as HTMLInputElement;
      handleAddTags(input.value);
      input.value = ""; // Clear the input after adding the feature
    }
  };

  const handleWarrantyChange = (field: keyof Warranty, value: string | number) => {
    setWarranty((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDimensionsChange = (field: keyof Dimensions, value: number | string) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? value : value.trim(),
    }));
  };

  const handleWeightChange = (field: keyof Weight, value: number | string) => {
    setWeight((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? value : value.trim(),
    }));
  };

  const handleSEOChange = (field: keyof SEO, value: string) => {
    setSEO((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        // images.forEach((image, index) => {
        //   formData.append(`images[${index}]`, image);
        // });
        // images.forEach((img) => {
        //   if (typeof img === "string") {
        //     formData.append("images[]", img); // Existing image URL
        //   } else {
        //     formData.append("images[]", img); // New file
        //   }
        // });
        images.forEach((img) => {
          if (typeof img === "string") {
            formData.append("images[]", img);
          } else if (img instanceof File) {
            formData.append("images[]", img.name); 
          }
        });
      } else if (key === "keyFeatures") {
        keyFeatures.forEach((feature) => formData.append("keyFeatures[]", feature));
      } else if (key === "tags") {
        tags.forEach((tag) => formData.append("tags[]", tag));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (key === "dimensions") {
        Object.entries(dimensions).forEach(([dimKey, dimValue]) => {
          formData.append(`dimensions.${dimKey}`, dimValue.toString());
        });
      } else if (key === "weight") {
        Object.entries(weight).forEach(([weightKey, weightValue]) => {
          formData.append(`weight.${weightKey}`, weightValue.toString());
        });
      } else if (key === "seo") {
        Object.entries(seo).forEach(([seoKey, seoValue]) => {
          formData.append(`seo.${seoKey}`, seoValue.toString());
        });     
      } else if (key === "warranty") { 
        Object.entries(warranty).forEach(([warrantyKey, warrantyValue]) => {
          formData.append(`warranty.${warrantyKey}`, warrantyValue.toString());
        });
      }else {
        formData.append(key, value as string | Blob);
      }
    });

    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                {...register("name", { required: "Product Name is required" })}
                id="name"
                type="text"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                {...register("sku", { required: "SKU is required" })}
                id="sku"
                type="text"
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <BrandSelect
                selectedBrand={selectedBrand}
                onChange={handleBrandChange}
                showAddBrandButton={true}
                id = "brand"
              />
            </div>

            {/* Category */}
            <div>
              <CategorySelect
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
                showAddCategoryButton={true}
              />
            </div>

            {/* Additional Fields */}
            {[
              { label: "Cost Price", id: "costPrice", type: "number", required: true },
              { label: "Selling Price", id: "sellingPrice", type: "number", required: true },
              { label: "Discount", id: "discount", type: "number" },
              { label: "Minimum Order Quantity", id: "minimumOrderQuantity", type: "number" },
              { label: "Model No.", id: "modelNo", type: "string" },
              { label: "Serial No.", id: "serialNo", type: "string" },
            ].map(({ label, id, type, required }) => (
              <div key={id}>
                <Label htmlFor={id}>
                  {label} {required && <span className="text-red-400">*</span>}
                </Label>
                <Input
                  {...register(id as keyof ProductFormData, required ? { required: `${label} is required` } : {})}
                  id={id}
                  type={type}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                {errors[id as keyof ProductFormData] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors[id as keyof ProductFormData] as any).message}
                  </p>
                )}
              </div>
            ))}

            {/* Stock */}
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                {...register("stock", { required: "Stock is required" })}
                id="stock"
                type="number"
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
              )}
            </div>

            {/* Manufacture Date */}
            <div>
              <Label htmlFor="manufactureDate">Manufacture Date</Label>
              <Input
                {...register("manufactureDate")}
                id="manufactureDate"
                type="date"
              />
            </div>

            {/* Key Features */}
            <div>
              <Label htmlFor="keyFeatures">Key Features</Label>
              <Input
                id="keyFeaturesInput"
                type="text"
                placeholder="Enter a feature and press Enter"
                onKeyDown={handleKeyDown}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* taggs */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tagsInput"
                type="text"
                placeholder="Enter a tag and press Enter"
                onKeyDown={handleKeyDownTag}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveTags(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <Label htmlFor="description">Description</Label>
              <TextEditor
                value={editorContent} 
                onChange={handleEditorChange} 
                id="description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
              
            </div>

            {/* Warranty */}
            <div className="lg:col-span-2">
              <Label>Warranty</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warrantyDuration">Duration (months)</Label>
                  <Input
                    id="warrantyDuration"
                    type="number"
                    value={warranty.duration}
                    onChange={(e) => handleWarrantyChange("duration", parseInt(e.target.value, 10))}
                  />
                </div>
                <div>
                  <Label htmlFor="warrantyDescription">Description</Label>
                  <Input
                    id="warrantyDescription"
                    type="text"
                    value={warranty.description}
                    onChange={(e) => handleWarrantyChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>
            
             {/* Dimensions */}
            <div className="lg:col-span-2">
              <Label>Dimensions</Label>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Width</Label>
                  <Input
                    type="number"
                    placeholder="Width"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionsChange("width", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input
                    type="number"
                    placeholder="Height"
                    value={dimensions.height}
                    onChange={(e) => handleDimensionsChange("height", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Length</Label>
                  <Input
                    type="number"
                    placeholder="Length"
                    value={dimensions.length}
                    onChange={(e) => handleDimensionsChange("length", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <select
                    className="block w-full border border-gray-300 rounded px-2 py-2"
                    value={dimensions.unit}
                    onChange={(e) => handleDimensionsChange("unit", e.target.value)}
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="lg:col-span-2">
              <Label>Weight</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Weight"
                  value={weight.value}
                  onChange={(e) => handleWeightChange("value", parseFloat(e.target.value))}
                />
                <select
                  className="block w-full border border-gray-300 rounded px-2 py-2"
                  value={weight.unit}
                  onChange={(e) => handleWeightChange("unit", e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            {/* SEO Slug */}
            <div className="lg:col-span-2">
              <Label htmlFor="seoSlug">SEO</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="seoSlug">Slug</Label>
                    <Input
                      id="seoSlug"
                      type="text"
                      placeholder="Enter SEO Slug"
                      value={seo.slug}
                      onChange={(e) => handleSEOChange("slug", e.target.value)}
                    />
                </div>
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      type="text"
                      placeholder="Enter Meta Title"
                      value={seo.metaTitle}
                      onChange={(e) => handleSEOChange("metaTitle", e.target.value)}
                    />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                    <Input
                      id="metaDescription"
                      type="text"
                      placeholder="Enter Meta Description"
                      value={seo.metaDescription}
                      onChange={(e) => handleSEOChange("metaDescription", e.target.value)}
                    />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <VariantsSelect
                selectedVariants={selectedVariants}
                onChange={handleVariantsChange}
                showAddVariantsButton={true}
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Uploaders */}
            <div className="mt-6 lg:col-span-2">
              <Label>Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  {typeof image === "string" ? (
                    <div className="relative">
                      {/* Image preview for existing images */}
                      <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto rounded-lg" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    // File input for new uploads
                    <ImageUploader
                      onImageUpload={(uploadedImage) => handleImageUpload(index, uploadedImage)}
                      onRemove={() => handleRemoveImage(index)}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImage}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg"
            >
              + Add Image
            </button>
          </div>

          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : initialData ? "Update Product" : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductForm;

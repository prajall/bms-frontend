import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import ImageUploader from "@/components/ImageUploader";
import BrandSelect from "@/components/formElements/BrandSelect";
import TextEditor from "@/components/ui/TextEditor";

export interface PartFormData {
  id?: string;
  name: string;
  brand: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  images: (File | string)[];
  stock: number;
  status: string;
  tags: string[];
  modelNo: string;
  serialNo: string;
}

interface PartFormProps {
  initialData?: Partial<PartFormData> | null;
  onSubmit: (data: FormData) => void;
}

const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<(File | string)[]>(initialData?.images || []);
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || "active");
  const [selectedBrand, setSelectedBrand] = useState(initialData?.brand || ""); 
  const [editorContent, setEditorContent] = React.useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  

  const defaultValues: PartFormData = {
    name: "",
    brand: "",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    discount: 0,
    images: [],
    stock: 0,
    status: "active",
    tags: [],
    modelNo: "",
    serialNo: "",
    ...initialData,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PartFormData>({ defaultValues });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof PartFormData, (initialData as any)[key]);
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

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value.toString());
    setValue("brand", value.toString());
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("description", content);
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

  const handleFormSubmit = async (data: PartFormData) => {
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
      } else if (key === "tags") {
        tags.forEach((tag) => formData.append("tags[]", tag));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
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
              <Label htmlFor="name">Part Name <span className="text-red-400">*</span></Label>
              <Input
                {...register("name", { required: "Part Name is required" })}
                id="name"
                type="text"
                placeholder="Enter part name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand">Brand</Label>
              <BrandSelect
                selectedBrand={selectedBrand}
                onChange={handleBrandChange}
                showAddBrandButton={true}
                id = "brand"
              />
            </div>

            {/* Additional Fields */}
            {[
              { label: "Cost Price", id: "costPrice", type: "number", required: true },
              { label: "Selling Price", id: "sellingPrice", type: "number", required: true },
              { label: "Discount", id: "discount", type: "number" },
              { label: "Model No.", id: "modelNo", type: "string" },
              { label: "Serial No.", id: "serialNo", type: "string" },
            ].map(({ label, id, type, required }) => (
              <div key={id}>
                <Label htmlFor={id}>
                  {label} {required && <span className="text-red-400">*</span>}
                </Label>
                <Input
                  {...register(id as keyof PartFormData, required ? { required: `${label} is required` } : {})}
                  id={id}
                  type={type}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                {errors[id as keyof PartFormData] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors[id as keyof PartFormData] as any).message}
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
            {isSubmitting ? "Submitting..." : initialData ? "Update Part" : "Create Part"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PartForm;

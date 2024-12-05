import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

// Define the type for the form data
interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  status: string;
}

interface ProductCategoryProps {
  initialData?: CategoryFormData; // Pre-fill data for edit mode
  onSubmit: (data: FormData) => void;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ initialData, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: initialData || { name: "", description: "", image: "", status: "" },
  });

  // Pre-fill the form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description);
      setSelectedStatus(initialData.status);
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("status", selectedStatus.trim());
    if (selectedImage) {
        formData.append("image", selectedImage);
    }
    onSubmit(formData);
    };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="w-full grid grid-cols-1 py-5">
            {/* Name */}
            <div className='mb-4'>
              <Label htmlFor="name">
                Category Name <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("name", { required: "Category Name is required" })}
                id="name"
                placeholder="Enter category name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className='mb-4'>
              <Label htmlFor="description">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                {...register("description", { required: "Description is required" })}
                id="description"
                placeholder="Enter description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Image */}
            <div className='mb-4'>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleImageChange} />
            </div>

            {/* Status */}
            <div className='mb-4'>
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
        </CardFooter>     
      </Card>

      
    </form>
  );
};

export default ProductCategory;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';

interface Category {
  _id: string;
  name: string;
  status: string;
}

interface CategorySelectProps {
  selectedCategory: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddCategoryButton?: boolean; 
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onChange,
  loadingText = "Loading categories...",
  showAddCategoryButton = false // Default to false if not provided
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fixed API URL for fetching categories
  const apiUrl = `${import.meta.env.VITE_API_URL}/category`

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl, {
              withCredentials: true,
            });
          if (response.status === 200 && response.data.success) { 
              const activeCategories = response.data.data.categories.filter(
                (category: Category) => category.status === 'active'
            );
          
            setCategories(activeCategories);
            setLoading(false);
          } else {
            console.error(response.data.message || "Failed to fetch categories.");
            }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  // If no categories are found, and the user wants to add a category, show the button
  const handleAddCategory = () => {
    console.log("Navigate to the add category page or show a modal.");
    // Handle the logic to navigate to the "Add Category" page or show a modal
  };

  return (
    <div>
      <Select value={selectedCategory} onValueChange={onChange}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {loading && <div>{loadingText}</div>}
          {categories.length === 0 ? (
            <SelectItem value="none" disabled>No categories available</SelectItem>
          ) : (
            categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Only show "Add Category" button if categories are not found and showAddCategoryButton is true */}
          {categories.length === 0 && showAddCategoryButton && (
              <AddButton  title='Add Category' onClick={handleAddCategory} size="small" />
            )}
    </div>
  );
};

export default CategorySelect;

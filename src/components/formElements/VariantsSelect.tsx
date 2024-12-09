import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';

interface Variants {
  _id: string;
  name: string;
  status: string;
}

interface VariantsSelectProps {
  selectedVariants: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddVariantsButton?: boolean; 
}

const VariantsSelect: React.FC<VariantsSelectProps> = ({
  selectedVariants,
  onChange,
  loadingText = "Loading categories...",
  showAddVariantsButton = false // Default to false if not provided
}) => {
  const [categories, setCategories] = useState<Variants[]>([]);
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
                (variants: Variants) => variants.status === 'active'
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

  // If no categories are found, and the user wants to add a Variants, show the button
  const handleAddVariants = () => {
    console.log("Navigate to the add Variants page or show a modal.");
    // Handle the logic to navigate to the "Add Variants" page or show a modal
  };

  return (
    <div>
      <Select value={selectedVariants} onValueChange={onChange}>
        <SelectTrigger id="variants">
          <SelectValue placeholder="Select variants" />
        </SelectTrigger>
        <SelectContent>
          {loading && <div>{loadingText}</div>}
          {categories.length === 0 ? (
            <SelectItem value="none" disabled>No categories available</SelectItem>
          ) : (
            categories.map((variants) => (
              <SelectItem key={variants._id} value={variants._id}>
                {variants.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Only show "Add Variants" button if categories are not found and showAddVariantsButton is true */}
          {categories.length === 0 && showAddVariantsButton && (
              <AddButton  title='Add Variants' onClick={handleAddVariants} size="small" />
            )}
    </div>
  );
};

export default VariantsSelect;

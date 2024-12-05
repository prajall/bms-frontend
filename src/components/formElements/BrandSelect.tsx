import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';

interface Brand {
  _id: string;
  name: string;
  status: string;
  id?: string;
}

interface BrandSelectProps {
  selectedBrand: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddBrandButton?: boolean;
  id: string;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  selectedBrand,
  onChange,
  loadingText = "Loading categories...",
  showAddBrandButton = false,
  id
}) => {
  const [categories, setCategories] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fixed API URL for fetching categories
  const apiUrl = `${import.meta.env.VITE_API_URL}/category`

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200 && response.data.success) {
          const activeCategories = response.data.data.categories.filter(
            (brand: Brand) => brand.status === 'active'
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

  // If no categories are found, and the user wants to add a Brand, show the button
  const handleAddBrand = () => {
    console.log("Navigate to the add brand page or show a modal.");
    // Handle the logic to navigate to the "Add Brand" page or show a modal
  };

  return (
    <div>
      <Label htmlFor={id}>Brand</Label>
      <Select value={selectedBrand} onValueChange={onChange}>
        <SelectTrigger id={id}> {/* Pass id to SelectTrigger */}
          <SelectValue placeholder="Select brand" />
        </SelectTrigger>
        <SelectContent>
          {loading && <div>{loadingText}</div>}
          {categories.length === 0 ? (
            <SelectItem value="none" disabled>No categories available</SelectItem>
          ) : (
            categories.map((brand) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Only show "Add Brand" button if categories are not found and showAddBrandButton is true */}
      {categories.length === 0 && showAddBrandButton && (
        <AddButton title='Add Brand' onClick={handleAddBrand} />
      )}
    </div>
  );
};

export default BrandSelect;

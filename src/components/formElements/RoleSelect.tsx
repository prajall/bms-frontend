import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';

interface Role {
  _id: string;
  name: string;
  status: string;
}

interface RoleSelectProps {
  selectedRole: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddRoleButton?: boolean; 
}

const RoleSelect: React.FC<RoleSelectProps> = ({
  selectedRole,
  onChange,
  loadingText = "Loading categories...",
  showAddRoleButton = false // Default to false if not provided
}) => {
  const [categories, setCategories] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fixed API URL for fetching categories
  const apiUrl = `${import.meta.env.VITE_API_URL}/role`

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl, {
              withCredentials: true,
            });
          if (response.status === 200 && response.data.success) { 
              const activeCategories = response.data.data
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

  // If no categories are found, and the user wants to add a role, show the button
  const handleAddRole = () => {
    console.log("Navigate to the add role page or show a modal.");
    // Handle the logic to navigate to the "Add role" page or show a modal
  };

  return (
    <div>
      <Select value={selectedRole} onValueChange={onChange}>
        <SelectTrigger id="role">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {loading && <div>{loadingText}</div>}
          {categories.length === 0 ? (
            <SelectItem value="none" disabled>No categories available</SelectItem>
          ) : (
            categories.map((role) => (
              <SelectItem key={role._id} value={role._id}>
                {role.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

          {/* Only show "Add Role" button if categories are not found and showAddRoleButton is true */}
        <div className="mt-2">
            {categories.length === 0 && showAddRoleButton && (
                <AddButton  title='Add Role' onClick={handleAddRole} size="small" />
            )}
        </div>
    </div>
  );
};

export default RoleSelect;

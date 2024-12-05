import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Label } from '../ui/label';
import AddButton from '../ui/buttons/AddButton';
import ComboBox from '../ui/Combobox';
import useProducts from '@/hooks/useProducts';

interface ProductSelectProps {
  selectedProduct: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddProductButton?: boolean;
}

const ProductSelect: React.FC<ProductSelectProps> = ({
  selectedProduct,
  onChange,
  loadingText = "Loading products...",
  showAddProductButton = false,
}) => {
  const { products, loading } = useProducts();

  const options = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const handleAddProduct = () => {
    console.log("Navigate to the add product page or show a modal.");
    // Handle the logic to navigate to the "Add Product" page or show a modal
  };

  

  return (
    <div>
      <Label htmlFor="product">Product</Label>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <ComboBox
          id="product"
          options={options}
          value={selectedProduct}
          onChange={onChange}
          placeholder="Select or type a product"
          noOptionsText="No products available"
        />
      )}

      {/* Only show "Add Product" button if products are not found and showAddProductButton is true */}
      {products.length === 0 && showAddProductButton && (
        <AddButton title="Add Product" onClick={handleAddProduct} />
      )}
    </div>
  );
};

interface MultiProductProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  loadingText?: string;
  showAddProductButton?: boolean;
}

const MultiProduct: React.FC<MultiProductProps> = ({
  selectedValues,
  onChange,
  loadingText = "Loading products...",
  showAddProductButton = false,
}) => {
  const { products, loading } = useProducts();

  const options = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange(selectedOptions);
  };

  const handleAddProduct = () => {
    console.log("Navigate to the add product page or show a modal.");
    // Handle the logic to navigate to the "Add Product" page or show a modal
  };

  return (
    <div>
      <Label htmlFor="multi-product-select">Products</Label>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <select
          id="multi-product-select"
          multiple
          value={selectedValues}
          onChange={handleChange}
          className="block w-full p-2 border rounded-md bg-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {products.length === 0 && showAddProductButton && (
        <AddButton title="Add Product" onClick={handleAddProduct} />
      )}
    </div>
  );
};


export { ProductSelect, MultiProduct };

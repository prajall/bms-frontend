import React, { useState, useEffect } from 'react';
import AddButton from '../ui/buttons/AddButton';
import useProducts from '@/hooks/useProducts';
import Select from 'react-select';

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
    label: `${product.name} - ${product.modelNo}`,
  }));

  const handleAddProduct = () => {
    console.log("Navigate to the add product page or show a modal.");
    // Handle the logic to navigate to the "Add Product" page or show a modal
  };

  

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
          <Select 
            id="product"
            options={options}
            value={options.find((option) => option.value === selectedProduct) || null} 
            onChange={(option) => onChange(option ? option.value : "")}
            placeholder="Select or type a product"
            noOptionsMessage={() => "No products available"}
          />
      )}

      {/* Only show "Add Product" button if products are not found and showAddProductButton is true */}
      <div className="mt-2">
        {products.length === 0 && showAddProductButton && (
          <AddButton title="Add Product" onClick={handleAddProduct} size="small" />
        )}
      </div>
      
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
    label: `${product.name} - ${product.modelNo}` ,
  }));

  const handleAddProduct = () => {
    console.log("Navigate to the add product page or show a modal.");
    // Handle the logic to navigate to the "Add Product" page or show a modal
  };

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <Select
          id="multi-product-select"
          options={options}
          value={options.filter((option) => selectedValues.includes(option.value))}
          onChange={(selected) => {
            const selectedIds = (selected as { value: string; label: string }[]).map(
              (option) => option.value
            );
            onChange(selectedIds);
          }}
          isMulti
          placeholder="Select or type products"
          noOptionsMessage={() => "No products available"}
        />
      )}

      <div className="mt-2">
        {products.length === 0 && showAddProductButton && (
          <AddButton title="Add Product" onClick={handleAddProduct} size="small" />
        )}
      </div>
      
    </div>
  );
};


export { ProductSelect, MultiProduct };

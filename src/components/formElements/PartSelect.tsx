import React, { useState, useEffect } from 'react';
import AddButton from '../ui/buttons/AddButton';
import useParts from '@/hooks/useParts';
import Select from 'react-select';

interface PartSelectProps {
  selectedPart: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddPartButton?: boolean;
}

const PartSelect: React.FC<PartSelectProps> = ({
  selectedPart,
  onChange,
  loadingText = "Loading parts...",
  showAddPartButton = false,
}) => {
  const { parts, loading } = useParts();

  const options = parts.map((part) => ({
    value: part._id,
    label: part.name,
  }));

  const handleAddPart = () => {
    console.log("Navigate to the add part page or show a modal.");
    // Handle the logic to navigate to the "Add part" page or show a modal
  };

  

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
          <Select 
            id="part"
            options={options}
            value={options.find((option) => option.value === selectedPart) || null} 
            onChange={(option) => onChange(option ? option.value : "")}
            placeholder="Select or type a part"
            noOptionsMessage={() => "No parts available"}
          />
      )}

          {/* Only show "Add Part" button if parts are not found and showAddPartButton is true */}
          <div className="mt-2">
              {parts.length === 0 && showAddPartButton && (
                <AddButton title="Add Part" onClick={handleAddPart} size="small" />
            )}
          </div>
      
    </div>
  );
};

interface MultiPartProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  loadingText?: string;
  showAddPartButton?: boolean;
}

const MultiPart: React.FC<MultiPartProps> = ({
  selectedValues,
  onChange,
  loadingText = "Loading parts...",
  showAddPartButton = false,
}) => {
  const { parts, loading } = useParts();

  const options = parts.map((part) => ({
    value: part._id,
    label: part.name,
  }));

  const handleAddPart = () => {
    console.log("Navigate to the add part page or show a modal.");
    // Handle the logic to navigate to the "Add Part" page or show a modal
  };

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <Select
          id="multi-part-select"
          options={options}
          value={options.filter((option) => selectedValues.includes(option.value))}
          onChange={(selected) => {
            const selectedIds = (selected as { value: string; label: string }[]).map(
              (option) => option.value
            );
            onChange(selectedIds);
          }}
          isMulti
          placeholder="Select or type parts"
          noOptionsMessage={() => "No parts available"}
        />
      )}

        <div className="mt-2">
            {parts.length === 0 && showAddPartButton && (
            <AddButton title="Add Part" onClick={handleAddPart} size="small" />
        )}
        </div>
      
    </div>
  );
};


export { PartSelect, MultiPart };

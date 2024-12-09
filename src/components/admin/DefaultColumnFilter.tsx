import React from 'react';

// Define a default column filter
export const DefaultColumnFilter = ({
  column: { filterValue, setFilter }
}: {
  column: {
    filterValue: any;
    setFilter: (value: any) => void;
  };
}) => {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)} // Set filter value or undefined for no filter
      placeholder={`Search...`}
      style={{
        width: '100%',
        border: '1px solid #ccc',
        padding: '5px',
        margin: '5px',
        borderRadius: '4px',
      }}
    />
  );
};

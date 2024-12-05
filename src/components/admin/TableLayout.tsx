import React, { useState,useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Input } from '../ui/input';


type Column<T> = {
  id?: string;
  name: string;
  selector: (row: T) => string | number | boolean; 
  sortable?: boolean;
  // cell?: (row: T) => React.ReactNode; '
  cell?: (row: T, index?: number) => JSX.Element | string | number;
  width?: string;
  wrap?: boolean;
};

// Define the type for the data (you can make this generic to be reused with different data types)
type TableLayoutProps<T> = {
  columns: Column<T>[];
  data: T[];
  onAction: (action: string, id: string) => void; // Callback to handle actions like "Edit" or "Delete"
  showSearch?: boolean;
};

const TableLayout = <T extends object>({ columns, data, onAction, showSearch = true, }: TableLayoutProps<T>) => {
  const [searchText, setSearchText] = useState<string>('');

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        columns.some((column) => {
          if (column.selector) {
            const value = column.selector(row);
            return (
              value !== undefined &&
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            );
          }
          return false;
        })
      ),
    [searchText, data, columns]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#e9e8e8', 
        color: 'black', 
        fontWeight: '600',
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold', 
        fontSize: '1rem', 
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem', 
      },
    },
  };

  return (
    <div className="py-4">
      {showSearch && (
        <div className="flex justify-between items-center mb-3 w-70">
          <Input
            value={searchText}
            onChange={handleSearchChange}
            type={'text'}
            placeholder="Search..."
          />
        </div>
      )}

      {/* DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 50, 100]}
        highlightOnHover
        sortIcon={<span>&#8597;</span>}
        customStyles={customStyles}
        noDataComponent={<div className="py-4 text-gray-500">No records found.</div>}
      />
    </div>
  );
};

export default TableLayout;

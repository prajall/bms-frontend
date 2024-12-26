import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Input } from "../ui/input";

type Column<T> = {
  id?: string;
  name: string;
  selector: (row: T) => string | number | boolean;
  sortable?: boolean;
  cell?: (row: T, index?: number) => JSX.Element | string | number;
  width?: string;
  wrap?: boolean;
};

type TableLayoutProps<T> = {
  columns: any[];
  data: T[];
  totalRows?: number;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: string;
  search?: string;
  onSearch?: (search: string) => void;
  onSort?: (field: string, order: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onAction: (action: string, id: string) => void;
  showSearch?: boolean;
};

const TableLayout = <T extends object>({
  columns,
  data,
  totalRows,
  page,
  limit,
  sortField,
  sortOrder,
  search = "",
  onSearch,
  onSort,
  onPageChange,
  onLimitChange,
  showSearch = true,
}: TableLayoutProps<T>) => {
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((column) => {
        if (typeof column.selector === "function") {
          const value = column.selector(row);
          return (
            value !== undefined &&
            value.toString().toLowerCase().includes(search.toLowerCase())
          );
        }
        return false;
      })
    );
  }, [data, columns, search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch && onSearch(event.target.value);
  };

  return (
    <div className="bg-white m-2 shadow-lg rounded-md">
      {showSearch && (
        <div className="absolute top-0 left-0 p-2 pt-0 w-[450px] flex justify-between items-center">
          <Input
            className="w-[300px] md:w-[400px]"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      )}
      <div className="mt-5">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={limit}
          paginationDefaultPage={page}
          onChangePage={onPageChange}
          onChangeRowsPerPage={(newLimit) => onLimitChange && onLimitChange(newLimit)}
          sortIcon={<span>&#8597;</span>}
          customStyles={{
            headRow: { style: { backgroundColor: "#f4f4f5", color: "black" } },
          }}
          noDataComponent={<div className="py-4 text-gray-500">No records found.</div>}
        />
      </div>
      
    </div>
  );
};


export default TableLayout;

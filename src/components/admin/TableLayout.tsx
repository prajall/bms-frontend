import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Input } from "../ui/input";

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

type TableLayoutProps<T> = {
  columns: any[];
  data: T[];
  onAction: (action: string, id: string) => void;
  showSearch?: boolean;
};

const TableLayout = <T extends object>({
  columns,
  data,
  onAction,
  showSearch = true,
}: TableLayoutProps<T>) => {
  // const [searchText, setSearchText] = useState<string>("");

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        columns.some((column) => {
          if (column.selector) {
            const value = column.selector(row);
            return (
              value !== undefined
              // value.toString().toLowerCase().includes(searchText.toLowerCase())
            );
          }
          return false;
        })
      ),
    [data, columns]
  );

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f4f4f5",
        color: "black",
        fontWeight: "600",
        borderRadius: "10px 10px 0px 0px",
      },
    },
    headCells: {
      style: {
        fontWeight: "semi-bold",
        fontSize: "1rem",
      },
    },
    cells: {
      style: {
        fontSize: "0.875rem",
      },
    },
  };

  return (
    <div className="">
      {/* DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 50, 100]}
        sortIcon={<span>&#8597;</span>}
        customStyles={customStyles}
        noDataComponent={
          <div className="py-4 text-gray-500">No records found.</div>
        }
      />
    </div>
  );
};

export default TableLayout;

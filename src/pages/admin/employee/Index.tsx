import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
} from "@/components/ui/buttons/IconBtn";
import AddEmployee from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Employee = {
  id: string;
  user: string;
  name: string;
  image: string;
  gender: string;
  address: string;
  phoneNo: string;
};

const EmployeeIndex = () => {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee`,
            { params: { page, limit, sortField, sortOrder, search }, withCredentials: true, }
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.employees.map(
          (employee: any) => ({
            id: employee._id,
            name: employee.name,
            gender: employee.gender,
            image: employee.image || "",
            address: `${employee.address.addressLine}, ${employee.address.city}, ${employee.address.province}, ${employee.address.country}`,
            phoneNo: employee.contactNo,
          })
        );
        setEmployeeData(formattedData);
        setTotalRows(response.data.data.totalEmployees);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [page, limit, sortField, sortOrder, search]);

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/employee/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchEmployeeData(); // Refresh data
        } else {
          toast(
            <ErrorToast
              message={response.data.message || "Unexpected response format."}
            />,
            {
              autoClose: 4000,
            }
          );
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.message || "Failed to delete employee.";
          toast(<ErrorToast message={errorMessage} />, {
            autoClose: 4000,
          });
        } else {
          toast(
            <ErrorToast message={"Network error. Please try again later."} />,
            {
              autoClose: 4000,
            }
          );
        }
      }
    }
  };

  const columns = [
    {
      name: "SN",
      // selector: (_: Employee, index: number) => index + 1,
      cell: (_: Employee, index: number) => index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Image",
      cell: (row: Employee) => (
        <img
          src={row.image}
          alt={row.name}
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        />
      ),
      sortable: false,
      width: "90px",
    },
    {
      name: "Name",
      selector: (row: Employee) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row: Employee) => row.gender,
      sortable: true,
      width: "100px",
    },
    {
      name: "Address",
      selector: (row: Employee) => row.address,
      sortable: true,
    },
    { name: "Phone", selector: (row: Employee) => row.phoneNo },
    {
      name: "Action",
      cell: (row: Employee) => (
        <div className="inline-flex space-x-2">
          <ShowIcon link={`/admin/employee/show/${row.id}`} />
          <EditIcon link={`/admin/employee/edit/${row.id}`} />
          {/* <DeleteIcon onClick={() => handleAction('delete', row.id)} /> */}
        </div>
      ),
      sortable: false,
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-end mt-1">
        <AddButton title="Add Employee" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={employeeData}
        totalRows={totalRows}
        page={page}
        limit={limit}
        sortField={sortField}
        sortOrder={sortOrder}
        search={search}
        onSearch={(search) => setSearch(search)}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => setLimit(newLimit)}
        onAction={handleAction}
      />

      {/* Modal for Adding Employee */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Employee"
        size="4xl"
      >
        <AddEmployee
          onSuccess={() => {
            handleCloseModal();
            fetchEmployeeData();
          }}
        />
      </Modal>
    </div>
  );
};

export default EmployeeIndex;

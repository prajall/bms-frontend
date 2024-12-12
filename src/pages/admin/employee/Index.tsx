import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import { Button } from "@/components/ui/button";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee`
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
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

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

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 justify-between mt-1">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input className="w-full pl-10" placeholder="Search Employee" />
        </div>
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

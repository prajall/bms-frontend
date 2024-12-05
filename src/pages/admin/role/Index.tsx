import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import { DeleteIcon, EditIcon, ShowIcon } from "@/components/ui/buttons/IconBtn";
import AddRole from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";

type Permission = {
    module: string;
    actions: string[];
};

type Role = {
    id: string;
    name: string;
    permissions: Permission[];
};

const RoleIndex = () => {
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRoleData = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/role`, {
                withCredentials: true,
                headers: { 
                    "Content-Type": "application/json"
                },
            });
        if (response.status === 200 && response.data.success) {
            const formattedData = response.data.data.map((role: any) => ({
            id: role._id,
            name: role.name,
            permissions: role.permissions,
          }));
          setRoleData(formattedData);
          setErrorMessage("");
        } else {
          setErrorMessage(response.data.message || "Failed to fetch roles.");
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
  
    const handleAction = async (action: string, id: string) => {
      if (action === 'delete') {
        const confirmDelete = window.confirm('Are you sure you want to delete this role?');
        if (!confirmDelete) return;

        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/role/${id}`, {
                withCredentials: true,
                headers: { 
                    "Content-Type": "application/json"
                },
            });
          if (response.status === 200 && response.data.success) {
            toast(<SuccessToast message={response.data.message} />, {
                    autoClose: 5000, 
                });
            fetchRoleData(); // Refresh data
          } else {
            toast(<ErrorToast message={response.data.message || "Unexpected response format."} />, {
                    autoClose: 4000,
                });
          }
        } catch (error: any) {
          if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Failed to delete role.";
                toast(<ErrorToast message={errorMessage} />, {
                    autoClose: 4000, 
                });
            } else {
                toast(<ErrorToast message={"Network error. Please try again later."} />, {
                    autoClose: 4000, 
                });              
            }
        }
      }
    };
  
  const columns = [
        {
            name: 'SN',
            // selector: (_: Role, index: number) => index + 1, 
            cell: (_: Role, index: number) => index + 1,
            sortable: false,
            width: '60px',
        },
        { name: 'Role Name', selector: (row: Role) => row.name, sortable: true },
        {
            name: 'Permissions',
            cell: (row: Role) =>
                row.permissions.map((permission) => (
                <div key={permission.module}>
                    <strong>{permission.module}:</strong> {permission.actions.join(', ')}
                </div>
                )),
            sortable: false,
            wrap: true,
        },
        {
            name: 'Action',
            cell: (row: Role) => (
            <div className="inline-flex space-x-2">
                <ShowIcon link={`/admin/role/show/${row.id}`} />
                <EditIcon link={`/admin/role/edit/${row.id}`} />
                <DeleteIcon onClick={() => handleAction('delete', row.id)} />
            </div>
            ),
            sortable: false
        }
    ];

    useEffect(() => {
      fetchRoleData();
    }, []);

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
    
  return (
    <div className="relative">
      <Breadcrumb pageName="Role List" />
      <div className="absolute top-10 right-0 p-4">
        <AddButton title="Add Role" onClick={handleOpenModal} />
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout columns={columns} data={roleData} onAction={handleAction} />

      {/* Modal for Adding Role */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Role" size="4xl">
        <AddRole
          onSuccess={() => {
          handleCloseModal();
          fetchRoleData();
        }} 
        />
      </Modal>
    </div>
  );
}

export default RoleIndex

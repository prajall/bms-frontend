import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import { DeleteIcon, EditIcon, ShowIcon } from "@/components/ui/buttons/IconBtn";
import AddRole from "./Create";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import usePermission from "@/hooks/usePermission";

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

  const canCreateRole = usePermission("role", "create");
  const canEditRole = usePermission("role", "edit");
  const canDeleteRole = usePermission("role", "delete");

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
            cell: (row: Role) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {row.permissions.map((permission, index) => (
                <div
                  key={`${permission.module}-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '5px', // Adds spacing between rows
                  }}
                >
                  <strong style={{ marginRight: '5px' }}>{permission.module}:</strong>
                  <span>{permission.actions.join(', ')}</span>
                </div>
              ))}
            </div>
          ),
            sortable: false,
            wrap: true,
        },
        {
            name: 'Action',
            cell: (row: Role) => (
            <div className="inline-flex space-x-2">
                <ShowIcon link={`/admin/role/show/${row.id}`} />
                {canEditRole && (
                  <EditIcon link={`/admin/role/edit/${row.id}`} />
                )}
                {canDeleteRole && (
                  <DeleteIcon onClick={() => handleAction('delete', row.id)} />
                )}
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
      <div className="flex justify-end mt-1 h-8">
        {canCreateRole && (
          <AddButton title="Add Role" onClick={handleOpenModal} />
        )}
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

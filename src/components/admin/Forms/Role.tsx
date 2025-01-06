import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import Checkbox from '@/components/ui/Checkbox';

type Permission = {
  module: string;
  actions: string[]; 
};

// Define the type for the form data
interface RoleFormData {
  name: string; // Role name
  permissions: Permission[];
}

interface RoleProps {
  initialData?: RoleFormData; // Pre-fill data for edit mode
  onSubmit: (data: FormData) => void;
}

const Role: React.FC<RoleProps> = ({ initialData, onSubmit }) => {
  const [permissions, setPermissions] = useState<Permission[]>(initialData?.permissions || []); 
  const availableModules = ["category", "product", "part", "employee", "customer", "pos", "service", "service_order", "role", "billing", "reports",];
  const availableActions = ["view", "edit", "create", "delete"];
  const reportTitles = ["Service Order Report", "Service Billing Report", "POS Report"]; 

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoleFormData>({
    defaultValues: initialData || { name: "", permissions: [] },
  });

  // Pre-fill the form with initialData if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      const mergedPermissions = availableModules.map((module) => {
        const existingPermission = initialData.permissions.find(
          (perm) => perm.module === module
        );
          
        if (module === "reports") {
          const reportActions = existingPermission
            ? existingPermission.actions
            : []; 
          return {
            module,
            actions: reportTitles.filter((report) =>
              reportActions.includes(report)
            ), 
          };
        }
          
        return (
          existingPermission || {
            module,
            actions: [], // Default to empty actions if not present in initialData
          }
        );
      });
      setValue("name", initialData.name);
        console.log(mergedPermissions);
        setPermissions(mergedPermissions || []);
      } else {
        // Ensure all modules are available with empty actions initially
        const defaultPermissions = availableModules.map((module) => {
          if (module === "reports") {
            return {
              module,
              actions: [], 
            };
          }
          return {
            module,
            actions: [],
          };
        });
      setPermissions(defaultPermissions);
    }
  }, [initialData, setValue]);

    const handleActionChange = (module: string, action: string, isChecked: boolean) => {
        setPermissions((prevPermissions) =>
        prevPermissions.map((perm) =>
            perm.module === module
            ? {
                ...perm,
                actions: isChecked
                    ? [...perm.actions, action]
                    : perm.actions.filter((a) => a !== action),
                }
            : perm
        )
        );
    };

  const handleFormSubmit = (data: RoleFormData) => {
    // Filter out permissions with no actions selected
    const filteredPermissions = permissions.filter(
      (permission) => permission.actions && permission.actions.length > 0
    );
    // Process the remaining permissions
    const processedPermissions = filteredPermissions.map((permission) => ({
      module: permission.module.toLowerCase(),
      actions: permission.actions.map((action) => action.toLowerCase()),
    }));
    const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("permissions", JSON.stringify(processedPermissions));
      console.log("Processed Permissions:", processedPermissions);
      onSubmit(formData);
    };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <Card>
        <CardContent>
          <div className="w-full grid grid-cols-1 py-5">
            {/* Name */}
            <div className='mb-4'>
              <Label htmlFor="name">
                Role Name <span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("name", { required: "Role Name is required" })}
                id="name"
                placeholder="Enter role name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Permissions Module List and Actions */}
            <div className="mb-4">
              <Label>Permissions</Label>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left">Module</th>
                    {availableActions.map((action) => (
                      <th key={action} className="border border-gray-200 px-4 py-2 text-left">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* {permissions.map((permission) => (
                    <tr key={permission.module}>
                      <td className="border border-gray-200 px-4 py-2">{permission.module}</td>
                      {availableActions.map((action) => (
                        <td
                          key={`${permission.module}-${action}`}
                          className="border border-gray-200 px-4 py-2"
                        >
                          <Checkbox
                            label=""
                            checked={permission.actions.includes(action)}
                            onChange={(isChecked) =>
                              handleActionChange(permission.module, action, isChecked)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))} */}

                  {permissions.map((permission) =>
                    permission.module === "reports" ? (
                      reportTitles.map((report) => (
                        <tr key={`${permission.module}-${report}`}>
                          <td className="border border-gray-200 px-4 py-2">{report}</td>
                          <td
                            colSpan={availableActions.length}
                            className="border border-gray-200 px-4 py-2"
                          >
                            <Checkbox
                              label={`Access ${report}`}
                              checked={permission.actions.includes(report)}
                              onChange={(isChecked) =>
                                handleActionChange(permission.module, report, isChecked)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={permission.module}>
                        <td className="border border-gray-200 px-4 py-2">{permission.module}</td>
                        {availableActions.map((action) => (
                          <td
                            key={`${permission.module}-${action}`}
                            className="border border-gray-200 px-4 py-2"
                          >
                            <Checkbox
                              label=""
                              checked={permission.actions.includes(action)}
                              onChange={(isChecked) =>
                                handleActionChange(permission.module, action, isChecked)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
                      
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
        </CardFooter>     
      </Card>

      
    </form>
  );
};

export default Role;

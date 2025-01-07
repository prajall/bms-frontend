export const hasPermission = (
  user: any, 
  module: string,
  action: string
): boolean => {
    if (user?.type === "super_admin") {
        return true; 
    }
    
    if (!user || user.type !== "employee" || !user.role) {
        return false;
    }

    const modulePermission = user.role.permissions.find(
        (perm :any) => perm.module === module
    );

    return modulePermission ? modulePermission.actions.includes(action) : false;
};

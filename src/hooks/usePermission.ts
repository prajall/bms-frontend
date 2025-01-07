import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { hasPermission } from "@/utils/permissions";

/**
 * Custom hook to check user permissions.
 * @param module - The module to check permission for.
 * @param action - The action to check permission for.
 * @returns `true` if the user has the required permission, otherwise `false`.
 */
const usePermission = (module: string, action: string): boolean => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Super admin has all permissions
  if (user?.type === "super_admin") {
    return true;
  }

  // Check permissions for other users
  return hasPermission(user, module, action);
};

export default usePermission;

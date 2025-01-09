import { useMemo } from "react";
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
  const hasAccess = useMemo(() => {
    if (user?.type === "super_admin") {
      return true;
    }
    return hasPermission(user, module, action);
  }, [user, module, action]);

  return hasAccess;
};

export default usePermission;

import React, { useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom"; // Import useRouter
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { Navigate } from "react-router-dom";
import usePermission from "@/hooks/usePermission";

interface AdminLayoutProps {
  children: ReactNode;
  module: string;
  action: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({children,module= "dashboard", action = "view",}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Get the current location
  const hasAccess = usePermission(module, action);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Determine if the current route is /admin/pos
  const isPosRoute = location.pathname === "/admin/pos";

  return (
    <div className="dark:bg-boxdark-2 bg-background_light dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {!isPosRoute && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto p-4 ">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default AdminLayout;

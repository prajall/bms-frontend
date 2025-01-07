import {
  BarChart2,
  Calendar,
  Circle,
  DollarSign,
  FileIcon,
  FileText,
  GitBranch,
  Grid,
  Home,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import usePermission from "@/hooks/usePermission";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuItems = [
  {
      name: "Dashboard",
      icon: Home,
      link: "/admin",
      title: "Dashboard",
      module: "dashboard",
      action: "view"
  },
  {
    name: "Items",
    icon: Grid,
    link: "#",
    children: [
      { name: "Category", link: "/admin/category", title: "Items-Category", module: "category", action: "view" },
      { name: "Product", link: "/admin/products", title: "Items-Products", module: "product", action: "view" },
      { name: "Parts", link: "/admin/parts", title: "Items-Parts", module: "part", action: "view" },
    ],
  },
  { name: "POS", icon: DollarSign, link: "/admin/pos", title: "Point of Sale", module: "pos", action: "view" },
  {
    name: "Users",
    icon: Users,
    link: "#",
    children: [
      {
        name: "Customers",
        link: "/admin/customers",
        title: "Customers Management",
        module: "customer",
        action: "view"
      },
      {
        name: "Employee",
        link: "/admin/employees",
        title: "Employee Management",
        module: "employee",
        action: "view"
      },
    ],
  },
  {
    name: "Services",
    icon: Wrench,
    link: "#",
    children: [
      {
        name: "Services",
        link: "/admin/service",
        title: "Service Management",
        module: "service",
        action: "view"
      },
      {
        name: "Service Orders",
        link: "/admin/service_order",
        title: "Service Management",
        module: "service_order",
        action: "view"
      },
    ],
  },
  { name: "Roles and Permission", icon: Shield, link: "/admin/roles", module: "role", action: "view" },
  // { name: "Bookings", icon: Calendar, link: "/bookings", module: "category", action: "view" },
  // { name: "Orders", icon: ShoppingCart, link: "/orders" },
  { name: "Billings", icon: FileText, link: "/admin/billings", module: "billing", action: "view" },
  {
    name: "Reports",
    icon: BarChart2,
    link: "#",
    children: [
      {
        name: "Services Order",
        link: "/admin/report/service-order",
        title: "Reports",
        module: "reports",
        action: "service_order_report"
      },
      {
        name: "Service Billing",
        link: "/admin/report/billing",
        title: "Reports",
        module: "reports",
        action: "service_billing_report"
      },
      {
        name: "POS",
        link: "/admin/report/pos",
        title: "Reports",
        module: "reports",
        action: "POS_report"
      },
    ],
  },
  { name: "Templates", icon: FileIcon, link: "/admin/templates", module: "templates", action: "view" },
  // { name: "Brand", icon: GitBranch, link: "/brand" },
  {
    name: "Configuration",
    icon: Settings,
    link: "#",
    children: [
      {
        name: "Business",
        link: "/admin/business_config",
        title: "Configuration",
        module: "business_config",
        action: "view"
      },
      {
        name: "System",
        link: "/admin/system_config",
        title: "Configuration",
        module: "system_config",
        action: "view"
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { businessConfig, loading, error } = useBusinessConfig();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.children) {
      item.children = item.children.filter((child) =>
        usePermission(child.module, child.action)
      );
      return item.children.length > 0;
    }
    return usePermission(item.module, item.action);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const businessLogo = businessConfig?.logo || "";

  return (
    <aside
      ref={sidebar}
      className={`absolute  p-4 border-r border-gray-200 left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-background_light duration-300 ease-linear dark:bg-boxdark dark:bg-black lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between lg:flex-col lg:items-center lg:gap-4">
        <NavLink to="/admin" className="">
          {!loading && businessLogo ? (
            <img src={businessLogo} alt="Logo" className="mx-auto w-22 h-auto" />
          ) : (
            <img src={Logo} alt="Logo" className="mx-auto w-20 h-auto" />
          )}
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden ml-auto"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            ></path>
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto no-scrollbar duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {filteredMenuItems.map((item) => {
                if (item.children) {
                  // Handle dropdown menu
                  return (
                    <SidebarLinkGroup
                      key={item.name}
                      activeCondition={pathname.includes(item.link)}
                    >
                      {(handleClick, open) => (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-lg py-2 px-2 font-medium text-bodydark1  ease-in-out hover:bg-primary hover:text-white dark:hover:bg-meta-4${
                              pathname.includes(item.link) &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className="group-hover:bg-white group-hover:text-primary p-2 rounded-md">
                              <item.icon className=" w-5 h-5" />
                            </div>
                            {item.name}
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                !open && "-rotate-90"
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && "hidden"
                            }`}
                          >
                            <ul className="mb-1 flex flex-col gap-4 pl-6 mt-2">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <NavLink
                                    to={child.link}
                                    className={({ isActive }) =>
                                      `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-primary ${
                                        isActive && "!text-primary"
                                      }`
                                    }
                                  >
                                    <Circle size={10} />
                                    {child.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      )}
                    </SidebarLinkGroup>
                  );
                }

                // Render simple menu items
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.link}
                      className={`group relative flex items-center gap-2.5 rounded-lg py-2 px-2 font-medium text-bodydark1 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-meta-4 ${
                        pathname.includes(item.link) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <div className="group-hover:bg-white group-hover:text-primary p-2 rounded-md">
                        <item.icon className=" w-5 h-5" />
                      </div>
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "./headerTitleSlice";

const TitleUpdater: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const segmentTitleMap: Record<string, string> = {
    dashboard: "Dashboard",
    employees: "Employees Management",
    customers: "Customers Management",
    settings: "Settings",
    category: "Items - Category",
    parts: "Items - Parts",
    products: "Items - Products",
    products_installation: "Installation Service",
    service: "Services",
    service_order: "Service Order",
    service_billing: "Service Billing",
    service_provided: "Service Provided",
    business_config: "Business Configuration",
    system_config: "System Configuration",
  };

  useEffect(() => {
    // Extract the third segment
    const segments = location.pathname.split("/").filter(Boolean);
    const key = segments.length >= 2 ? segments[1] : "";
    const title = segmentTitleMap[key] || "Dashboard";
    dispatch(setHeaderTitle(title));
  }, [location.pathname, dispatch]);

  return null;
};

export default TitleUpdater;

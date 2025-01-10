import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LoginPage from "../pages/LoginPage";
import TestPage from "@/pages/TestPage";
import AdminLayout from "@/layouts/AdminLayout";
import Unauthorized from "@/pages/admin/Unauthorized";

import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/admin/Dashboard";
import HomePage from "../pages/HomePage";

import CustomerIndex from "@/pages/admin/customers/Index";
import EditCustomer from "@/pages/admin/customers/Edit";

import RoleIndex from "@/pages/admin/role/Index";
import EditRole from "@/pages/admin/role/Edit";

import EmployeeIndex from "@/pages/admin/employee/Index";
import EditEmployee from "@/pages/admin/employee/Edit";

import ProductIndex from "@/pages/admin/products/Index";
import EditProduct from "@/pages/admin/products/Edit";

import ProductCategoryIndex from "@/pages/admin/productCategory/Index";
import EditCategory from "@/pages/admin/productCategory/Edit";

import PartIndex from "@/pages/admin/parts/Index";
import EditPart from "@/pages/admin/parts/Edit";

import POSIndex from "@/pages/admin/POS/Index";
import POSPage from "@/pages/admin/POS/Create";

import ServiceIndex from "@/pages/admin/services/service/Index";
import EditService from "@/pages/admin/services/service/Edit";
import TitleUpdater from "@/components/admin/Header/HeaderTitle";

import ServiceOrderIndex from "@/pages/admin/services/service-order/Index";
import EditServiceOrder from "@/pages/admin/services/service-order/Edit";

import BillingIndex from "@/pages/admin/billing/Index";
import AddBilling from "@/pages/admin/billing/Create";
import EditBilling from "@/pages/admin/billing/Edit";

// reports
import ServiceOrderReport from "@/pages/admin/reports/ServiceOrderReport";
import BillingReport from "@/pages/admin/reports/BillingReport";
import POSReport from "@/pages/admin/reports/POSReport";

import SystemConfigurationPage from "@/pages/admin/configs/System";
import BusinessConfigurationPage from "@/pages/admin/configs/Business";

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <TitleUpdater />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        {/* Private routes */}

        {/* Private routes */}
        {/* <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductIndex />} />
          </Route>
        </Route> */}

        {/* admin route  start*/}
        <Route element={<PrivateRoute />}>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout module="dashboard" action="view">
                <Dashboard />
              </AdminLayout>
            }
          />

        {/* customer */}
        <Route
          path="/admin/customers"
          element={
            <AdminLayout module="customer" action="view">
              <CustomerIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/customer/edit/:id"
          element={
            <AdminLayout module="customer" action="edit">
              <EditCustomer />
            </AdminLayout>
          }
        />

        {/* Role */}
        <Route
          path="/admin/roles"
          element={
            <AdminLayout module="role" action="view">
              <RoleIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/role/edit/:id"
          element={
            <AdminLayout module="role" action="edit">
              <EditRole />
            </AdminLayout>
          }
        />

        {/* Employee */}
        <Route
          path="/admin/employees"
          element={
            <AdminLayout module="employee" action="view">
              <EmployeeIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/employee/edit/:id"
          element={
            <AdminLayout module="employee" action="edit">
              <EditEmployee />
            </AdminLayout>
          }
        />

        {/* product category */}
        <Route
          path="/admin/category"
          element={
            <AdminLayout module="category" action="view">
              <ProductCategoryIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/category/edit/:id"
          element={
            <AdminLayout module="category" action="edit">
              <EditCategory />
            </AdminLayout>
          }
        />

        {/* products */}
        <Route
          path="/admin/products"
          element={
            <AdminLayout module="product" action="view">
              <ProductIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminLayout module="product" action="edit">
              <EditProduct />
            </AdminLayout>
          }
        />

        {/* parts */}
        <Route
          path="/admin/parts"
          element={
            <AdminLayout module="part" action="view">
              <PartIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/part/edit/:id"
          element={
            <AdminLayout module="part" action="edit">
              <EditPart />
            </AdminLayout>
          }
        />

        {/* POS */}
        <Route
          path="/admin/pos"
          element={
            <AdminLayout module="pos" action="view">
              <POSIndex />
            </AdminLayout>
          }
        />
        
        <Route
          path="/admin/pos/create"
          element={
            <AdminLayout module="pos" action="create">
              <POSPage />
            </AdminLayout>
          }
        />
        
        {/* service */}
        <Route
          path="/admin/service"
          element={
            <AdminLayout module="service" action="view">
              <ServiceIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/service/edit/:id"
          element={
            <AdminLayout module="service" action="edit">
              <EditService />
            </AdminLayout>
          }
        />

        {/* service order */}
        <Route
          path="/admin/service_order"
          element={
            <AdminLayout module="service_order" action="view">
              <ServiceOrderIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/service_order/edit/:id"
          element={
            <AdminLayout module="service_order" action="edit">
              <EditServiceOrder />
            </AdminLayout>
          }
        />

        {/* service billing */}
        <Route
          path="/admin/billings"
          element={
            <AdminLayout module="billing" action="view">
              <BillingIndex />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/billings/create"
          element={
            <AdminLayout module="billing" action="create">
              <AddBilling />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/billing/edit/:id"
          element={
            <AdminLayout module="billing" action="edit">
              <EditBilling />
            </AdminLayout>
          }
        />

        {/* reports */}
        <Route
          path="/admin/report/service-order"
          element={
            <AdminLayout module="reports" action="service_order_report">
              <ServiceOrderReport />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/report/billing"
          element={
            <AdminLayout module="reports" action="service_billing_report">
              <BillingReport />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/report/pos"
          element={
            <AdminLayout module="reports" action="POS_report">
              <POSReport />
            </AdminLayout>
          }
        />

        {/* config router */}
        <Route
          path="/admin/system_config"
          element={
            <AdminLayout module="system_config" action="view">
              <SystemConfigurationPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/business_config"
          element={
            <AdminLayout module="business_config" action="view">
              <BusinessConfigurationPage />
            </AdminLayout>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />}
        />

        {/* admin route  end*/}
          </Route>
        {/* <Route path="*" element={<Navigate to="/landing" />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

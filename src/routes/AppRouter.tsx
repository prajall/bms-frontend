import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LoginPage from "../pages/LoginPage";
import TestPage from "@/pages/TestPage";
import AdminLayout from "@/layouts/AdminLayout";

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

import ServiceIndex from "@/pages/admin/services/service/Index";
import EditService from "@/pages/admin/services/service/Edit";
import TitleUpdater from "@/components/admin/Header/HeaderTitle";

import ServiceOrderIndex from "@/pages/admin/services/service-order/Index";
import EditServiceOrder from "@/pages/admin/services/service-order/Edit";

import BillingIndex from "@/pages/admin/billing/Index";
import AddBilling from "@/pages/admin/billing/Create";
import EditBilling from "@/pages/admin/billing/Edit";

import SystemConfigurationPage from "@/pages/admin/configs/System";
import BusinessConfigurationPage from "@/pages/admin/configs/Business";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
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

  return children;
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
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* customer */}
        <Route
          path="/admin/customers"
          element={
            <PrivateRoute>
              <AdminLayout>
                <CustomerIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/customer/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditCustomer />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Role */}
        <Route
          path="/admin/roles"
          element={
            <PrivateRoute>
              <AdminLayout>
                <RoleIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/role/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditRole />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Employee */}
        <Route
          path="/admin/employees"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EmployeeIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/employee/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditEmployee />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* product category */}
        <Route
          path="/admin/category"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ProductCategoryIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/category/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditCategory />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* products */}
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ProductIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* parts */}
        <Route
          path="/admin/parts"
          element={
            <PrivateRoute>
              <AdminLayout>
                <PartIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/part/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditPart />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* POS */}
        <Route
          path="/admin/pos"
          element={
            <PrivateRoute>
              <AdminLayout>
                <POSIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        
        {/* service */}
        <Route
          path="/admin/service"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ServiceIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/service/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditService />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* service order */}
        <Route
          path="/admin/service_order"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ServiceOrderIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/service_order/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditServiceOrder />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* service billing */}
        <Route
          path="/admin/billings"
          element={
            <PrivateRoute>
              <AdminLayout>
                <BillingIndex />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/billings/create"
          element={
            <PrivateRoute>
              <AdminLayout>
                <AddBilling />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/billing/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <EditBilling />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* config router */}
        <Route
          path="/admin/system_config"
          element={
            <PrivateRoute>
              <AdminLayout>
                <SystemConfigurationPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/business_config"
          element={
            <PrivateRoute>
              <AdminLayout>
                <BusinessConfigurationPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* admin route  end*/}

        {/* <Route path="*" element={<Navigate to="/landing" />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

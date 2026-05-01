import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import OfficeBoyLayout from "./layouts/OfficeBoyLayout";

import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Settings from "./components/Settings";
import Employees from "./pages/Admin/Employees/Employees";
import OfficeBoy from "./pages/Admin/OfficeBoys/OfficeBoy";
import Restaurant from "./pages/Admin/Restaurants/Restaurant";

import CreateOrder from "./pages/Employee/CreateOrder";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import MyOrders from "./pages/Employee/MyOrders";

import OfficeBoyDashboard from "./pages/OfficeBoy/OfficeBoyDashboard";
import OfficeBoyOrders from "./pages/OfficeBoy/OfficeBoyOrders";

function HomeRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.role === "Admin") return <Navigate to="/dashboard" replace />;
  if (user?.role === "Employee") return <Navigate to="/employee" replace />;
  if (user?.role === "officeBoy") return <Navigate to="/office-boy" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark",
    );
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeRedirect />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/officeboy" element={<OfficeBoy />} />
            <Route path="/restaurants" element={<Restaurant />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/create-order" element={<CreateOrder />} />
            <Route path="/employee/orders" element={<MyOrders />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["officeBoy"]}>
                <OfficeBoyLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/office-boy" element={<OfficeBoyDashboard />} />
            <Route path="/office-boy/orders" element={<OfficeBoyOrders />} />
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

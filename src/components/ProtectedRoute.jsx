import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const fallback =
      user?.role === "Admin"
        ? "/dashboard"
        : user?.role === "Employee"
          ? "/employee"
          : user?.role === "officeBoy"
            ? "/office-boy"
            : "/login";

    return <Navigate to={fallback} replace />;
  }

  return children;
}

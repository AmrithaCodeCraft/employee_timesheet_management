import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!["admin", "employee"].includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return role === "admin" ? (
      <Navigate to="/AdminPanel" replace />
    ) : (
      <Navigate to="/Dashboard" replace />
    );
  }

  return <Outlet />;
}

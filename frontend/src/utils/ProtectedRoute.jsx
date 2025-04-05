import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Checking access for role:", role); 
  
    if (!role) return <Navigate to="/unauthorized" />;
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
}

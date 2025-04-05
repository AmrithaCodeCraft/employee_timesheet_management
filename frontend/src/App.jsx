import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./utils/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes for Employee */}
        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Routes for Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/AdminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Timesheet from "./pages/Timesheet";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import PrivateRoute from "./utils/PrivateRoute";
import AdminPanel from "@/pages/AdminPanel";
import AdminPayroll from "@/pages/AdminPayroll";
import AdminTimesheet from "@/pages/AdminTimesheet";
import Employees from "@/pages/AdminEmployeeProfile"; 
import Task from "./pages/Task"; 
import AdminEmployeeTasks from "./pages/AdminEmployeeTasks";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Payroll" element={<Payroll />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/Reports" element={<AdminPayroll />} />
        <Route path="/AdminTimesheet" element={<AdminTimesheet />} />
        <Route path="/Employees" element={<Employees />} />

        <Route path="/MyTasks" element={<Task />} />
        <Route path="/AllEmployeeTasks" element={<AdminEmployeeTasks />} />

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Timesheet"
          element={
            <ProtectedRoute>
              <Timesheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminPanel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

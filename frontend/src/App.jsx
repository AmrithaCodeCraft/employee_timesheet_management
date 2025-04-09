import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Payroll" element={<Payroll />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/Reports" element={<AdminPayroll />} />
        <Route path="/AdminTimesheet" element={<AdminTimesheet />} />
        <Route path="/Employees" element={<Employees />} />

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

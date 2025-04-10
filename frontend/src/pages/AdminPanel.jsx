import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarAdmin";

export default function AdminPanel() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const empRes = await axios.get("http://localhost:5000/api/admin/all", { headers });

        const currentUserId = JSON.parse(atob(token.split(".")[1]))?.id;
        const filteredEmployees = empRes.data.filter(emp => emp._id !== currentUserId);
        setTotalEmployees(filteredEmployees.length);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, [token]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Total Employees</h3>
            <p className="text-4xl font-bold text-blue-600">{totalEmployees}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

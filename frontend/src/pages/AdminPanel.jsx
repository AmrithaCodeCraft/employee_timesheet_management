import { useEffect, useState } from "react";
import Sidebar from "@/components/SidebarAdmin";

export default function AdminPanel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/timesheet/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start bg-white p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>

        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">All Work Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-700 text-center">No work logs available.</p>
          ) : (
            logs.map((entry, index) => (
              <div key={index} className="border-b border-gray-200 p-2">
                <p><strong>Employee:</strong> {entry.user?.name || "Unknown"}</p>
                <p><strong>Date:</strong> {new Date(entry.startTime).toLocaleDateString()}</p>
                <p><strong>Worked:</strong> {entry.totalHours} hrs</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

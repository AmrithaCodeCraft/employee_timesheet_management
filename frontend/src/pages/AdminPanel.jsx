import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

export default function AdminPanel() {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch all work logs
    fetch("http://localhost:5000/api/timesheet/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Unexpected response for logs:", data);
          setLogs([]); // avoid crashing
        }
      });      

    // Fetch payroll summary
    const fetchPayrolls = async () => {
      const start = new Date();
      start.setDate(1); // Start of current month
      const end = new Date(); // Today

      const res = await fetch(
        `http://localhost:5000/api/timesheet/payroll?start=${start.toISOString()}&end=${end.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setEmployees([{ name: "You", ...data.payroll }]); // Temporary until you fetch all
    };

    fetchPayrolls();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4 overflow-y-auto">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>


      {/* All Logs */}
      <div className="bg-white p-4 rounded-lg shadow-md w-[500px] max-h-[60vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2 text-center">All Work Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-700">No work logs available.</p>
        ) : (
          logs.map((entry, index) => (
            <div key={index} className="border-b p-2">
              <p><strong>Employee:</strong> {entry.user?.name}</p>
              <p><strong>Date:</strong> {new Date(entry.startTime).toLocaleDateString()}</p>
              <p><strong>Worked:</strong> {entry.totalHours} hrs</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

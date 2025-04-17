import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarAdmin";

export default function AdminEmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatDate = (datetime) =>
    new Date(datetime).toLocaleDateString("en-CA"); // yyyy-mm-dd

  const formatTime = (datetime) =>
    new Date(datetime).toLocaleTimeString("en-GB"); // HH:mm:ss

  const filteredTasks = tasks.filter((task) => {
    const matchesDate = selectedDate
      ? formatDate(task.assignedAt) === selectedDate
      : true;
    const matchesEmployee = employeeIdFilter
      ? task.employeeId.toLowerCase().includes(employeeIdFilter.toLowerCase())
      : true;
    return matchesDate && matchesEmployee;
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">All Employee Tasks</h2>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-6">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="ml-2 text-sm text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Employee ID:
            </label>
            <input
              type="text"
              placeholder="e.g. EMP001"
              value={employeeIdFilter}
              onChange={(e) => setEmployeeIdFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            {employeeIdFilter && (
              <button
                onClick={() => setEmployeeIdFilter("")}
                className="ml-2 text-sm text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Task</th>
                <th className="p-2 border">Assigned Date</th>
                <th className="p-2 border">Assigned Time</th>
                <th className="p-2 border">Completed Time</th>
                <th className="p-2 border">Status</th>

              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No tasks found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="border-t">
                    <td className="p-2 border">{task.employeeId}</td>
                    <td className="p-2 border">{task.employeeEmail}</td>
                    <td className="p-2 border">{task.task}</td>
                    <td className="p-2 border">{formatDate(task.assignedAt)}</td>
                    <td className="p-2 border">{formatTime(task.assignedAt)}</td>
                    <td className="p-2 border">
                      {task.completedAt ? formatTime(task.completedAt) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </td>
                    <td
                      className={`p-2 border font-semibold ${
                        task.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {task.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

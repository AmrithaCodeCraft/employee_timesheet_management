import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarAdmin";

export default function AdminEmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">All Employee Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Task</th>
                <th className="p-2 border">Assigned At</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-t">
                  <td className="p-2 border">{task.employeeId}</td>
                  <td className="p-2 border">{task.employeeEmail}</td>
                  <td className="p-2 border">{task.task}</td>
                  <td className="p-2 border">{new Date(task.assignedAt).toLocaleString()}</td>
                  <td className={`p-2 border font-semibold ${task.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                    {task.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

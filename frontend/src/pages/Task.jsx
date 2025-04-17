import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const markCompleted = async (id) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatDate = (datetime) =>
    new Date(datetime).toLocaleDateString("en-CA"); // yyyy-mm-dd

  const formatTime = (datetime) =>
    new Date(datetime).toLocaleTimeString("en-GB");

  const filteredTasks = selectedDate
    ? tasks.filter(task => formatDate(task.assignedAt) === selectedDate)
    : tasks;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={() => setSelectedDate("")}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <p>No tasks for selected date.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Task</th>
                  <th className="py-2 px-4">Assigned Date</th>
                  <th className="py-2 px-4">Assigned Time</th>
                  <th className="py-2 px-4">Completed Time</th>     <th className="py-2 px-4">Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="border-t">
                    <td className="py-2 px-4">{task.task}</td>
                    <td className="py-2 px-4">{formatDate(task.assignedAt)}</td>
                    <td className="py-2 px-4">{formatTime(task.assignedAt)}</td>
                    <td className="py-2 px-4">
                      {task.completedAt
                        ? formatTime(task.completedAt)
                        : <span className="text-gray-500">Pending</span>}
                    </td>
                    <td className="py-2 px-4">
                      {task.status === "Pending" ? (
                        <button
                          onClick={() => markCompleted(task._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="bg-white p-4 mb-4 shadow rounded border">
              <p><strong>Task:</strong> {task.task}</p>
              <p><strong>Assigned:</strong> {new Date(task.assignedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {task.status}</p>
              {task.status === "Pending" && (
                <button
                  onClick={() => markCompleted(task._id)}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

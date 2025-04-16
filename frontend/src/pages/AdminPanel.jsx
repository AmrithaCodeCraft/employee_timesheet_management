import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarAdmin";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [task, setTask] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const empRes = await axios.get("http://localhost:5000/api/admin/all", { headers });

      const currentUserId = JSON.parse(atob(token.split(".")[1]))?.id;
      const filteredEmployees = empRes.data.filter(emp => emp._id !== currentUserId);
      setEmployees(filteredEmployees);
      setTotalEmployees(filteredEmployees.length);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveRequests(res.data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaveRequests();
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  const handleAssignTask = async () => {
    try {
      if (!selectedEmployee || !task) return alert("Fill all fields");
      await axios.post("http://localhost:5000/api/tasks/assign", {
        employeeEmail: selectedEmployee,
        task,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Task assigned!");
      setSelectedEmployee("");
      setTask("");
    } catch (err) {
      console.error("Task assignment error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  const filteredRequests = leaveRequests.filter((leave) => {
    if (!filterDate) return true;
    return (
      leave.status === "Approved" &&
      new Date(leave.updatedAt).toISOString().slice(0, 10) === filterDate
    );
  });

  const today = new Date().toISOString().split("T")[0];

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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left half: Leave Requests */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Leave Requests</h3>

            <input
              type="date"
              min="2020-01-01" // set a realistic lower bound if needed
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mb-4 px-3 py-2 border rounded w-full"
            />

            {filteredRequests.length === 0 ? (
              <p>No leave requests yet.</p>
            ) : (
              filteredRequests.map((leave) => (
                <div key={leave._id} className="bg-white p-4 mb-4 rounded shadow border border-gray-200">
                  <p><strong>Employee:</strong> {leave.employeeId} - {leave.fullName}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>From:</strong> {new Date(leave.from).toLocaleString()}</p>
                  <p><strong>To:</strong> {new Date(leave.to).toLocaleString()}</p>
                  <p><strong>Status:</strong> {leave.status}</p>
                  {leave.status === "Pending" && (
                    <div className="mt-2 space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleLeaveAction(leave._id, "Approved")}>Approve</Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleLeaveAction(leave._id, "Rejected")}>Reject</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right half: Assign Task */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Assign Task</h3>
            <div className="bg-white p-4 rounded shadow border border-gray-200">
              <label className="block mb-2 text-gray-700 font-semibold">Select Employee:</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="" disabled>-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.email}>
                    {emp.employeeId} - {emp.fullName}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-gray-700 font-semibold">Task:</label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                rows="4"
                placeholder="Enter task details"
              />

            <Button 
              disabled={!selectedEmployee || !task}
              onClick={handleAssignTask}
              className="bg-blue-600 text-white disabled:opacity-50"
            >
              Assign Task
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

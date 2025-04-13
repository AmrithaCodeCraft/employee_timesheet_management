import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarAdmin";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import { toast } from "sonner";

export default function AdminEmployeeProfile() {
  const [employees, setEmployees] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const currentUserId = JSON.parse(atob(token.split(".")[1]))?.id;
      const filteredEmployees = res.data.filter(emp => emp._id !== currentUserId);
      setEmployees(filteredEmployees);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };  

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/update/${updatedData._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee updated successfully");
      setShowEditModal(false);
      fetchEmployees();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    const currentUserId = JSON.parse(atob(token.split(".")[1]))?.id;
    if (employeeToDelete._id === currentUserId) {
      toast.warning("You cannot delete your own account.");
      setShowDeleteDialog(false);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${employeeToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee deleted successfully");
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete._id));
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Employees</h2>
        <table className="min-w-full bg-white shadow-md rounded">
        <thead>
  <tr className="text-left border-b">
    <th className="py-2 px-4">Employee ID</th>
    <th className="py-2 px-4">Full Name</th>
    <th className="py-2 px-4">Email</th>
    <th className="py-2 px-4">Actions</th>
  </tr>
</thead>
<tbody>
  {employees.map((emp) => (
    <tr key={emp._id} className="border-b hover:bg-gray-100">
      <td className="py-2 px-4">{emp.employeeId || "-"}</td>
      <td className="py-2 px-4">{emp.fullName}</td>
      <td className="py-2 px-4">{emp.email}</td>
      <td className="py-2 px-4 space-x-2">
        <Button variant="destructive" onClick={() => handleDelete(emp)}>Delete</Button>
      </td>
    </tr>
  ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {showDeleteDialog && employeeToDelete && (
        <DeleteDialog
          open={showDeleteDialog}
          setOpen={setShowDeleteDialog}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          description={`Are you sure you want to delete ${employeeToDelete.fullName}?`}
        />
      )}
    </div>
  );
}

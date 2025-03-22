import { Button } from "../components/ui/button";

export default function AdminPanel() {
  const employees = [
    { id: 1, name: "John Doe", status: "Pending" },
    { id: 2, name: "Jane Smith", status: "Approved" },
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="border-b p-2 flex justify-between items-center"
          >
            <span>
              {emp.name} - {emp.status}
            </span>
            {emp.status === "Pending" && (
              <Button className="bg-green-500 text-white">Approve</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

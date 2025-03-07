export default function Employees() {
    const employees = [
      { id: 1, name: "John Doe", role: "Employee" },
      { id: 2, name: "Jane Smith", role: "Admin" },
    ];
  
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
        <ul className="bg-white p-4 rounded shadow-md w-96">
          {employees.map((emp) => (
            <li key={emp.id} className="border-b p-2">{emp.name} - {emp.role}</li>
          ))}
        </ul>
      </div>
    );
  }
  
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="space-x-4">
        <Link to="/timesheet" className="bg-blue-500 text-white px-4 py-2 rounded">Timesheet</Link>
        <Link to="/employees" className="bg-green-500 text-white px-4 py-2 rounded">Manage Employees</Link>
        <Link to="/reports" className="bg-purple-500 text-white px-4 py-2 rounded">Reports</Link>
      </div>
    </div>
  );
}

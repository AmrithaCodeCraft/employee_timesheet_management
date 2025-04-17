import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Needed for redirecting after logout

  const menuItems = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Timesheet", path: "/Timesheet" },
    { name: "My Tasks", path: "/MyTasks" },
    { name: "Payroll", path: "/Payroll" },
    { name: "Profile", path: "/Profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-[220px] bg-blue-900 text-white p-14 h-screen flex flex-col justify-between">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`hover:text-gray-300 cursor-pointer ${
                location.pathname === item.path ? "underline font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="text-sm bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
}

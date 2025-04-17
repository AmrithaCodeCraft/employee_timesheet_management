import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Admin Dashboard", path: "/AdminPanel" },
    { name: "All Timesheets", path: "/AdminTimesheet" },
    { name: "Employee Profiles", path: "/Employees" },
    { name: "Employee Tasks", path: "/AllEmployeeTasks" },
    { name: "Payroll Reports", path: "/Reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // or sessionStorage if that's what you use
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="w-[260px] bg-blue-900 text-white py-10 px-8 h-screen flex flex-col justify-between">
      <ul className="space-y-5">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`hover:text-gray-300 block ${
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
        className="mt-8 text-sm bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
}

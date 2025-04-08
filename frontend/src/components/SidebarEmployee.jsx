import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Timesheet", path: "/Timesheet" },
    { name: "Payroll", path: "/Payroll" },
    { name: "Profile", path: "/Profile" },
  ];

  return (
    <div className="w-[220px] bg-blue-900 text-white p-14 h-screen">
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
    </div>
  );
}

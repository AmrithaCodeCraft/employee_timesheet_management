import { Link, useLocation } from "react-router-dom";

export default function SidebarAdmin() {
  const location = useLocation();

  const menuItems = [
    { name: "Admin Dashboard", path: "/AdminPanel" },
    { name: "All Timesheets", path: "/AdminTimesheet" },
    { name: "Employee Profiles", path: "/Employees" },
    { name: "Payroll Reports", path: "/Reports" },
  ];

  return (
    <div className="w-[260px] bg-blue-900 text-white py-10 px-8 h-screen">
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
    </div>
  );
}

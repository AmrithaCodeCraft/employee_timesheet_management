import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";

export default function Payroll() {
  const [payrollData, setPayrollData] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/payroll/user/${userId}?month=${month}&year=${year}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPayrollData(response.data);
      } catch (error) {
        console.error("Error fetching payroll:", error);
      }
    };

    fetchPayroll();
  }, [userId, token]);

  const calculateSalary = (hours, minutes) => {
    let salary = hours * 150;
    if (minutes >= 30) salary += 75;
    return salary;
  };  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-semibold mb-4">Payroll Summary</h2>
        {payrollData ? (
          <div className="bg-white rounded-md shadow p-6">
            <table className="w-full text-center">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th>Hours</th>
                  <th>Minutes</th>
                  <th>Salary (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{payrollData.hours}</td>
                  <td>{payrollData.minutes}</td>
                  <td className="font-semibold text-green-600">
                    ₹{calculateSalary(payrollData.hours, payrollData.minutes)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-sm text-gray-500 mt-2">Rate: ₹150/hour, ₹75 for 30+ mins</div>
          </div>
        ) : (
          <div className="text-gray-600">Loading or no data available...</div>
        )}
      </div>
    </div>
  );
}

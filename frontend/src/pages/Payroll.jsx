import { useEffect, useState } from "react";

export default function Payroll() {
  const [payroll, setPayroll] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/payroll", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPayroll(data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
      <h1 className="text-3xl font-bold text-white mb-6">Payroll Summary</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
        {payroll ? (
          <>
            <p className="text-xl">Total Hours: {payroll.totalHours} hrs</p>
            <p className="text-xl font-bold mt-2">Pay: {payroll.payroll}</p>
          </>
        ) : (
          <p>Loading payroll...</p>
        )}
      </div>
    </div>
  );
}

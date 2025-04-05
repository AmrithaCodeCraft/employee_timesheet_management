import { useEffect, useState } from "react";

export default function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/timesheet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTimesheets(data));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-rose-600 to-pink-400">
      <h1 className="text-3xl font-bold text-white mb-6">Your Timesheet</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
        {timesheets.length === 0 ? (
          <p className="text-gray-700">No work logs available.</p>
        ) : (
          timesheets.map((entry, index) => (
            <div key={index} className="border-b p-2">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(entry.startTime).toLocaleDateString()}
              </p>
              <p>
                <strong>Worked Hours:</strong> {entry.totalHours} hrs
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

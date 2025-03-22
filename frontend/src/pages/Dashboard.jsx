// import { useState, useEffect } from "react";
// import { Button } from "../components/ui/button";

// export default function Dashboard() {
//   const [isWorking, setIsWorking] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [totalTime, setTotalTime] = useState({
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     let interval;
//     if (isWorking) {
//       interval = setInterval(() => {
//         const now = new Date();
//         const diff = now - startTime; // Time difference in milliseconds

//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setTotalTime({ hours, minutes, seconds });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isWorking, startTime]);

//   const handleStart = () => {
//     const now = new Date();
//     setIsWorking(true);
//     setStartTime(now);
//     setEndTime(null);
//   };

//   const handleStop = () => {
//     const now = new Date();
//     setIsWorking(false);
//     setEndTime(now);

//     // Calculate total work time
//     const diff = now - startTime;
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//     setTotalTime({ hours, minutes, seconds });

//     // Save work log to backend
//     fetch("http://localhost:5000/api/timesheet", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         startTime,
//         endTime: now,
//         totalHours: `${hours}h ${minutes}m ${seconds}s`,
//       }),
//     });
//   };

//   return (
//     <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-700">
//       <h1 className="text-3xl font-bold text-white mb-6">Employee Dashboard</h1>

//       <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
//         {isWorking ? (
//           <Button
//             className="bg-red-500 hover:bg-red-600 transition text-white w-full"
//             onClick={handleStop}
//           >
//             Stop Work
//           </Button>
//         ) : (
//           <Button
//             className="bg-green-500 hover:bg-green-600 transition text-white w-full"
//             onClick={handleStart}
//           >
//             Start Work
//           </Button>
//         )}

//         <div className="mt-4 text-gray-700">
//           {startTime && <p>Start Time: {startTime.toLocaleTimeString()}</p>}
//           {endTime && <p>End Time: {endTime.toLocaleTimeString()}</p>}
//           <p>
//             <strong>Total Work Time:</strong> {totalTime.hours}h{" "}
//             {totalTime.minutes}m {totalTime.seconds}s
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useAuth } from "../hooks/useAuth";  // ✅ Import useAuth

const Dashboard = () => {
  const user = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

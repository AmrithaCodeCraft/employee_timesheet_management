import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [payroll, setPayroll] = useState(null);

useEffect(() => {
  const fetchPayroll = async () => {
    const start = new Date();
    start.setDate(1);
    const end = new Date();

    const res = await fetch(
      `http://localhost:5000/api/timesheet/payroll?start=${start.toISOString()}&end=${end.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setPayroll(data.payroll);
  };

  fetchPayroll();
}, []);

  useEffect(() => {
    let interval;
    if (isWorking) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - startTime; // Time difference in milliseconds

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTotalTime({ hours, minutes, seconds });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, startTime]);

  const handleStart = () => {
    const now = new Date();
    setIsWorking(true);
    setStartTime(now);
    setEndTime(null);
  };

  const handleStop = () => {
    const now = new Date();
    setIsWorking(false);
    setEndTime(now);

    // Calculate total work time
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const totalSeconds = Math.floor(diff / 1000);

    setTotalTime({ hours, minutes, seconds });

    // Save work log to backend
    fetch("http://localhost:5000/api/timesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json", 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        startTime,
        endTime: now,
        totalHours: `${hours}h ${minutes}m ${seconds}s`,
        totalSeconds,
      }),
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-700">
      <h1 className="text-3xl font-bold text-white mb-6">Employee Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
        {isWorking ? (
          <Button
            className="bg-red-500 hover:bg-red-600 transition text-white w-full"
            onClick={handleStop}
          >
            Stop Work
          </Button>
        ) : (
          <Button
            className="bg-green-500 hover:bg-green-600 transition text-white w-full"
            onClick={handleStart}
          >
            Start Work
          </Button>
        )}
        
        {payroll && (
  <div className="mt-4 text-gray-700">
    <p><strong>Monthly Hours:</strong> {payroll.totalHours} hrs</p>
    <p><strong>Estimated Pay:</strong> ₹{payroll.totalPay}</p>
  </div>
)}
        <div className="mt-4 text-gray-700">
          {startTime && <p>Start Time: {startTime.toLocaleTimeString()}</p>}
          {endTime && <p>End Time: {endTime.toLocaleTimeString()}</p>}
          <p>
            <strong>Total Work Time:</strong> {totalTime.hours}h{" "}
            {totalTime.minutes}m {totalTime.seconds}s
          </p>
        </div>
      </div>
    </div>
  );
}

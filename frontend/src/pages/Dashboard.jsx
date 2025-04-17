import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/SidebarEmployee";
import axios from "axios";

const Dashboard = () => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const [monthlyHours, setMonthlyHours] = useState(0);
  const [monthlyMinutes, setMonthlyMinutes] = useState(0);
  const [monthlySeconds, setMonthlySeconds] = useState(0);
  const [leaveStatus, setLeaveStatus] = useState(null); // for displaying latest leave

  const hourlyRate = 150;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");
  const day = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const storedStart = localStorage.getItem(`startTime_${userId}`);
    if (storedStart) {
      const start = new Date(storedStart);
      setStartTime(start);
      const secondsElapsed = Math.floor((new Date() - start) / 1000);
      setElapsedTime(secondsElapsed);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    fetchSummary();
    fetchLeaveStatus();

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    localStorage.setItem(`startTime_${userId}`, now.toISOString());

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStop = async () => {
    if (!startTime) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const endTime = new Date();
    const durationMs = endTime - new Date(startTime);
    const totalSeconds = Math.floor(durationMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    try {
      await axios.post(
        "http://localhost:5000/api/timesheet",
        {
          user: userId,
          startTime,
          endTime,
          totalHours,
          totalMinutes: totalMinutes % 60,
          totalSeconds: totalSeconds % 60,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearInterval(intervalRef.current);
      setStartTime(null);
      setElapsedTime(0);
      localStorage.removeItem(`startTime_${userId}`);
      fetchSummary();
    } catch (err) {
      console.error("Stop work error:", err);
    }
  };

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/timesheet/summary/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMonthlyHours(res.data.totalHours || 0);
      setMonthlyMinutes(res.data.totalMinutes || 0);
      setMonthlySeconds(res.data.totalSeconds || 0);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const fetchLeaveStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/leave/my-leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaveStatus(response.data); // assuming you have state for leaveStatus
    } catch (error) {
      console.error("Failed to fetch leave status: ", error);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateSalary = (hours, minutes) => {
    let salary = hours * hourlyRate;
    if (minutes >= 30) salary += hourlyRate / 2;
    return salary;
  };

  const estimatedPay = calculateSalary(monthlyHours, monthlyMinutes).toFixed(2);

  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="p-6 space-y-6 w-full">
        <div className="text-2xl font-semibold">Welcome</div>
        <div className="text-muted-foreground">
          {formattedDate} | {day}
        </div>

        {/* Working Time */}
        <Card className="p-6 space-y-4 mt-4">
          <div className="text-lg font-medium">Working Time</div>
          <div className="text-4xl font-bold">{formatTime(elapsedTime)}</div>
          <div className="space-x-4 mt-4">
            <Button
              onClick={handleStart}
              disabled={startTime !== null}
              className="bg-green-500 hover:bg-green-600"
            >
              Start Work
            </Button>
            <Button
              onClick={handleStop}
              disabled={startTime === null}
              className="bg-red-500 hover:bg-red-600"
            >
              Stop Work
            </Button>
          </div>
        </Card>

        {/* Salary Display */}
        <Card className="p-4 mt-4">
          <div className="text-md text-gray-700">
            Estimated Salary This Month:
          </div>
          <div className="text-2xl font-bold text-green-700">
            ₹{estimatedPay}
          </div>
        </Card>

        {/* Leave Notification */}
        <Card className="p-4 bg-gray-100 border-l-4 border-blue-500 shadow mt-4">
          {leaveStatus && leaveStatus.length > 0 ? (
            <div className="text-sm text-gray-700 space-y-2">
              <h2 className="font-semibold text-base mb-2">
                Your Recent Leave Requests
              </h2>
              {leaveStatus.map((leave, index) => (
                <div key={index}>
                  Your leave from{" "}
                  <b>
                    {leave.from
                      ? new Date(leave.from).toLocaleDateString()
                      : "N/A"}
                  </b>{" "}
                  to{" "}
                  <b>
                    {leave.to ? new Date(leave.to).toLocaleDateString() : "N/A"}
                  </b>{" "}
                  for "<b>{leave.reason || "No reason given"}</b>" was{" "}
                  <span
                    className={`font-medium ${
                      leave.status?.toLowerCase() === "approved"
                        ? "text-green-600"
                        : leave.status?.toLowerCase() === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {leave.status?.charAt(0).toUpperCase() +
                      leave.status?.slice(1).toLowerCase()}
                  </span>{" "}
                  by admin.
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              No recent leave status to show.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

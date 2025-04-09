import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function Timesheet() {
  const [logs, setLogs] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/timesheet/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    if (userId && token) fetchLogs();
  }, [userId, token]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const calculateSalary = (hours, minutes) => {
    let salary = hours * 150;
    if (minutes >= 30) salary += 75;
    return salary;
  };  

  const calculateTotalSalary = () => {
    return logs.reduce((total, log) => total + calculateSalary(log.totalHours, log.totalMinutes), 0);
  };

  const totalSalary = calculateTotalSalary();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">My Timesheet Logs</h2>
        <div className="border rounded-md shadow bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell>{formatDate(log.startTime)}</TableCell>
                    <TableCell>{formatTime(log.startTime)}</TableCell>
                    <TableCell>{formatTime(log.endTime)}</TableCell>
                    <TableCell>{log.totalHours}</TableCell>
                    <TableCell>{log.totalMinutes}</TableCell>
                    <TableCell>₹{calculateSalary(log.totalHours, log.totalMinutes)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

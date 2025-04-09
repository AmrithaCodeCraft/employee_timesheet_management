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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Payroll() {
  const [logs, setLogs] = useState([]);
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());
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

  const calculateSalary = (hours, minutes) => {
    let salary = hours * 150;
    if (minutes >= 30) salary += 75;
    return salary;
  };

  const filteredLogs = logs.filter((log) => {
    const date = new Date(log.startTime);
    return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
  });

  const totalMinutes = filteredLogs.reduce(
    (acc, log) => acc + log.totalHours * 60 + (log.totalMinutes || 0),
    0
  );

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const totalSalary = calculateSalary(totalHours, remainingMinutes);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Payroll Summary</h2>

        <div className="flex gap-4 mb-6">
          <Select value={month} onValueChange={(val) => setMonth(val)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={(val) => setYear(val)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {["2024", "2025", "2026"].map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-md shadow p-6">
          <Table className="text-center w-full">
            <TableHeader>
              <TableRow className="text-gray-600 border-b">
                <TableHead>Hours</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Salary (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{totalHours}</TableCell>
                <TableCell>{remainingMinutes}</TableCell>
                <TableCell className="font-semibold text-green-600">₹{totalSalary}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="text-sm text-gray-500 mt-2">Rate: ₹150/hour, ₹75 for 30+ mins</div>
        </div>
      </div>
    </div>
  );
}

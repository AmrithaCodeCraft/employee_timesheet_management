import { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from "@/components/SidebarAdmin";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPayroll() {
  const [month, setMonth] = useState("04");
  const [year, setYear] = useState("2025");
  const [payrollData, setPayrollData] = useState([]);

  const fetchPayroll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payroll/report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { month, year },
      });
      setPayrollData(res.data);
    } catch (err) {
      console.error("Error fetching payroll:", err);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [month, year]);

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Payroll Reports</h2>

        <div className="flex items-center gap-4 mb-6">
          <Input
            type="number"
            placeholder="Year (e.g. 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-36"
          />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <Button onClick={fetchPayroll}>Filter</Button>
        </div>

        <div className="border rounded-md shadow-sm bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Salary (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.length > 0 ? (
                payrollData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.totalHours}</TableCell>
                    <TableCell>{entry.totalMinutes}</TableCell>
                    <TableCell>₹{entry.salary}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payroll data for this month.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

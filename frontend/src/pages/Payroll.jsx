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
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Payroll() {
  const [payroll, setPayroll] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;

    const fetchPayroll = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payroll/monthly/${userId}?month=${selectedMonth}&year=${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPayroll(res.data);
      } catch (err) {
        console.error("Payroll fetch error:", err);
      }
    };

    fetchPayroll();
  }, [userId, selectedMonth, selectedYear]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Payroll Report</h2>

        <div className="flex gap-4 mb-4">
          <div>
            <Label>Select Month</Label>
            <Select onValueChange={(val) => setSelectedMonth(Number(val))} defaultValue={`${selectedMonth}`}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Select Year</Label>
            <Select onValueChange={(val) => setSelectedYear(Number(val))} defaultValue={`${selectedYear}`}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((year) => (
                  <SelectItem key={year} value={`${year}`}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {payroll ? (
          <div className="bg-white p-4 rounded shadow-md mt-4 w-full max-w-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{payroll.totalHours}</TableCell>
                  <TableCell>₹{payroll.hourlyRate}</TableCell>
                  <TableCell className="font-semibold text-green-600">₹{payroll.salary}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No payroll data available.</p>
        )}
      </div>
    </div>
  );
}

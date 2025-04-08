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
  const [summary, setSummary] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/timesheet/summary/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    if (userId && token) {
      fetchSummary();
    }
  }, [userId, token]);

  // Format time as HH:mm:ss
  const formatTime = (hours = 0, minutes = 0, seconds = 0) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Timesheet Summary</h2>

        <div className="border rounded-md shadow-sm bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.length > 0 ? (
                summary.map((log, index) => {
                  const date = log._id?.date ?? "N/A";
                  const hours = log.totalHours ?? 0;
                  const minutes = log.totalMinutes ?? 0;
                  const seconds = log.totalSeconds ?? 0;

                  return (
                    <TableRow key={index}>
                      <TableCell>{date}</TableCell>
                      <TableCell>{formatTime(hours, minutes, seconds)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No logs available.
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

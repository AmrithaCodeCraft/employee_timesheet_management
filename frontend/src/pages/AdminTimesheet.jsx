import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SidebarAdmin";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const AdminTimesheet = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/timesheets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch timesheets");
        }
  
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
  
    fetchLogs();
  }, []);
  

  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold mb-4">🗂️ All Employee Logs</h2>

        <Card className="p-4 overflow-auto max-h-[75vh]">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">Employee</TableCell>
                <TableCell className="font-bold">Date</TableCell>
                <TableCell className="font-bold">Start Time</TableCell>
                <TableCell className="font-bold">End Time</TableCell>
                <TableCell className="font-bold">Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(logs) && logs.length > 0 ? (
    logs.map((log) => {
      const start = new Date(log.startTime);
      const end = log.endTime ? new Date(log.endTime) : null;
      const durationSec = end ? Math.floor((end - start) / 1000) : 0;
      const hours = Math.floor(durationSec / 3600);
      const minutes = Math.floor((durationSec % 3600) / 60);
      const seconds = durationSec % 60;

      return (
        <TableRow key={log._id}>
          <TableCell>{log.user?.name || "Unknown"}</TableCell>
          <TableCell>{start.toLocaleDateString()}</TableCell>
          <TableCell>{start.toLocaleTimeString()}</TableCell>
          <TableCell>{end ? end.toLocaleTimeString() : "—"}</TableCell>
          <TableCell>{end ? `${hours}h ${minutes}m ${seconds}s` : "In progress"}</TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={5}>No logs available.</TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default AdminTimesheet;

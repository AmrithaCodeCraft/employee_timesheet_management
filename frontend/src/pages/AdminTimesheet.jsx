import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SidebarAdmin";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";

const AdminTimesheet = () => {
  const [logs, setLogs] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/timesheet/admin/all", {
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

  const filteredLogs = logs.filter((log) => {
    if (!filteredDate) return true;
    const logDate = dayjs(log.startTime).format("YYYY-MM-DD");
    return logDate === filteredDate;
  });

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">All Employee Logs</h2>

        <div className="mb-4">
          <label htmlFor="date-filter" className="block text-sm font-medium mb-1">
            Filter by Date
          </label>
          <Input
            id="date-filter"
            type="date"
            value={filteredDate}
            onChange={(e) => setFilteredDate(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <Card className="p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-semibold w-[20%]">Employee</th>
                <th className="px-4 py-2 text-left font-semibold w-[15%]">Date</th>
                <th className="px-4 py-2 text-left font-semibold w-[20%]">Start Time</th>
                <th className="px-4 py-2 text-left font-semibold w-[20%]">End Time</th>
                <th className="px-4 py-2 text-left font-semibold w-[25%]">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs
                .filter((log) => log.user?.fullName && log.user?.employeeId)
                .map((log) => {
                const start = new Date(log.startTime);
                  const end = log.endTime ? new Date(log.endTime) : null;

                  const durationMs = end ? end - start : 0;
                  const durationSec = Math.floor(durationMs / 1000);
                  const hours = Math.floor(durationSec / 3600);
                  const minutes = Math.floor((durationSec % 3600) / 60);
                  const seconds = durationSec % 60;

                  return (
                    <tr key={log._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {`${log.user.employeeId} - ${log.user.fullName}`}
                    </td>
                      <td className="px-4 py-2">{start.toLocaleDateString()}</td>
                      <td className="px-4 py-2">{start.toLocaleTimeString()}</td>
                      <td className="px-4 py-2">
                        {end ? end.toLocaleTimeString() : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {end
                          ? `${hours}h ${minutes}m ${seconds}s`
                          : "In progress"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default AdminTimesheet;

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState(new Date()); // default to today
  const [message, setMessage] = useState("");
  const [leaveFrom, setLeaveFrom] = useState(new Date());
  const [leaveTo, setLeaveTo] = useState(null); // default to today
  const [leaveStatus, setLeaveStatus] = useState(null);

  const [leaveMessage, setLeaveMessage] = useState('');

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const approvedLeave = response.data.find((leave) => leave.status === "Approved");
        if (approvedLeave) {
          setLeaveStatus("Your recent leave request has been approved!");
        }
      } catch (error) {
        console.error("Error fetching your leave status", error);
      }
    };

    fetchMyLeaves();
  }, [token]);

  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/leave/request",
        {
          reason: leaveReason,
          from: leaveFrom,
          to: leaveTo,
          employeeId: profile.employeeId,
          fullName: profile.fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`Leave requested from ${leaveFrom.toDateString()} to ${leaveTo?.toDateString() || 'N/A'}`);
      setLeaveReason("");
      setLeaveFrom(new Date());
      setLeaveTo(null);
    } catch (error) {
      setMessage("Failed to submit leave request");
      console.error(error);
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Profile
        </h2>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
          <div className="mb-4">
            <Label className="text-sm">Employee ID</Label>
            <Input value={profile.employeeId} disabled />
          </div>
          <div className="mb-4">
            <Label className="text-sm">Full Name</Label>
            <Input value={profile.fullName} disabled />
          </div>
          <div className="mb-4">
            <Label className="text-sm">Email</Label>
            <Input value={profile.email} disabled />
          </div>
          <div className="mb-4">
            <Label className="text-sm">Role</Label>
            <Input
              value={
                profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
              }
              disabled
            />
          </div>
        </div>

          <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Request Leave</h2>
      {leaveStatus && <p className="text-green-600 mb-2">{leaveStatus}</p>}
      {message && <p className="text-blue-500 mb-2">{message}</p>}
      <form onSubmit={submitLeaveRequest} className="space-y-2">
        
        <div>
          <label>Reason:</label>
          <input
            type="text"
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            className="border p-1 w-full"
            required
          />
        </div>

        <div>
          <label>From:</label>
          <DatePicker
            selected={leaveFrom}
            onChange={(date) => {
              setLeaveFrom(date);
              if (leaveTo && date > leaveTo) setLeaveTo(null);
            }}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="border p-1 w-full"
          />
        </div>

        <div>
          <label>To:</label>
          <DatePicker
            selected={leaveTo}
            onChange={(date) => setLeaveTo(date)}
            minDate={leaveFrom || new Date()}
            disabled={!leaveFrom}
            dateFormat="yyyy-MM-dd"
            className="border p-1 w-full"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          Submit Leave Request
        </button>
      </form>
    </div>
          {leaveMessage && (
            <p className="mt-2 text-green-600">{leaveMessage}</p>
          )}
        </div>
      </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/SidebarEmployee";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const [profile, setProfile] = useState(null);
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

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>
        <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
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
            <Input value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} disabled />
            </div>
        </div>
      </div>
    </div>
  );
}

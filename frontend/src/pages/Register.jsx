import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registration Successful!");
      navigate("/login");
    } else {
      alert("Registration Failed");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-rose-600 to-pink-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <Label>Full Name</Label>
        <Input
          type="text"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Label>Email</Label>
        <Input
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Label>Password</Label>
        <Input
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Label>Role</Label>
        <select
          className="w-full border p-2 rounded bg-white border-gray-300"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <Button
          className="w-full mt-4 bg-blue-500 text-white hover:bg-indigo-500 transition"
          onClick={handleRegister}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}

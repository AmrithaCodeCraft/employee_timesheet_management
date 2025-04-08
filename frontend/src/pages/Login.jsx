import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔐 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");

    try {
      console.log("Logging in with", email); // Debug log

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      console.log("Login success:", user); // Debug output

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("userId", res.data.userId);

      if (user.role === "admin") navigate("/AdminPanel");
      else navigate("/Dashboard");

    } catch (err) {
      console.error("Login failed:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-rose-600 to-pink-400">
      <div className="bg-white bg-opacity-100 backdrop-blur-md shadow-lg p-8 rounded-lg w-[400px]">
        <h2 className="text-2xl font-bold text-black text-center mb-4">Welcome</h2>
        <p className="text-black text-center text-sm mb-6">Sign in to continue</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-transparent border border-gray-300 text-black placeholder-white"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-transparent border border-gray-300 text-black placeholder-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold hover:bg-indigo-500 transition"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-black mt-4 text-sm">
          Don't have an account? <a href="/register" className="underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js"; // ✅ Import connectDB (NOT { connection })

dotenv.config();

const app = express();
connectDB(); // ✅ Call the database connection function

//middlewares
app.use(express.json());
app.use(cors());

// Route imports
app.use("/api/auth", authRoutes); // Add auth routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("API is running...");
});

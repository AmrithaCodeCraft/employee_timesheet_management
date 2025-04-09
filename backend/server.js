import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js"; //  Import connectDB (NOT { connection })
import timesheetRoutes from "./routes/timesheetRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
connectDB(); // Call the database connection function

//middlewares
app.use(express.json());
app.use(cors());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Route imports
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/work", workRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("API is running...");
});

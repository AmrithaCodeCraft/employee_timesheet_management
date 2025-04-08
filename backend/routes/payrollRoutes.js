import express from "express";
import {
  getUserPayroll,          // Monthly salary for a user (Employee View)
  getPayrollForUser,       // Full daily breakdown (Optional)
  getPayrollReport         // Admin View - All users
} from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧾 Get employee monthly payroll (Employee view)
router.get("/monthly/:id", protect, getUserPayroll);

// 📆 Get full timesheet payroll breakdown (Optional)
router.get("/user/:id", protect, getPayrollForUser);

// 📊 Admin: Get payroll report for all users for a month
router.get("/report", protect, getPayrollReport);

export default router;

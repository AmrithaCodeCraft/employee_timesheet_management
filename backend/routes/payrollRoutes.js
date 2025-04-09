// backend/routes/payrollRoutes.js
import express from "express";
import { getUserPayroll, getPayrollForUser, getPayrollReport } from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee Payroll view:
router.get("/user/:id", protect, getUserPayroll);

// (Optional) Detailed daily breakdown for user:
router.get("/user/detail/:id", protect, getPayrollForUser);

// Admin payroll report:
router.get("/report", protect, getPayrollReport);

export default router;

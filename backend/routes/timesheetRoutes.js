import express from "express";
import {
  createTimesheet,
  getUserTimesheetLogs,
  getUserTimesheets,
  getTimesheetSummary,
  getAllTimesheets,
  getActiveEmployees,
  getAdminHoursSummary,
  getRecentTimesheets,
} from "../controllers/timesheetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTimesheet);// Log work session
router.get("/user/:id", protect, getUserTimesheetLogs); // Employee view
router.get("/summary/:id", protect, getTimesheetSummary); // Summary by date
router.get("/admin/all", protect, getAllTimesheets); // Admin view
router.get("/:id", protect, getUserTimesheets); // GET /api/timesheet/:id

router.get("/admin/active-employees", protect, getActiveEmployees);
router.get("/admin/hours-summary", protect, getAdminHoursSummary);
router.get("/admin/recent-timesheets", protect, getRecentTimesheets);

router.get("/admin/timesheets", protect, getAllTimesheets); // Optional

export default router;

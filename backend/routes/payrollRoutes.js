import express from "express";
import Timesheet from "../models/Timesheet.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Example rate: ₹100 per hour
const HOURLY_RATE = 100;

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await Timesheet.find({ userId });

    const totalSeconds = entries.reduce((acc, log) => acc + log.totalSeconds, 0);
    const totalHours = totalSeconds / 3600;
    const payroll = totalHours * HOURLY_RATE;

    res.json({
      totalHours: totalHours.toFixed(2),
      payroll: `₹${payroll.toFixed(2)}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate payroll" });
  }
});

export default router;

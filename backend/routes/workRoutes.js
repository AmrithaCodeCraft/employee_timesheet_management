import express from "express";
import Timesheet from "../models/timesheetModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { startWork, stopWork } from "../controllers/workController.js";

const router = express.Router();

// Start Work
router.post("/start", verifyToken, async (req, res) => {
  try {
    const newSession = new WorkSession({
      userId: req.user.id,
      startTime: new Date(),
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to start work" });
  }
});

// Stop Work
router.post("/stop", verifyToken, async (req, res) => {
  try {
    const session = await WorkSession.findOne({
      userId: req.user.id,
      endTime: null,
    }).sort({ startTime: -1 });

    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    const endTime = new Date();
    const durationMs = endTime - session.startTime;
    const totalSeconds = Math.floor(durationMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    session.endTime = endTime;
    session.totalSeconds = totalSeconds;
    session.totalMinutes = totalMinutes;
    session.totalHours = totalHours;

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to stop work" });
  }
});

export default router;

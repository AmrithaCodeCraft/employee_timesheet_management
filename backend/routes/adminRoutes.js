import express from "express";
import Timesheet from "../models/timesheetModel.js";
import { User } from "../models/userModel.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/timesheets", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logs = await WorkSession.find()
      .populate("userId", "name email")
      .sort({ startTime: -1 });

    res.status(200).json(
      logs.map((log) => ({
        ...log._doc,
        user: log.userId,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timesheet logs" });
  }
});

export default router;

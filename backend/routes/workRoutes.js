import express from "express";
import WorkSession from "../models/WorkSession.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Start Work
router.post("/start", authMiddleware, async (req, res) => {
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
router.post("/stop", authMiddleware, async (req, res) => {
  try {
    const session = await WorkSession.findOne({
      userId: req.user.id,
      endTime: null,
    }).sort({ startTime: -1 });

    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    session.endTime = new Date();
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to stop work" });
  }
});

export default router;

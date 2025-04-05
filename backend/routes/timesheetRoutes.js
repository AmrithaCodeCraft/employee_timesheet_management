import express from "express";
import Timesheet from "../models/Timesheet.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  const { userId, date, startTime } = req.body;

  try {
    const existingEntry = await Timesheet.findOne({ userId, date });
    if (existingEntry) {
      return res.status(400).json({ message: "Work already started today" });
    }

    const newEntry = new Timesheet({ userId, date, startTime });
    await newEntry.save();
    res.status(201).json({ message: "Work started" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/stop", async (req, res) => {
  const { userId, date, endTime } = req.body;

  try {
    const entry = await Timesheet.findOne({ userId, date });
    if (!entry || entry.endTime) {
      return res.status(400).json({ message: "No work to stop" });
    }

    entry.endTime = endTime;

    // Calculate total duration
    const start = new Date(`${date}T${entry.startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const diffMs = end - start;
    const duration = new Date(diffMs).toISOString().substr(11, 8);
    entry.totalDuration = duration;

    await entry.save();
    res.status(200).json({ message: "Work stopped", totalDuration: duration });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/timesheet
router.get("/", authMiddleware, async (req, res) => {
    try {
      const timesheets = await Timesheet.find({ user: req.user._id }).sort({ startTime: -1 });
      res.json(timesheets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timesheets" });
    }
  });
  
// GET /api/timesheet/all (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
    try {
      const timesheets = await Timesheet.find().populate("user", "name email");
      res.json(timesheets); // ✅ Must return an array
    } catch (err) {
      console.error("Error in /all:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  // POST: Save timesheet data
  router.post("/", authMiddleware, async (req, res) => {
    try {
      const { startTime, endTime, totalHours } = req.body;
      const newEntry = new Timesheet({
        user: req.user.id,
        startTime,
        endTime,
        totalHours,
      });
      await newEntry.save();
      res.status(201).json({ message: "Timesheet saved" });
    } catch (err) {
      console.error("Error saving timesheet:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  // Payroll Route
router.get("/payroll", authMiddleware, async (req, res) => {
    try {
      const { start, end } = req.query;
      const userId = req.user.id;
  
      const timesheets = await Timesheet.find({
        user: userId,
        startTime: { $gte: new Date(start), $lte: new Date(end) },
      });
  
      const totalHours = timesheets.reduce(
        (sum, entry) => sum + (entry.totalHours || 0),
        0
      );
      const totalPay = totalHours * 100; // You can change rate later
  
      res.json({ payroll: { totalHours, totalPay } });
    } catch (err) {
      console.error("Payroll error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;

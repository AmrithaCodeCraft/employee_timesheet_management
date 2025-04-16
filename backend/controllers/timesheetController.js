import mongoose from "mongoose";
import Timesheet from "../models/timesheetModel.js";

// Get logs for one user
export const getUserTimesheetLogs = async (req, res) => {
  const { id } = req.params;

  try {
    const logs = await Timesheet.find({ user: id }).sort({ startTime: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching timesheet logs:", error.message);
    res.status(500).json({ message: "Failed to fetch timesheet logs" });
  }
};

// Create a new timesheet log
export const createTimesheet = async (req, res) => {
  try {
    const { startTime, endTime, totalHours, totalMinutes, totalSeconds } = req.body;

    const newEntry = new Timesheet({
      user: req.user.id,
      startTime,
      endTime,
      totalHours,
      totalMinutes,
      totalSeconds,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Create Timesheet Error:", error);
    res.status(500).json({ message: "Failed to create timesheet", error });
  }
};

// Summary by date for one user (using :id)
export const getTimesheetSummary = async (req, res) => {
  try {
    const userId = req.params.id; // <-- Fix here

    const summary = await Timesheet.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          },
          totalHours: { $sum: "$totalHours" },
          totalMinutes: { $sum: "$totalMinutes" },
          totalSeconds: { $sum: "$totalSeconds" },
        },
      },
      { $sort: { "_id.date": -1 } },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

// Admin - Get all logs
export const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find()
      .populate("user", "employeeId fullName email")
      .sort({ createdAt: -1 });
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch timesheets" });
  }
};

// Get logs for one user
export const getUserTimesheets = async (req, res) => {
  try {
    const userId = req.user._id;
    const timesheets = await Timesheet.find({ user: userId }).sort({ startTime: -1 });
    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Timesheet Error:", error);
    res.status(500).json({ message: "Failed to fetch timesheets" });
  }
};

// Get count of active employees (users who haven't ended their shift)
export const getActiveEmployees = async (req, res) => {
  try {
    const activeUsers = await Timesheet.find({ endTime: null }).distinct("user");
    res.status(200).json({ count: activeUsers.length });
  } catch (error) {
    console.error("Active employees error:", error);
    res.status(500).json({ message: "Failed to get active employees" });
  }
};

// Get today's and this week's total hours
export const getAdminHoursSummary = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const timesheets = await Timesheet.find({ endTime: { $ne: null } });

    let todaySeconds = 0;
    let weekSeconds = 0;

    timesheets.forEach((log) => {
      const start = new Date(log.startTime);
      const end = new Date(log.endTime);
      const duration = (end - start) / 1000;

      if (start >= startOfToday) todaySeconds += duration;
      if (start >= startOfWeek) weekSeconds += duration;
    });

    res.status(200).json({
      todayHours: Math.floor(todaySeconds / 3600),
      weekHours: Math.floor(weekSeconds / 3600),
    });
  } catch (error) {
    console.error("Hours summary error:", error);
    res.status(500).json({ message: "Failed to calculate hours" });
  }
};

// Get recent completed timesheet entries
export const getRecentTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ endTime: { $ne: null } })
      .sort({ endTime: -1 })
      .limit(5)
      .populate("user", "fullName");
    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Recent timesheets error:", error);
    res.status(500).json({ message: "Failed to fetch recent timesheets" });
  }
};

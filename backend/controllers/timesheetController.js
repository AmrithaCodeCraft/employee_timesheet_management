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
    const timesheets = await Timesheet.find().populate("user", "fullName email");
    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Get All Timesheets Error:", error);
    res.status(500).json({ message: "Failed to fetch all timesheets" });
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


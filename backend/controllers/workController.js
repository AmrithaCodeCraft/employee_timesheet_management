import Timesheet from "../models/timesheetModel.js";

export const startWork = async (req, res) => {
  try {
    const newSession = new Timesheet({
      user: req.user._id,
      startTime: new Date(),
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Failed to start work", error });
  }
};

export const stopWork = async (req, res) => {
  try {
    const session = await Timesheet.findOne({
      user: req.user._id,
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
    session.totalHours = `${totalHours}:${totalMinutes % 60}`; // Format HH:MM

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to stop work", error });
  }
};

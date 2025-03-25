// import express from "express";
// import WorkLog from "../models/WorkLog.js";
// import authMiddleware from "../middleware/authMiddleware.js"; 

// const router = express.Router();

// // 🟢 Get Total Work Hours
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const workLogs = await WorkLog.find({ userId });

//     const totalHours = workLogs.reduce((acc, log) => acc + log.hoursWorked, 0);

//     res.json({ totalHours, workLogs });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // 🟢 Start Work
// router.post("/start", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const newWorkLog = new WorkLog({ userId, startTime: new Date() });

//     await newWorkLog.save();
//     res.json({ message: "Work Started", workLog: newWorkLog });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // 🟢 Stop Work
// router.post("/stop", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const workLog = await WorkLog.findOne({ userId, endTime: null });

//     if (!workLog) return res.status(400).json({ message: "No active work session found" });

//     workLog.endTime = new Date();
//     workLog.hoursWorked = (workLog.endTime - workLog.startTime) / (1000 * 60 * 60);
//     await workLog.save();

//     res.json({ message: "Work Stopped", workLog });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// export default router;

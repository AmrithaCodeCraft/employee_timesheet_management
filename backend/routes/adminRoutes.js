import express from "express";
import Timesheet from "../models/timesheetModel.js";
import { User } from "../models/userModel.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAllEmployees } from "../controllers/userController.js";

const router = express.Router();

router.get("/all", protect, adminOnly, getAllEmployees);

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

// DELETE route to delete a user
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;

import express from "express";
import {
    requestLeave,
    getAllLeaveRequests,
    updateLeaveStatus,
    getMyLeaves,
  } from "../controllers/leaveController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/request", protect, requestLeave);
router.get("/all", protect, getAllLeaveRequests);
router.put("/:id/status", protect, updateLeaveStatus); // already present
router.get('/my-leaves', protect, getMyLeaves);

export default router;

// routes/taskRoutes.js
import express from "express";
import {
  assignTask,
  getTasksForEmployee,
  completeTask,
  getAllTasks,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign", verifyToken, assignTask);
router.get("/employee", verifyToken, getTasksForEmployee);
router.put("/:taskId/complete", verifyToken, completeTask);
router.get("/all", verifyToken, getAllTasks);

export default router;

// controllers/taskController.js
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";

export const assignTask = async (req, res) => {
  const { employeeEmail, task } = req.body;

  try {
    const user = await User.findOne({ email: employeeEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = new Task({
      employeeId: user.employeeId,
      employeeEmail,
      task,
    });

    await newTask.save();
    res.status(201).json({ message: "Task assigned", task: newTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTasksForEmployee = async (req, res) => {
  try {
    console.log("User from token:", req.user); 
    const tasks = await Task.find({ employeeId: req.user.employeeId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "Completed";
    task.completedAt = new Date();

    await task.save();
    res.json({ message: "Task marked as completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

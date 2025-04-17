import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  employeeEmail: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  completedAt: {
    type: Date,
  },
});

export const Task = mongoose.model("Task", taskSchema);

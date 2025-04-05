import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: Date,
  endTime: Date,
  totalSeconds: Number, // new field for precise calculation
  totalHours: String, // still store for readability
});


export default mongoose.model("Timesheet", timesheetSchema);

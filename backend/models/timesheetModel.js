import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalHours: Number,
  totalMinutes: Number,
  totalSeconds: Number, 
}, { timestamps: true });


const Timesheet = mongoose.model("Timesheet", timesheetSchema);
export default Timesheet;

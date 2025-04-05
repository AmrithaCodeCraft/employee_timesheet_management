import mongoose from "mongoose";

const workSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
});

const WorkSession = mongoose.model("WorkSession", workSessionSchema);
export default WorkSession;

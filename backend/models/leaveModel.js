import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: String,
    fullName: String,
    email: String,
    reason: String,
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema); 
export default Leave;

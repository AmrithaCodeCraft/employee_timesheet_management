import mongoose from 'mongoose';

const workLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  totalMinutes: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
  },
}, { timestamps: true });

const WorkLog = mongoose.model('WorkLog', workLogSchema);
export default WorkLog;
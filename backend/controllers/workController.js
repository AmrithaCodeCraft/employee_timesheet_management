import WorkLog  from '../models/worklogModel.js';
import { User } from '../models/userModel.js';

// Save work log when an employee stops work
export const saveWorkLog = async (req, res) => {
  try {
    const { userId, startTime, endTime } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    const totalMinutes = Math.floor(diff / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const date = start.toISOString().split('T')[0];

    const newLog = new WorkLog({
      user: userId,
      startTime,
      endTime,
      totalHours,
      totalMinutes: remainingMinutes,
      date,
    });

    await newLog.save();
    res.status(201).json({ message: 'Work log saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving work log', error: error.message });
  }
};

// Get all work logs for a specific employee
export const getUserTimesheet = async (req, res) => {
  try {
    const userId = req.params.id;

    const logs = await WorkLog.find({ user: userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheet', error: error.message });
  }
};

// Get payroll for a specific employee by month and year
export const getUserPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;

    const logs = await WorkLog.find({
      user: id,
      date: {
        $regex: `^${year}-${month.padStart(2, '0')}`,
      },
    });

    let totalHours = 0;
    let totalMinutes = 0;

    logs.forEach(log => {
      totalHours += log.totalHours;
      totalMinutes += log.totalMinutes;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const salary = (totalHours * 150) + (totalMinutes >= 30 ? 75 : 0);

    res.json({ totalHours, totalMinutes, salary });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll', error: error.message });
  }
};

// Admin: Get payrolls for all employees for a specific month and year
export const getAllPayrolls = async (req, res) => {
  try {
    const { month, year } = req.query;

    const logs = await WorkLog.aggregate([
      {
        $match: {
          date: { $regex: `^${year}-${month.padStart(2, '0')}` },
        },
      },
      {
        $group: {
          _id: '$user',
          totalHours: { $sum: '$totalHours' },
          totalMinutes: { $sum: '$totalMinutes' },
        },
      },
    ]);

    const results = await Promise.all(logs.map(async (item) => {
      const user = await User.findById(item._id);
      const hours = item.totalHours + Math.floor(item.totalMinutes / 60);
      const minutes = item.totalMinutes % 60;
      const salary = (hours * 150) + (minutes >= 30 ? 75 : 0);

      return {
        userId: item._id,
        name: user?.fullname || 'Unknown',
        email: user?.email || 'Unknown',
        totalHours: hours,
        totalMinutes: minutes,
        salary,
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payrolls', error: error.message });
  }
};

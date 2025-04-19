import Timesheet from "../models/timesheetModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const HOURLY_RATE = parseInt(process.env.HOURLY_RATE) || 150;

// For Admin - Get payroll report of all employees (filtered by month/year)
export const getPayrollReport = async (req, res) => {
  const { month, year } = req.query;

  try {
    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const payroll = await Timesheet.aggregate([
      {
        $match: {
          startTime: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$user",
          totalMinutes: {
            $sum: {
              $add: [
                { $multiply: ["$totalHours", 60] },
                "$totalMinutes"
              ]
            }
          }
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userId: "$_id",
          employeeId: "$userDetails.employeeId",
          name: "$userDetails.fullName",
          email: "$userDetails.email",
          totalHours: { $floor: { $divide: ["$totalMinutes", 60] } },
          totalMinutes: { $mod: ["$totalMinutes", 60] },
          salary: {
            $add: [
              { $multiply: [{ $floor: { $divide: ["$totalMinutes", 60] } }, HOURLY_RATE] },
              {
                $cond: {
                  if: { $gte: [{ $mod: ["$totalMinutes", 60] }, 30] },
                  then: 75,
                  else: 0,
                },
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(payroll);
  } catch (error) {
    console.error("Payroll Error:", error);
    res.status(500).json({ message: "Failed to fetch payroll report" });
  }
};


// For Employee - Get payroll for logged-in user (with month filter)
export const getUserPayroll = async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;

  try {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const logs = await Timesheet.find({
      user: userId,
      startTime: { $gte: startDate, $lt: endDate },
    });

    let totalMinutes = 0;

    logs.forEach((log) => {
      totalMinutes += log.totalHours * 60 + (log.totalMinutes || 0);
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const salary = ((totalMinutes / 60) * HOURLY_RATE).toFixed(2);

    res.json({
      hours: totalHours,
      minutes: remainingMinutes,
      salary,
    });
  } catch (err) {
    console.error("Error in getUserPayroll:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Daily breakdown per user
export const getPayrollForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await Timesheet.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          },
          totalHours: { $sum: "$totalHours" },
          totalMinutes: { $sum: "$totalMinutes" },
        },
      },
      { $sort: { "_id.date": -1 } },
    ]);

    const payroll = logs.map((log) => {
      const totalWorkedHours = log.totalHours + log.totalMinutes / 60;
      const pay = totalWorkedHours * HOURLY_RATE;
      return {
        date: log._id.date,
        hoursWorked: totalWorkedHours.toFixed(2),
        pay: pay.toFixed(2),
      };
    });

    res.json(payroll);
  } catch (error) {
    console.error("Payroll Error:", error);
    res.status(500).json({ message: "Failed to calculate payroll" });
  }
};

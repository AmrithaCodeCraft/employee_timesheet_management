import Timesheet from "../models/timesheetModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";

export const getPayrollForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const hourlyRate = 200; // Example rate ₹200/hour

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
      { $sort: { "_id.date": -1 } }
    ]);

    const payroll = logs.map(log => {
      const totalWorkedHours = log.totalHours + log.totalMinutes / 60;
      const pay = totalWorkedHours * hourlyRate;
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

export const getPayrollReport = async (req, res) => {
    const { month, year } = req.query;
  
    try {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
  
      const payroll = await Timesheet.aggregate([
        {
          $match: {
            startTime: {
              $gte: start,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id: "$user",
            totalHours: { $sum: "$totalHours" },
            totalMinutes: { $sum: "$totalMinutes" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails"
        },
        {
          $project: {
            userId: "$_id",
            name: "$userDetails.fullName",
            email: "$userDetails.email",
            totalHours: 1,
            totalMinutes: 1,
            salary: {
              $round: [
                {
                  $multiply: [
                    { $add: ["$totalHours", { $divide: ["$totalMinutes", 60] }] },
                    200
                  ]
                },
                0
              ]
            }
          }
        }
      ]);
      
  
      res.status(200).json(payroll);
    } catch (error) {
      console.error("Payroll Error:", error);
      res.status(500).json({ message: "Failed to fetch payroll report" });
    }
  };

  // You can customize this per user if needed
const DEFAULT_HOURLY_RATE = 200;

export const getUserPayroll = async (req, res) => {
  const { id } = req.params;
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  try {
    const logs = await Timesheet.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          startTime: {
            $gte: new Date(`${year}-${month}-01`),
            $lt: new Date(`${year}-${month + 1}-01`),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$totalHours" },
        },
      },
    ]);

    const totalHours = logs.length > 0 ? logs[0].totalHours : 0;
    const salary = totalHours * DEFAULT_HOURLY_RATE;

    res.status(200).json({
      totalHours,
      hourlyRate: DEFAULT_HOURLY_RATE,
      salary,
    });
  } catch (error) {
    console.error("Payroll Error:", error);
    res.status(500).json({ message: "Failed to generate payroll" });
  }
};
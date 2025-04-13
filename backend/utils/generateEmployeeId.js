import { Counter } from "../models/counterModel.js";

export const generateEmployeeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "employeeId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // Create if not exists
  );

  const padded = String(counter.seq).padStart(3, "0");
  return `EMP${padded}`;
};

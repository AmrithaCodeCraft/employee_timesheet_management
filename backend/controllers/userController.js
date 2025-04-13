import { User } from "../models/userModel.js";
import { generateEmployeeId } from "../utils/generateEmployeeId.js"; // Import the helper function

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const users = await User.find({}, "_id fullName email role employeeId");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


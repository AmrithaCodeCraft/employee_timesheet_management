import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Counter } from "../models/counterModel.js";
import { generateEmployeeId } from "../utils/generateEmployeeId.js"; 

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Example login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Respond with token and user data
  res.json({
    token,
    user: {
      id: user._id,
      role: user.role,
      employeeId: user.employeeId, // You can also include employeeId if needed
    },
  });
};


// Register User with Employee ID logic
export const registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Get the next employee ID only if role is employee
  let employeeId = null;
  if (role === "employee") {
    const counter = await Counter.findOneAndUpdate(
      { _id: "employeeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    employeeId = `EMP${String(counter.seq).padStart(3, "0")}`;
  }

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    ...(employeeId && { employeeId }),
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId || null,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};
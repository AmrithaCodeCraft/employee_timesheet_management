import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const router = express.Router();


/// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword, role });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });  

  export default router;


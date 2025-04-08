import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    res.status(401).json({ error: "Token missing" });
  }
};

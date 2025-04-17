import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness when employeeId is present
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  resetToken: String,
  resetTokenExpires: Date,
});

export const User = mongoose.model("User", userSchema);

export const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "employee").required(),
  });

  return schema.validate(data);
};

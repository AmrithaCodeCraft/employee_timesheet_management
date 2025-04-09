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
});

export const User = mongoose.model("User", userSchema);

// validate() function for Joi:
export const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),  // must match frontend key
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "employee").required(),
  });

  return schema.validate(data);
};

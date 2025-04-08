import mongoose from "mongoose";
import Joi from "joi";

// Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
});

// Model: Avoid re-declaration error during dev/hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Joi validation
const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "employee").optional(),
  });

  return schema.validate(data);
};

// Export both
export { User, validate };

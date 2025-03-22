const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passswordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema({
  //name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //role: { type: String, enum: ["admin", "employee"], default: "employee" }
});

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
}
const User = mongoose.model("user", UserSchema);

const validate = (data) => {
  const schema = Joi.object({
    email:Joi.string().required().label("Email"),
    password:passswordComplexity().required().label("Password")
  });
  return schema.validate(data);
}

// module.exports = mongoose.model("User", UserSchema);

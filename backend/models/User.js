const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  role: { type: String, enum: ["user", "volunteer", "admin"], default: "user" },
  profilePhoto: String
});

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  status: { type: String, default: "received" },
  images: [String], // Array of image URLs/paths
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);

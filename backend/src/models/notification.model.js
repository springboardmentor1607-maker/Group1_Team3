import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  complaint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  },
  is_read: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
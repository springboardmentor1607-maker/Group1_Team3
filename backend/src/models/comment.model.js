import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        required: true
    }

},
{ timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
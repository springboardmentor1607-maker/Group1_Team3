import mongoose, { mongo } from "mongoose";

const complaintSchema = new mongoose.Schema({

    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    issueType : {
        type : String,
        required : true,
        enum : ["pothole", "garbage", "streetlight", "water_leak", "other"]
    },
    priority : {
        type : String,
        enum : ["low", "medium", "high"],
        default : "medium"
    },
    description : {
        type : String,
        required : true,
    },
    images : {
        type : [String],
        default : null
    },
    landmark : {
        type : String,
        default : ""
    },
    location_coords : {
        lat : Number,
        lng : Number,
    },

    address : {
        type : String,
    },

    assigned_to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    resolvedRemarks : {
        type : String,
        default : "",
    },

    resolvedProofImages : {
        type : [String],
        default : [],
    },

    resolvedAt : {
        type : Date,
    },

    upvotes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    downvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    status : {
        type : String,
        enum : ["received","assigned","in_progress","resolved"],
        default : "received"
    }

},
    {timestamps : {createdAt : "created_at",updatedAt : "updated_at"}}
)

export default mongoose.model("Complaint",complaintSchema)
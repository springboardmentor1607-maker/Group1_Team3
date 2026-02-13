import mongoose, { mongo } from "mongoose";

const complaintSchema = new mongoose.Schema({

    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    title : {
        type :String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    photo : {
        type : String
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

    status : {
        type : String,
        enum : ["received","in_review","resolved"],
        default : "received"
    }

},
    {timestamps : {createdAt : "created_at",updatedAt : "updated_at"}}
)

module.exports = mongoose.model("Complaint",complaintSchema)
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
        },
        mobile : {
            type : String,
            match : [/^[0-9]{10}$/, "Mobile Number must be exactly 10 digits"],
        },

        password: {
            type: String,
            require: true,
        },
        state:{
            type:String,
        },
        location: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["user", "volunteer", "admin"],
            default: "user",
        },
        mobile: {
            type: String,
            default: null,
        },
        profilePhoto : {
            type : String
        },
        bio : {
            type : String
        }

    },
    { timestamps: true }
)

const Users = mongoose.model("User", userSchema);
export default Users
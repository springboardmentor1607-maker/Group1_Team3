import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            require : true,
            trim : true,
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
        },

        password : {
            type : String,
            require : true,
        },
        location : {
            type : String,
            default : null,
        },
        role : {
            type : String,
            enum : ["user","volunteer","admin"],
            default : "user",
        },
        profilePhoto : {
            type : String
        }

    },
    {timestamps : true}
)

const Users = mongoose.model("User",userSchema);
export default Users
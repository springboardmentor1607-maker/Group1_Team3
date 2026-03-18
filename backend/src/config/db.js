import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connect successfully...");
    } catch (error) {
        console.error("DB connection fail",error);
        process.exit(1);
    }
};
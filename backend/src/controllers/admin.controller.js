import mongoose from "mongoose";
import Users from "../models/user.model.js"
import Complaint from "../models/complaint.model.js";


export const getAllVolunteers = async (req,res)=>{
    try{

        const volunteers = await Users.find({role : "volunteer"}).select("-password").sort({created : -1});

        res.status(200).json({
            success: true,
            count : volunteers.length,
            volunteers
        })

    } catch(error){
        res.status(500).json({
            success : false,
            message : "error fetching details..",
            error : error.message
        })
    }
}


export const assignComplaints = async (req,res)=>{
    try {
        
        const { id } = req.params;
        const { volunteerId } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({ message : "Invalid Complaint Id"});
        }

        if(!mongoose.Types.ObjectId.isValid(volunteerId)){
            return res.status(400).json({message : "Invalid Volunteer Id"});
        }

        const complaint = await Complaint.findById(id);

        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found"});
        }

        complaint.assigned_to = volunteerId;
        complaint.status = "assigned";
        complaint.updated_at = new Date();

        await complaint.save();

        const populated = await Complaint.findById(id).populate("assigned_to", "name email");

        

        return res.status(200).json({
            message : "complaint assign successfully",
            complaint : populated
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({message : "Server Error"});
    }
}
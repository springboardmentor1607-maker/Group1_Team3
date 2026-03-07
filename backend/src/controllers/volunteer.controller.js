import Complaint from "../models/complaint.model.js"

export const getVolunteerComplaints = async (req,res)=>{
    try {
        const volunteerId = req.user.id;
        const status = req.query.status;

        const filter = {
            assigned_to : volunteerId
        };

        if(status){
            filter.status = status;
        }

        const complaints = await Complaint.find(filter).populate("user_id","name email").sort({created_at : -1});

        res.status(200).json({
            success : true,
            count: complaints.length,
            complaints
        })

    } catch (error) {

        res.status(500).json({
            success : false,
            message : "Error fetching complaints",
            error : error.message
        })
        
    }
}


export const updateComplaintStatus = async (req,res)=>{
    try {
        const volunteerId = req.user.id;
        const complaintId = req.params.id;
        const { status } = req.body;

        const allowedStatus = ["in_progress","resolved"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                success : false,
                message : "invalid status value"
            })
        }

        const complaint = await Complaint.findOne({
            _id : complaintId,
            assigned_to : volunteerId
        });

        if(!complaint){
            return res.status(404).json({
                success : false,
                message : "Complaint not found or not assigned to you"
            })
        }

        if(complaint.status === "resolved"){
            return res.status(400).json({
                success : false,
                message : "Resolve complaints cannot be updated"
            })
        }

        if(complaint.status === "assigned" && status !== "in_progress"){
            return res.status(400).json({
                success : false,
                message : "Status must change from assigned to in_progress first"
            })
        }

        if(complaint.status === "in_progress" && status !== "resolved"){
            return res.status(400).json({
                success : false,
                message : "Status must change from in_progress to resolved"
            })
        }

        complaint.status = status;
        await complaint.save();

        res.status(200).json({
            success : true,
            message : "Complaint Status updated successfully",
            complaint
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Failed to update complaint status",
            error : error.message
        })
        
    }
}
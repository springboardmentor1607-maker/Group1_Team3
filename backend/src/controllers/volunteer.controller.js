import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js"
import mongoose from "mongoose";

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


export const updateComplaintStatus = async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const complaintId = req.params.id;
    const { status, remarks } = req.body;

    const allowedStatus = ["in_progress", "resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const complaint = await Complaint.findOne({
      _id: complaintId,
      assigned_to: volunteerId,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found or not assigned to you",
      });
    }

    if (complaint.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Resolved complaint cannot be updated",
      });
    }

    // Flow validation
    if (complaint.status === "assigned" && status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Status must change from assigned to in_progress first",
      });
    }

    if (complaint.status === "in_progress" && status !== "resolved") {
      return res.status(400).json({
        success: false,
        message: "Status must change from in_progress to resolved",
      });
    }

    // ✅ Update status
    complaint.status = status;

    // ✅ When resolving → require remark + proof
    if (status === "resolved") {
      if (!remarks) {
        return res.status(400).json({
          success: false,
          message: "Remarks are required when resolving a complaint",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Proof image is required when resolving a complaint",
        });
      }

      // ✅ Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "complaint_proofs" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // ✅ Save data
      complaint.resolvedRemarks = remarks;
      complaint.resolvedProofImages = uploadResult.secure_url;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
};

export const getVolunteerDashboardStats = async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      assignedCount,
      inProgressCount,
      resolvedCount,
      resolvedToday
    ] = await Promise.all([
      Complaint.countDocuments({
        assigned_to: volunteerId,
        status: "assigned"
      }),

      Complaint.countDocuments({
        assigned_to: volunteerId,
        status: "in_progress"
      }),

      Complaint.countDocuments({
        assigned_to: volunteerId,
        status: "resolved"
      }),

      Complaint.countDocuments({
        assigned_to: volunteerId,
        status: "resolved",
        updated_at: { $gte: startOfToday }
      })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        assigned: assignedCount,
        in_progress: inProgressCount,
        resolved: resolvedCount,
        resolved_today: resolvedToday
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message
    });
  }
};



export const getWeeklyResolvedStats = async (req, res) => {
  try {
    const volunteerId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Complaint.aggregate([
      {
        $match: {
          assigned_to: volunteerId,
          status: "resolved",
          updated_at: { $exists: true } 
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%U",
              date: "$updated_at"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


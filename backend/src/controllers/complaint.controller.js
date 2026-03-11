import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js";
import streamifier from "streamifier";


// Create a new complaint
export const createComplaint = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            title,
            issueType,
            priority,
            description,
            address,
            landmark,
            latitude,
            longitude
        } = req.body;

        let imageUrls = [];

        if (req.files && req.files.length > 0) {

            const cloudinaryConfig = cloudinary.config();

            if (!cloudinaryConfig.api_key || !cloudinaryConfig.api_secret || !cloudinaryConfig.cloud_name) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload configuration missing"
                });
            }

            for (let file of req.files) {

                const uploadFromBuffer = () =>
                    new Promise((resolve, reject) => {

                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "complaints" },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );

                        streamifier.createReadStream(file.buffer).pipe(stream);

                    });

                const result = await uploadFromBuffer();

                imageUrls.push(result.secure_url);
            }
        }


        if (!title || !description || !issueType) {
            return res.status(400).json({
                success: false,
                message: "Title, issue type and description required"
            });
        }


        const newComplaint = new Complaint({
            user_id: userId,
            title,
            issueType,
            priority: priority || "medium",
            description,
            landmark: landmark || "",
            location_coords: {
                lat: latitude ? parseFloat(latitude) : null,
                lng: longitude ? parseFloat(longitude) : null
            },
            address: address || "",
            images: imageUrls
        });


        await newComplaint.save();


        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: newComplaint
        });

    } catch (error) {

        console.error("Error creating complaint:", error);

        res.status(500).json({
            success: false,
            message: "Error submitting complaint",
            error: error.message
        });

    }
};



// Get user complaints
export const getUserComplaints = async (req, res) => {
    try {

        const userId = req.user.id;

        const complaints = await Complaint
            .find({ user_id: userId })
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });

    }
};



// Get all complaints (Admin)
export const getAllComplaints = async (req, res) => {

    try {

        const role = req.user.role;
        const userId = req.user.id;

        let complaints;

        // Volunteer → only assigned complaints
        if (role === "volunteer") {

            complaints = await Complaint
                .find({ assigned_to: userId })
                .populate("user_id", "name email")
                .populate("assigned_to", "name email")
                .sort({ created_at: -1 });

        }

        // Admin + normal user → all complaints
        else {

            complaints = await Complaint
                .find()
                .populate("user_id", "name email")
                .populate("assigned_to", "name email")
                .sort({ created_at: -1 });

        }

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });

    }
};

// Get complaint by id
export const getComplaintById = async (req, res) => {
    try {

        const { id } = req.params;

        const complaint = await Complaint
            .findById(id)
            .populate("user_id", "name email")
            .populate("assigned_to", "name email");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching complaint",
            error: error.message
        });

    }
};



// Update complaint
export const updateComplaintStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status, assigned_to } = req.body;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (status) {
            complaint.status = status;
        }

        if (assigned_to) {
            complaint.assigned_to = assigned_to;
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error updating complaint",
            error: error.message
        });

    }
};



// Delete complaint
export const deleteComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const complaint = await Complaint.findByIdAndDelete(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error deleting complaint",
            error: error.message
        });

    }
};



// ========================
// Voting System (Milestone 3)
// ========================

export const upvoteComplaint = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.user.id;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // initialize arrays if undefined
    if (!complaint.upvotes) complaint.upvotes = [];
    if (!complaint.downvotes) complaint.downvotes = [];

    // remove from downvotes
    complaint.downvotes = complaint.downvotes.filter(
      vote => vote.toString() !== userId
    );

    // toggle upvote
    const alreadyUpvoted = complaint.upvotes.some(
      vote => vote.toString() === userId
    );

    if (alreadyUpvoted) {
      complaint.upvotes = complaint.upvotes.filter(
        vote => vote.toString() !== userId
      );
    } else {
      complaint.upvotes.push(userId);
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint
    });

  } catch (error) {

    console.error("UPVOTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const downvoteComplaint = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.user.id;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    if (!complaint.upvotes) complaint.upvotes = [];
    if (!complaint.downvotes) complaint.downvotes = [];

    // remove from upvotes
    complaint.upvotes = complaint.upvotes.filter(
      vote => vote.toString() !== userId
    );

    // toggle downvote
    const alreadyDownvoted = complaint.downvotes.some(
      vote => vote.toString() === userId
    );

    if (alreadyDownvoted) {
      complaint.downvotes = complaint.downvotes.filter(
        vote => vote.toString() !== userId
      );
    } else {
      complaint.downvotes.push(userId);
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint
    });

  } catch (error) {

    console.error("DOWNVOTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


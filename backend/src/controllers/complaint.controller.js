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

        const complaints = await Complaint
            .find()
            .populate("user_id", "name email")
            .populate("assigned_to", "name email")
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


// Upvote complaint
export const upvoteComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        complaint.upvotes += 1;

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint upvoted successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error upvoting complaint",
            error: error.message
        });

    }
};



// Downvote complaint
export const downvoteComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        complaint.downvotes += 1;

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint downvoted successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error downvoting complaint",
            error: error.message
        });

    }
};
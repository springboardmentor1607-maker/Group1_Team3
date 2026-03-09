import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js";
import streamifier from 'streamifier'


// Create a new complaint
export const createComplaint = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from auth middleware
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

        //handling image data...

        let imageUrls = [];
        if(req.files && req.files.length > 0){
            const cloudinaryConfig = cloudinary.config();
            if (!cloudinaryConfig.api_key || !cloudinaryConfig.api_secret || !cloudinaryConfig.cloud_name) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload configuration is missing on server",
                    error: "Cloudinary env vars are not set"
                });
            }
            for(let file of req.files){
                const uploadFromBuffer = () => new Promise((resolve,reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {folder : "complaints"},
                        (error, result) =>{
                            if(result) resolve(result);
                            else reject(error);
                        }
                    )
                    streamifier.createReadStream(file.buffer).pipe(stream)
                });

                const result = await uploadFromBuffer();
                imageUrls.push(result.secure_url);
            }
        }

        // Validate required fields
        if (!title || !description || !issueType) {
            return res.status(400).json({
                success: false,
                message: "Title, issue type, and description are required"
            });
        }

        // Validate issueType
        const validIssueTypes = ["pothole", "garbage", "streetlight", "water_leak", "other"];
        if (!validIssueTypes.includes(issueType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue type"
            });
        }

        // Create new complaint
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
            images : imageUrls
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

// Get all complaints for a user
export const getUserComplaints = async (req, res) => {
    try {
        const userId = req.user.id;

        const complaints = await Complaint.find({ user_id: userId })
            .sort({ created_at: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Error fetching complaints:", error);
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
        const complaints = await Complaint.find()
            .populate("user_id", "name email")
            .populate("assigned_to", "name email")
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Error fetching all complaints:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });
    }
};

// Get single complaint by ID
export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findById(id)
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
        console.error("Error fetching complaint:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaint",
            error: error.message
        });
    }
};

// Update complaint status (Admin)
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
            if (!["received", "in_review", "resolved"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value"
                });
            }
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
        console.error("Error updating complaint:", error);
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
        console.error("Error deleting complaint:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting complaint",
            error: error.message
        });
    }
};

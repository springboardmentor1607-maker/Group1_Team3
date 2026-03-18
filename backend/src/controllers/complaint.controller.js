import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/complaint.model.js";
import Notification from "../models/notification.model.js";
import streamifier from "streamifier";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user:process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP CONNECTION SUCCESSFUL");
  }
});

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
      longitude,
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const cloudinaryConfig = cloudinary.config();

      if (
        !cloudinaryConfig.api_key ||
        !cloudinaryConfig.api_secret ||
        !cloudinaryConfig.cloud_name
      ) {
        return res.status(500).json({
          success: false,
          message: "Image upload configuration missing",
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
              },
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
        message: "Title, issue type and description required",
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
        lng: longitude ? parseFloat(longitude) : null,
      },
      address: address || "",
      images: imageUrls,
    });

    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);

    res.status(500).json({
      success: false,
      message: "Error submitting complaint",
      error: error.message,
    });
  }
};

// Get user complaints
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const complaints = await Complaint.find({ user_id: userId }).sort({
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
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
      complaints = await Complaint.find({ assigned_to: userId })
        .populate("user_id", "name email")
        .populate("assigned_to", "name email")
        .sort({ created_at: -1 });
    }

    // Admin + normal user → all complaints
    else {
      complaints = await Complaint.find()
        .populate("user_id", "name email")
        .populate("assigned_to", "name email")
        .sort({ created_at: -1 });
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

// Get complaint by id
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("user_id", "name email")
      .populate("assigned_to", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching complaint",
      error: error.message,
    });
  }
};

// Update complaint
export const updateComplaintStatus = async (req, res) => {
  console.log(" API HIT");
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const complaint = await Complaint.findById(id).populate({
      path: "user_id",
      select: "name email",
    });
    console.log("USER DATA:", complaint.user_id);
    console.log("USER EMAIL:", complaint.user_id?.email);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (assigned_to) {
      complaint.assigned_to = assigned_to;
    }

    await complaint.save();
    console.log("API HIT");
    if (!complaint.user_id || !complaint.user_id.email) {
      console.log("No user email found");
    } else {
      console.log("Sending email to:", complaint.user_id.email);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: complaint.user_id.email,
        subject: "Complaint Update",

        html: `<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:20px;">
        <h2 style="color:#2c3e50; text-align:center;">
          🚨 Complaint Update
          </h2>
          <p>Hello <b>${complaint.user_id.name}</b>,</p>
          <p>Your complaint has been updated. Here are the details:</p>
          <div style="background:#f9f9f9; padding:15px; border-radius:8px;">
          <p><b>📝 Title:</b> ${complaint.title}</p>
          <p><b>📍 Location:</b> ${complaint.address}</p>
          <p>
          <b>📊 Status:</b> 
            <span style="
              padding:5px 10px;
              border-radius:5px;
              background:${
                complaint.status === "resolved"
                  ? "#d4edda"
                  : complaint.status === "in_progress"
                    ? "#fff3cd"
                    : "#d1ecf1"
              };
              color:${
                complaint.status === "resolved"
                  ? "#155724"
                  : complaint.status === "in_progress"
                    ? "#856404"
                    : "#0c5460"
              };
            ">
              ${complaint.status}
            </span>
          </p>
        </div>

        <div style="text-align:center; margin-top:20px;">
          <a href="http://localhost:5173"
             style="
               background:#007bff;
               color:#ffffff;
               padding:10px 20px;
               text-decoration:none;
               border-radius:5px;
               display:inline-block;
             ">
             View Complaint
          </a>
        </div>

        <hr style="margin:20px 0;" />

        <p style="font-size:12px; color:gray; text-align:center;">
          Thank you for using Civic Issue Platform 🙌
        </p>

      </div>
    </div>
  `,
      });
      console.log("email sent sucessfully");
    }
    if (assigned_to) {
      await Notification.create({
        user_id: complaint.user_id,
        complaint_id: complaint._id,
        message: "A volunteer has been assigned to your complaint.",
      });
    }
    if (status === "resolved") {
      await Notification.create({
        user_id: complaint.user_id,
        complaint_id: complaint._id,
        message: "Your complaint has been resolved.",
      });
    }
    if (status && status !== "resolved") {
      await Notification.create({
        user_id: complaint.user_id,
        complaint_id: complaint._id,
        message: "Your complaint status has been updated.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating complaint",
      error: error.message,
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
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting complaint",
      error: error.message,
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
        message: "Complaint not found",
      });
    }

    // initialize arrays if undefined
    if (!complaint.upvotes) complaint.upvotes = [];
    if (!complaint.downvotes) complaint.downvotes = [];

    // remove from downvotes
    complaint.downvotes = complaint.downvotes.filter(
      (vote) => vote.toString() !== userId,
    );

    // toggle upvote
    const alreadyUpvoted = complaint.upvotes.some(
      (vote) => vote.toString() === userId,
    );

    if (alreadyUpvoted) {
      complaint.upvotes = complaint.upvotes.filter(
        (vote) => vote.toString() !== userId,
      );
    } else {
      complaint.upvotes.push(userId);
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("UPVOTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Complaint not found",
      });
    }

    if (!complaint.upvotes) complaint.upvotes = [];
    if (!complaint.downvotes) complaint.downvotes = [];

    // remove from upvotes
    complaint.upvotes = complaint.upvotes.filter(
      (vote) => vote.toString() !== userId,
    );

    // toggle downvote
    const alreadyDownvoted = complaint.downvotes.some(
      (vote) => vote.toString() === userId,
    );

    if (alreadyDownvoted) {
      complaint.downvotes = complaint.downvotes.filter(
        (vote) => vote.toString() !== userId,
      );
    } else {
      complaint.downvotes.push(userId);
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("DOWNVOTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const testEmail = async (req, res) => {
  try {
    console.log("🔥 TEST EMAIL API HIT");

    const info = await transporter.sendMail({
      from: "venkatasaideepthi3@gmail.com",
      to: "venkatasaideepthi3@gmail.com",
      subject: "TEST MAIL",
      text: "This is test email",
    });

    console.log("✅ EMAIL SENT:", info);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ EMAIL ERROR FULL:", err);
    res.json({ success: false, error: err.message });
  }
};

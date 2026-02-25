import express from 'express';
import {
    createComplaint,
    getUserComplaints,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint
} from '../controllers/complaint.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// User routes
router.post("/create", verifyToken, createComplaint);
router.get("/my-complaints", verifyToken, getUserComplaints);
router.get("/:id", verifyToken, getComplaintById);

// Admin routes
router.get("/", verifyToken, authorizeRoles("admin"), getAllComplaints);
router.patch("/:id/status", verifyToken, authorizeRoles("admin"), updateComplaintStatus);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteComplaint);

export default router;

import express from 'express'
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/roleCheck.middleware.js';
import { getVolunteerComplaints, getVolunteerDashboardStats, getWeeklyResolvedStats, updateComplaintStatus } from '../controllers/volunteer.controller.js';

const router = express.Router();


router.get("/my-complaints",verifyToken,authorizeRoles("volunteer"),getVolunteerComplaints)

router.put("/complaints/:id/status",verifyToken,authorizeRoles("volunteer"),updateComplaintStatus)

router.get("/dashboard-stats",verifyToken,authorizeRoles("volunteer"),getVolunteerDashboardStats)

router.get("/weekly-stats",verifyToken,authorizeRoles("volunteer"),getWeeklyResolvedStats)

export default router
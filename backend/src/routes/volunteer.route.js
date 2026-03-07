import express from 'express'
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/roleCheck.middleware.js';
import { getVolunteerComplaints, updateComplaintStatus } from '../controllers/volunteer.controller.js';

const router = express.Router();


router.get("/my-complaints",verifyToken,authorizeRoles("volunteer"),getVolunteerComplaints)

router.put("/complaints/:id/status",verifyToken,authorizeRoles("volunteer"),updateComplaintStatus)

export default router
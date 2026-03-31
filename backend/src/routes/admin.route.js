import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/roleCheck.middleware.js"
import { getAllComplaints } from "../controllers/complaint.controller.js"
import { assignComplaints, getAllResolvedComplaints, getAllVolunteers } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/complaints",verifyToken,authorizeRoles("admin"),getAllComplaints)
router.get("/volunteers",verifyToken,authorizeRoles("admin"),getAllVolunteers)
router.put("/:id/assign",verifyToken,authorizeRoles("admin"),assignComplaints)
router.get("/complaints/resolved",verifyToken,authorizeRoles("admin"),getAllResolvedComplaints);
export default router
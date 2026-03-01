import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/roleCheck.middleware.js"
import { getAllComplaints } from "../controllers/complaint.controller.js"
import { getAllVolunteers } from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/complaints",verifyToken,authorizeRoles("admin"),getAllComplaints)
router.get("/volunteers",verifyToken,authorizeRoles("admin"),getAllVolunteers)
export default router
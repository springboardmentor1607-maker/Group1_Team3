import express from 'express'
import { getUser, updateProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/details",verifyToken,getUser);
router.patch("/edit",verifyToken,updateProfile)

export default router;
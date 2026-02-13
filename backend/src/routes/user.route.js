import express from 'express'
import { getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/details",verifyToken,getUser);

export default router;
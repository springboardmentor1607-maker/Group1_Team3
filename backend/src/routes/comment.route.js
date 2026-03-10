import express from "express";
import { addComment, getComments } from "../controllers/comment.controller.js";
import { verifyToken} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id/comment", verifyToken, addComment);
router.get("/:id/comments", verifyToken, getComments);

export default router;
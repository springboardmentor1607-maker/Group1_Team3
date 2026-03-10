import Comment from "../models/comment.model.js";


// Add comment
export const addComment = async (req, res) => {

    try {

        const { id } = req.params;
        const { text } = req.body;

        const comment = new Comment({
            complaint_id: id,
            user_id: req.user.id,
            text
        });

        await comment.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });

    }

};


// Get comments for complaint
export const getComments = async (req, res) => {

    try {

        const { id } = req.params;

        const comments = await Comment
        .find({ complaint_id: id })
        .populate("user_id","name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching comments",
            error: error.message
        });

    }

};
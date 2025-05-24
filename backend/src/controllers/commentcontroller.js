import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
//create comment display comment 
export const addComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;
        const { content } = req.body;
        console.log(postId);
        console.log(content);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const newComment = new Comment({
            post: postId,
            user: userId,
            content,
        });
        await newComment.save();
        return res.status(201).json({ message: "Comment added", comment: newComment });
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }



}



export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate("user", "username profilePicture") // populate user info (only needed fields)
            .sort({ createdAt: 1 }); // oldest first, change to -1 for newest first

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Get comments error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this comment" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

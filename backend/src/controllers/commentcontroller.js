import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
import { io } from "../socket.js"
//create comment display comment 
export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { content } = req.body;

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

    // Update comment count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentCount: 1 } },
      { new: true }
    );

    // ✅ Emit the comment to all clients
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "username profilePicture");

    io.emit("sendComment", {
      comment: populatedComment,
      postId,
      commentCount: updatedPost.commentCount,
    });

    return res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
      commentCount: updatedPost.commentCount,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username profilePicture") // populate user info (only needed fields)
      .sort({ createdAt: -1 }); // oldest first, change to -1 for newest first

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
    const updatedPost = await Post.findByIdAndUpdate(
      comment.post,
      { $inc: { commentCount: -1 } },
      { new: true }
    );
    res.status(200).json({ message: "Comment deleted", commentCount: updatedPost.commentCount });
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

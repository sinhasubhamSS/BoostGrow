import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";
import { io } from "../socket.js";
export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const existingLike = await Like.findOneAndDelete({ post: postId, user: userId });

        let likeCountChange = 0;

        if (existingLike) {
            likeCountChange = -1;
        } else {
            await Like.create({ post: postId, user: userId });
            likeCountChange = 1;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likeCount: likeCountChange } },
            { new: true }
        ).select("likeCount");


        io.emit("likePost", {
            postId,
            likeCount: updatedPost.likeCount,
        });

        res.status(200).json({
            success: true,
            liked: !existingLike,
            likeCount: updatedPost.likeCount,
            postId
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const getLikeStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const like = await Like.findOne({ post: postId, user: userId });

        res.status(200).json({
            success: true,
            liked: !!like,
        });
    } catch (error) {
        console.error("Error getting like status:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";

// export const toggleLike = async (req,res) => {
//     try {
//         const userId = req.user._id;
//         const { postId } = req.params;
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: "post not found" });
//         }
//         //check karo ki loggedinuser pahla sa like kiya hua hai kya 
//         const existingLike = await Like.findOne({ post: postId, user: userId })
//         if (existingLike) {
//             await existingLike.deleteOne();
//             const likeCount = await Like.countDocuments({ post: postId })
//             return res.status(200).json({
//                 liked: false,
//                 likeCount,
//                 message: "Post unliked",
//             });
//         }
//         else {
//             const newLike = new Like({ post: postId, user: userId })
//             await newLike.save()
//             const likeCount = await Like.countDocuments({ post: postId });
//             return res.status(201).json({
//                 liked: true,
//                 likeCount,
//                 message: "Post liked",
//             });
//         }

//     } catch (error) {
//         console.error("Toggle like error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });

//     }
// }
export const toggleLike = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.params;

        // पहले existingLike चेक करें
        const existingLike = await Like.findOne({ post: postId, user: userId });

        // Like status के आधार पर increment/decrement तय करें
        const incrementValue = existingLike ? -1 : 1;

        // Post को अपडेट करें
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: incrementValue } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (existingLike) {
            await existingLike.deleteOne();
            return res.status(200).json({
                liked: false,
                likeCount: post.likes,
                message: "Post unliked",
            });
        } else {
            const newLike = new Like({ post: postId, user: userId });
            await newLike.save();
            return res.status(201).json({
                liked: true,
                likeCount: post.likes,
                message: "Post liked",
            });
        }
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
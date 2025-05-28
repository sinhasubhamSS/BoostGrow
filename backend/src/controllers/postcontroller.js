import { Post } from "../models/post.models.js";
import { uploadOnCloudinary } from "../specific/cloudinary.js";

import { User } from "../models/user.models.js";
const addpost = async (req, res) => {
    try {
        console.log("reached ad post");
        const userId = req.user._id;
        const { content, visibility } = req.body;

        const imagePath = req.files?.postImage?.[0]?.path;

        const trimmedContent = typeof content === "string" ? content.trim() : "";

        if (!trimmedContent && !imagePath) {
            return res.status(400).json({
                message: "Either content or image is required to create post"
            });
        }

        let imageUrl = null;

        if (imagePath) {
            const uploadResult = await uploadOnCloudinary(imagePath, "postImage");
            if (!uploadResult || !uploadResult.secure_url) {
                return res.status(400).json({ message: "Image upload failed" });
            }
            imageUrl = uploadResult.secure_url;
        }

        const newPost = new Post({
            author: userId,
            content: trimmedContent || null,
            image: imageUrl,
            visibility: visibility || "public",
            likeCount: 0,
            commentCount: 0
        });

        await newPost.save();
        await newPost.populate("author", "username profilePicture");
        res.status(200).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const editPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { content, visibility } = req.body;
        console.log(content);
        const postId = req.params._id;
        console.log(postId);
        const imagePath = req.files?.postImage?.[0]?.path;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "you cannot edit others post"
            })
        }


        if (content !== undefined) post.content = content.trim();
        if (visibility !== undefined) post.visibility = visibility
        if (imagePath) {
            const uploadResult = await uploadOnCloudinary(imagePath, "postImages");
            if (!uploadResult || !uploadResult.secure_url) {
                return res.status(400).json({ message: "Image upload failed" });
            }
            post.image = uploadResult.secure_url;
        }
        await post.save();

        return res.status(200).json({ message: "successfully edited post", post })
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const userRole = req.user.role; // assume role is stored in user object

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const getMyPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit//pahla wala ko skip kartahai agar kou page 5 ma hai to 5-1=4*10=40pahla ka 40 ko skip kar daga
        const totalPosts = await Post.countDocuments({ author: userId })
        const totalPages = Math.ceil(totalPosts / limit);
        // Find posts by this user, sorted latest first
        const posts = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "User posts fetched successfully",
            posts,
            pagination: {
                totalPosts,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const getHomefeed = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("following");
        const followingUserIds = user.following

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const matchStage = {
            $match: {
                $or: [
                    // public account, public post
                    {
                        $and: [
                            { "author.privacy": "public" },
                            { visibility: "public" }
                        ]
                    },
                    // private account, any post visible to followers
                    {
                        $and: [
                            { "author.privacy": "private" },
                            { "author._id": { $in: followingUserIds } }
                        ]
                    },
                    // public account, private post visible to followers
                    {
                        $and: [
                            { "author.privacy": "public" },
                            { visibility: "private" },
                            { "author._id": { $in: followingUserIds } }
                        ]
                    }
                ]
            }
        };

        const postsAggregation = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    content: 1,
                    image: 1,
                    visibility: 1,
                    likeCount: 1,
                    commentCount: 1,
                    createdAt: 1,
                    author: {
                        _id: 1,
                        username: 1,
                        profilePicture: 1,
                        privacy: 1
                    }
                }
            }
        ]);

        // totalPosts count (same match logic)
        const totalCountAggregation = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            matchStage,
            { $count: "total" }
        ]);

        const totalPosts = totalCountAggregation[0]?.total || 0;

        res.status(200).json({
            message: "home feed posts fetched",
            posts: postsAggregation,
            pagination: {
                totalPosts,
                page,
                totalPages: Math.ceil(totalPosts / limit)
            }
        });
    } catch (error) {
        console.error("Error in getHomefeed:", error);
        res.status(500).json({ message: "Something went wrong in home feed" });
    }
};
const getOthersUserPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { targetUserId } = req.params
        const targetUser = await User.findById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({ message: "user not found" })

        }
        const isFollowing = targetUser.followers.includes(userId);


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit

        //if following the private account then can see the public as well as private posts of user
        const visibilityFilter = isFollowing ? ["public", "private"] : ["public"]
        const totalPosts = await Post.countDocuments(
            {
                author: targetUserId,
                visibility: { $in: visibilityFilter }
            }
        );
        const posts = await Post.find({
            author: targetUserId,
            visibility: { $in: visibilityFilter }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "username profilePicture privacy")
        res.status(200).json({
            message: "User's posts fetched successfully",
            posts,
            pagination: {
                totalPosts,
                page,
                totalPages: Math.ceil(totalPosts / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
            .populate("author", "username profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // अगर visibility private है तो सिर्फ author या उसके follower ही देख सकें
        if (post.visibility === "private") {
            const userId = req.user._id;
            const user = await User.findById(post.author._id);

            const isAuthor = post.author._id.toString() === userId.toString();
            const isFollower = user.followers.includes(userId);

            if (!isAuthor && !isFollower) {
                return res.status(403).json({ message: "Not authorized to view this post" });
            }
        }

        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.error("Error fetching single post:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { getOthersUserPosts, getSinglePost, getHomefeed, getMyPosts, addpost, editPost, deletePost }










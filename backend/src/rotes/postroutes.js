import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authverify } from "../middlewares/auth.middleware.js";
import {
    addpost,
    editPost,
    deletePost,
    getMyPosts,
    getHomefeed,
    getOthersUserPosts,
    getSinglePost,
} from "../controllers/postcontroller.js";

const router = Router();
router.post(
    "/addpost",
    authverify,
    upload.fields([{ name: "postImage" }]),
    addpost
)
// Edit a post
router.put(
    "/editpost/:_id",
    authverify,
    upload.fields([{ name: "postImage" }]),
    editPost
);

// Delete a post
router.delete("/deletepost/:id", authverify, deletePost);

// Get posts created by the logged-in user
router.get("/my-posts", authverify, getMyPosts);

// Get home feed (public + following's private posts)
router.get("/home-feed", authverify, getHomefeed);

// Get another user's posts
router.get("/otheruserpost/:targetUserId", authverify, getOthersUserPosts);

// Get single post by ID
router.get("/selectedpost/:id", authverify, getSinglePost);

export default router;

import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/likecontroller.js";
import { addComment, getComments } from "../controllers/commentcontroller.js";

const router = Router();
router.post("/like/:postId", authverify, toggleLike);
router.post("/comment/:postId", authverify, addComment);
router.get("/get-comments/:postId", authverify, getComments)
export default router
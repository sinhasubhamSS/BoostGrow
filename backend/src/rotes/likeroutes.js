import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import { getLikeStatus, toggleLike } from "../controllers/likecontroller.js";

const router = Router();
router.post("/like/:postId", authverify, toggleLike)
router.get("/like/:postId", authverify, getLikeStatus);
export default router
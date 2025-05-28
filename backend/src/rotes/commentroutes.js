import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import { addComment, getComments } from "../controllers/commentcontroller.js";


const router=Router();
router.post("/addcomment/:postId",authverify,addComment)
router.get("/getcomment/:postId",authverify,getComments)
export default router
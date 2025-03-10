import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/chatcontroller.js";

const router = Router();
router.route("/send").post(authverify,sendMessage)
router.route("/receive/:otherUserId").get(authverify,getMessage)
export default router;
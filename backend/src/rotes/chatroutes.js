import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import { getChatUsers, getMessage, sendMessage } from "../controllers/chatcontroller.js";
import { checkprofilemode } from "../middlewares/checkprofilemode.js";

const router = Router();
router.route("/send").post(authverify, checkprofilemode, sendMessage)
router.route("/receive/:otherUserId").get(authverify, getMessage)
// router.route("/chatusers").get(authverify, getChatUsers)
router.route("/chatusers").get(authverify, getChatUsers);
export default router;
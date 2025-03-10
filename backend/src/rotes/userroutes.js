import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { changePassword, getAllUser, getCurrentUser, login, logout, promoteUser, reaccesstoken, register, softdelete, updateuserprofile } from "../controllers/registeruser.js";
import { authverify } from "../middlewares/auth.middleware.js";
import { admincheck } from "../middlewares/role.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]), register);
router.route("/login").post(login);
router.route("/logout").post(authverify, logout);
router.route("/refresh-token").get(reaccesstoken)
router.route("/getcurrentuser").get(authverify, getCurrentUser);
router.route("/getotheruser").get(authverify, getAllUser);
router.route("/changepassword").post(authverify, changePassword);
router.route("/updateprofile").put(authverify,
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]), updateuserprofile);
router.route("/promoteuser").post(authverify, admincheck, promoteUser);
router.route("/softdelete").patch(authverify, softdelete)

export default router


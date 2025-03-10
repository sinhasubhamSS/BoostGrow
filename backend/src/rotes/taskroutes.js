import { Router } from "express";
import { authverify } from "../middlewares/auth.middleware.js";
import {task,deletetask,updatetask,getalltask}  from "../controllers/taskcontroller.js";

const router = Router();
router.route("/newtask").post(authverify, task)
router.route("/deletetask/:taskId").delete(authverify, deletetask)
router.route("/updatetask/:taskId").put(authverify,updatetask)
router.route("/getalltask").get(authverify,getalltask)
export default router;
import { Router } from "express";

import { acceptFollowRequest, cancelFollowRequest, followUser, getFollowerAndFollowing, getFriendList, getMutualFriends, rejectFriendRequest, searchUsers, unfollowUser, checkFollowStatus } from "../controllers/friendcontroller.js";
import { authverify } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/follow/:userIdToFollow").post(authverify, followUser)
router.route("/unfollow").delete(authverify, unfollowUser)
router.route("/accept-friend-request").post(authverify, acceptFollowRequest)
router.route("/reject-friend-request").delete(authverify, rejectFriendRequest)
router.route("/friendlist").get(authverify, getFriendList)
router.route("/cancel-follow-request").delete(authverify, cancelFollowRequest)
router.route("/mutual-friends").get(authverify, getMutualFriends)
router.route("/search-user").get(authverify, searchUsers)
router.route("/follow-status").get(authverify, checkFollowStatus)
router.route("/follower-followiing").get(authverify, getFollowerAndFollowing)


export default router
import { Router } from "express";

import { acceptFollowRequest, cancelFollowRequest, followUser, getFollowerAndFollowing, getFriendList, getMutualFriends, rejectFriendRequest, searchUsers, unfollowUser, checkFollowStatus, getFollowRequests } from "../controllers/friendcontroller.js";
import { authverify } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/follow/:userIdToFollow").post(authverify, followUser)
router.route("/unfollow/:userIdToUnfollow").delete(authverify, unfollowUser)
router.route("/accept-friend-request/:requestId").post(authverify, acceptFollowRequest)
router.route("/reject-friend-request/:requestId").delete(authverify, rejectFriendRequest)
router.route("/friendlist").get(authverify, getFriendList)
router.route("/cancel-follow-request").delete(authverify, cancelFollowRequest)
router.route("/mutual-friends").get(authverify, getMutualFriends)
router.route("/search-user").get(authverify, searchUsers)
router.route("/follow-status").get(authverify, checkFollowStatus)
router.route("/followerfollowing/:userId").get(authverify, getFollowerAndFollowing)
router.route("/fetchRequests").get(authverify, getFollowRequests)


export default router
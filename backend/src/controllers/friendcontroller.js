
// this controller is for following purpose

import { User } from "../models/user.models.js";
import { io } from "../socket.js";
import mongoose from "mongoose";

// sendFriendRequest (friend request bhejne ke liye)
// acceptFriendRequest (friend request ko accept karne ke liye)
// rejectFriendRequest (friend request ko reject karne ke liye)
// followUser (user ko follow karne ke liye)
// unfollowUser (user ko unfollow karne ke liye)



const followUser = async (req, res) => {
    const loggedInUserId = req.user._id
    const { userIdToFollow } = req.params;
    console.log(loggedInUserId);
    console.log(userIdToFollow);

    try {
        if (loggedInUserId.toString() === userIdToFollow) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const [userToFollow, loggedInUser] = await Promise.all([
            User.findById(userIdToFollow),
            User.findById(loggedInUserId)
        ]);

        if (!userToFollow || !loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyFollowing = userToFollow.followers.includes(loggedInUserId);
        const hasPendingRequest = userToFollow.friendRequests.some(
            req => req.sender.toString() === loggedInUserId
        );

        if (isAlreadyFollowing || hasPendingRequest) {
            return res.status(400).json({
                message: "Already following or request pending!"
            });
        }

        if (userToFollow.privacy === "private") {
            console.log("🔒 Private Account - Sending Follow Request...");
            const requestId = new mongoose.Types.ObjectId();
                 const newRequest = {
                _id: requestId,
                sender: loggedInUserId,
                status: "pending"
            };

            userToFollow.friendRequests.push(newRequest);
            loggedInUser.sentFriendRequests.push({
                _id: requestId,
                receiver: new mongoose.Types.ObjectId(userIdToFollow),
                status: "pending"
            });

            await Promise.all([userToFollow.save(), loggedInUser.save()]);




            io.to(userIdToFollow).emit("friend_request_received", {
                request: {
                    _id: requestId,
                    sender: {
                        _id: req.user._id,
                        username: req.user.username,
                        avatar: req.user.avatar
                    },
                    receiver: userIdToFollow,
                    createdAt: new Date()
                }
            });

            console.log("sent request");

            return res.status(200).json({
                message: "Follow request sent!",
                request: {
                    _id: requestId,
                    status: "pending",
                    sender: { // Use req.user data instead of populating
                        _id: loggedInUserId,
                        username: req.user.username,
                        avatar: req.user.avatar,
                        // Add any other needed fields
                    },
                    receiver: userIdToFollow
                }
            });
        }

        
        loggedInUser.following.push(userIdToFollow);
        userToFollow.followers.push(loggedInUserId);

        await Promise.all([loggedInUser.save(), userToFollow.save()]);

        io.emit("follow", {
            targetUserId: userIdToFollow,
            newFollower: loggedInUserId,
            loggedInUserId: loggedInUserId
        });

        io.emit("update_profile_following", {
            type: "follow",
            profileUserId: loggedInUserId,
            targetUserId: userIdToFollow
        });

        return res.status(200).json({
            message: `Successfully followed ${userToFollow.username}`,
            userId: userIdToFollow
        });

    } catch (error) {
        console.error("❌ Follow user error:", error);
        return res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    }
};


const cancelFollowRequest = async (req, res) => {
    const loggedInUserId = req.user._id;
    const { receiverId } = req.body;
    try {
        const userToCancel = await User.findById(receiverId)
        if (!userToCancel) {
            return res.status(404).json({ message: "cannot find the user" })
        }
        //request ko remove karna 
        userToCancel.friendRequests = userToCancel.friendRequests.filter((req) => req.sender.toString() !== loggedInUserId.toString());
        await userToCancel.save();
        return res.status(200).json({ message: "follow request canceled!" })

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong at else block of cancel follow request!", error });

    }

};
const unfollowUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const loggedInUserId = req.user._id.toString();
    const { userIdToUnfollow } = req.params;

    console.log("📩 Logged In User ID:", loggedInUserId);
    console.log("📩 User ID to Unfollow:", userIdToUnfollow);

    try {
        // 🛑 Self-unfollow check
        if (loggedInUserId === userIdToUnfollow) {
            console.log("🚫 User tried to unfollow themselves");
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        // ✅ Fetch both users
        const userToUnfollow = await User.findById(userIdToUnfollow);
        const loggedInUser = await User.findById(loggedInUserId);

        // 🧪 Check if both users exist
        if (!userToUnfollow || !loggedInUser) {
            console.log("❌ One of the users not found", {
                userToUnfollowExists: !!userToUnfollow,
                loggedInUserExists: !!loggedInUser
            });
            return res.status(404).json({ message: "User not found" });
        }

        // 🧪 Log following list
        console.log("📋 LoggedInUser Following List:", loggedInUser.following.map(id => id.toString()));

        // 🛑 Already not following check (with debug)
        const isFollowing = loggedInUser.following.some(id => id.toString() === userIdToUnfollow);
        console.log("🔍 Is Following:", isFollowing);

        if (!isFollowing) {
            console.log("🚫 User is not following the one they tried to unfollow");
            return res.status(400).json({ message: "You are not following this user" });
        }

        // ✅ Proceed to unfollow
        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userIdToUnfollow);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== loggedInUserId);

        loggedInUser.friends = loggedInUser.friends.filter(id => id.toString() !== userIdToUnfollow);
        userToUnfollow.friends = userToUnfollow.friends.filter(id => id.toString() !== loggedInUserId);

        console.log("✅ Unfollow logic done, saving users...");

        await loggedInUser.save();
        await userToUnfollow.save();
        loggedInUser.sentFriendRequests = loggedInUser.sentFriendRequests.filter(
            req => req.receiver.toString() !== userIdToUnfollow
        );
        userToUnfollow.friendRequests = userToUnfollow.friendRequests.filter(
            req => req.sender.toString() !== loggedInUserId
        );

        await loggedInUser.save({ session });
        await userToUnfollow.save({ session });
        await session.commitTransaction();
        console.log("💾 Changes saved to database");

        // 🔔 Emit event
        io.emit("unfollow", {
            targetUserId: userIdToUnfollow,
            unfollowerId: loggedInUserId,
            loggedInUserId: loggedInUserId // ✅ नई field
        });
        io.emit("update_profile_following", {
            type: "unfollow",
            profileUserId: loggedInUserId,  
            targetUserId: userIdToUnfollow 
        });
        console.log(`✅ Successfully unfollowed ${userToUnfollow.username}`);

        return res.status(200).json({
            message: `Successfully unfollowed ${userToUnfollow.username}`,
            userId: userIdToUnfollow
        });

    } catch (error) {
        console.error("❌ Unfollow user error:", error);
        return res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
};

const acceptFollowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const receiverId = req.user._id;

        // 1. Find the request first
        const receiver = await User.findOne({
            _id: receiverId,
            'friendRequests._id': requestId
        });

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // 2. Extract sender ID before modifying
        const request = receiver.friendRequests.id(requestId);
        if (!request?.sender) {
            return res.status(400).json({
                success: false,
                message: "Invalid request format"
            });
        }
        const senderId = request.sender;

        // 3. Perform updates atomically
        await Promise.all([
            User.updateOne(
                { _id: receiverId },
                {
                    $pull: { friendRequests: { _id: requestId } },
                    $addToSet: { followers: senderId }
                }
            ),
            User.updateOne(
                { _id: senderId },
                {
                    $addToSet: { following: receiverId },
                    $pull: { sentFriendRequests: { receiver: receiverId } }
                }
            )
        ]);
        console.log(senderId);
        console.log(receiverId);
        // Backend (acceptFollowRequest controller)
        io.to(senderId.toString()).emit("request_accepted", {
            targetUserId: receiverId.toString(), // Convert to string
            senderId: senderId.toString(),     // Convert to string
            requestId: requestId.toString()    // Convert to string if it's ObjectId
        });

        io.to(receiverId.toString()).emit("new_follower_added", {
            followerId: senderId.toString()
        });
        console.log("accpt request reached");

        res.status(200).json({
            success: true,
            message: "Request accepted",
            senderId: senderId,
            receiverId: receiverId
        });

    } catch (error) {
        console.error("Accept error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const receiverId = req.user._id;

        console.log("🔍 requestId:", requestId);
        console.log("🔍 receiverId:", receiverId);

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            console.log("❌ Receiver not found");
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }

        console.log("📦 receiver.friendRequests:", receiver.friendRequests);

        const request = receiver.friendRequests.id(requestId);
        if (!request) {
            console.log("❌ Request not found in receiver.friendRequests");
            return res.status(400).json({
                success: false,
                message: "Invalid request format"
            });
        }

        const senderId = request.sender;
        console.log("✅ senderId:", senderId);

        // Pull request from both sides
        receiver.friendRequests.pull({ _id: requestId });
        await receiver.save();

        await User.findByIdAndUpdate(senderId, {
            $pull: { sentFriendRequests: { _id: requestId } }
        });
        io.to(senderId.toString()).emit("request_rejected",{
            requestId,
            receiverId
        })

        return res.status(200).json({
            success: true,
            message: "Request declined",
            requestId
        });

    } catch (error) {
        console.error("❌ Reject friend request error:", error);
        return res.status(500).json({
            success: false,
            message: "Error declining request",
            error: error.message
        });
    }
};

const getFriendList = async (req, res) => {
    const loggedInUserId = req.user._id;
    try {
        const user = await User.findById(loggedInUserId).populate("friends", "name email")
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        return res.status(200).json({ friends: user.friends });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}
//finding mutual friends
const getMutualFriends = async (req, res) => {
    const loggedInUserId = req.user._id;
    const { userId } = req.params;// jiska sath mutual frienddekhan
    try {

        const loggedInUser = await User.findById(loggedInUserId);
        const otherUser = await User.findById(userId)
        if (!loggedInUser || !otherUser) {
            return res.status(404).json({ message: "users not found" })

        }
        //ab mutual friend find karte hai 
        // const mutualFriends = loggedInUser.friends.filter(friendId =>
        //     otherUser.friends.includes(friendId.toString())
        // );

        //the above code hai n square tc so lets try other one
        const otherUserFriendSet = new Set(otherUser.friends);
        const mutualFriends = loggedInUser.friends.filter(friendId => otherUserFriendSet.has(
            friendId.toString()))
        return res.status(200).json({ mutualFriends });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}
const searchUsers = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },

            ]
        })
            .select("username email profilePicture")
            .skip((page - 1) * limit)
            .limit(Number(limit))
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });

    }
}
const getFollowerAndFollowing = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
            .select("followers following friendRequests sentFriendRequests")
            .populate({
                path: "followers following",
                select: "username profilePicture"
            })
            .populate({
                path: "friendRequests.sender",
                select: "username profilePicture"
            })
            .populate({
                path: "sentFriendRequests.receiver",
                select: "username profilePicture"
            });

        if (!user) {
            console.log("no user found");
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ नए सिरे से process करें
        const processedFriendRequests = user.friendRequests
            .filter(request => request.sender !== null) // null sender वाले requests हटाएँ
            .map(request => ({
                _id: request._id,
                sender: request.sender, // sender exists
                status: request.status
            }));

        const processedSentRequests = user.sentFriendRequests
            .filter(request => request.receiver !== null) // null receiver वाले requests हटाएँ
            .map(request => ({
                _id: request._id,
                receiver: request.receiver, // receiver exists
                status: request.status
            }));

        return res.status(200).json({
            followers: user.followers,
            following: user.following,
            friendRequests: processedFriendRequests,
            sentRequests: processedSentRequests
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
};
const checkFollowStatus = async (req, res) => {
    const loggedInUserId = req.user._id;
    const { userId } = req.params; // User to check follow status for

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isFollowing = user.followers.includes(loggedInUserId);

        return res.status(200).json({ isFollowing });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
};

const getFollowRequests = async (req, res) => {
    try {
        console.log("Fetching follow requests for:", req.user._id);

        const user = await User.findById(req.user._id).select('friendRequests sentFriendRequests');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract IDs from requests
        const pendingSenderIds = user.friendRequests.map(req => req.sender);
        const sentReceiverIds = user.sentFriendRequests.map(req => req.receiver);

        // Fetch related users
        const pendingSenders = await User.find({ _id: { $in: pendingSenderIds } })
            .select('username avatar _id');

        const sentReceivers = await User.find({ _id: { $in: sentReceiverIds } })
            .select('username avatar _id');

        // Combine with request info
        const formattedPending = user.friendRequests.map(req => ({
            _id: req._id,
            status: req.status,
            sender: pendingSenders.find(u => u._id.equals(req.sender)) || null
        }));

        const formattedSent = user.sentFriendRequests.map(req => ({
            _id: req._id,
            status: req.status,
            receiver: sentReceivers.find(u => u._id.equals(req.receiver)) || null
        }));

        return res.status(200).json({
            pendingRequests: formattedPending,
            sentRequests: formattedSent
        });

    } catch (error) {
        console.error("Error in getFollowRequests:", error);
        return res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

export {
    followUser, cancelFollowRequest,
    unfollowUser, acceptFollowRequest,
    rejectFriendRequest, getFriendList,
    getMutualFriends, searchUsers,
    getFollowerAndFollowing,
    checkFollowStatus, getFollowRequests
}


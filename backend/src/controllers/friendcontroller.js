
// this controller is for following purpose

import { User } from "../models/user.models.js";
import { io } from "../socket.js";
import mongoose from "mongoose";

// sendFriendRequest (friend request bhejne ke liye)
// acceptFriendRequest (friend request ko accept karne ke liye)
// rejectFriendRequest (friend request ko reject karne ke liye)
// followUser (user ko follow karne ke liye)
// unfollowUser (user ko unfollow karne ke liye)

// const followUser = async (req, res) => {
//     const loggedInUserId = req.user._id;
//     const { userIdToFollow } = req.params;


//     try {
//         //step 1 make sure user does not folow themselves
//         if (loggedInUserId.toString() === userIdToFollow.toString()) {
//             return res.status(400).json({ message: "You cannot follow yourself" })
//         }
//         //step 2 : find the user whom you want to follow 
//         const userToFollow = await User.findById(userIdToFollow)
//         if (!userToFollow) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         //check if user alrady follows 
//         // const alreadyFollowing=userToFollow.friends.includes(loggedInUserId) this will have tc O of n
//         //so lets use mongodb query
//         // Instead of using .includes() (O(N)), we use MongoDB's `exists()` for better performance (O(1)).
//         // Instead of using .includes() (O(N)), we use MongoDB's `exists()` for better performance (O(1)).
//         const alreadyFollowing = await User.exists({
//             _id: userIdToFollow,
//             friends: loggedInUserId
//         })//so in this function we are passing the id of person we want to follow and then check if at friends the person who wants to follow has the id already present or not
//         if (alreadyFollowing) {
//             return res.status(400).json({ message: "You are already following " })
//         }
//         //step 4 if account is privvate send friend request
//         //some() -iska use  hai ki agar array mein kuch ek item hai aur usko satisfy karta hai to true return karna 
//         if (userToFollow.privacy === "private") {
//             const existingRequest = userToFollow.friendRequests.find(
//                 (request) => request.sender.toString() === loggedInUserId.toString()
//             );

//             if (existingRequest) {
//                 return res.status(400).json({ message: "Friend request already sent!" });
//             }

//             userToFollow.friendRequests.push({ sender: loggedInUserId, status: "pending" });
//             await userToFollow.save();

//             return res.status(200).json({ message: "Friend request sent!" });
//         }
//         //if account is public ,follow directly
//         userToFollow.friends.push(loggedInUserId);
//         await userToFollow.save();
//         return res.status(200).json({
//             message: "User followed successfully!",
//             userId: userIdToFollow
//         });


//     } catch (error) {
//         return res.status(500).json({ message: "Something went wrong!", error });

//     }
// };


// const followUser = async (req, res) => {
//     const loggedInUserId = req.user._id.toString();
//     const { userIdToFollow } = req.params;

//     try {
//         if (loggedInUserId === userIdToFollow) {
//             return res.status(400).json({ message: "You cannot follow yourself" });
//         }

//         const [userToFollow, loggedInUser] = await Promise.all([
//             User.findById(userIdToFollow),
//             User.findById(loggedInUserId)
//         ]);


//         if (!userToFollow || !loggedInUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if already following
//         if (userToFollow.followers.includes(loggedInUserId)) {
//             return res.status(200).json({
//                 message: `You are already following ${userToFollow.username}`
//             });
//         }

//         if (userToFollow.privacy === "private") {
//             console.log("🔒 Private Account - Sending Follow Request...");
//             const existingRequest = userToFollow.friendRequests.find(
//                 (request) => request.sender.toString() === loggedInUserId
//             );

//             if (existingRequest) {
//                 return res.status(400).json({
//                     message: "Follow request already sent!"
//                 });
//             }

//             userToFollow.friendRequests.push({
//                 sender: loggedInUserId,
//                 status: "pending"
//             });
//             loggedInUser.sentFriendRequests.push({
//                 receiver: userIdToFollow,
//                 status: "pending"

//             })

//             await Promise.all([userToFollow.save(), loggedInUser.save()])
//             io.emit("friend_request_sent", {
//                 requestId: loggedInUserId,
//                 receiverId: userIdToFollow,
//                 requestId: userToFollow.friendRequests[userToFollow.friendRequests.length - 1]._id
//             });
//             return res.status(200).json({
//                 message: "Follow request sent!",
//                 requestId: userToFollow.friendRequests[userToFollow.friendRequests.length - 1]._id
//             });
//         }

//         // ✅ Add user to 'following' and 'followers'
//         loggedInUser.following.push(userIdToFollow);
//         userToFollow.followers.push(loggedInUserId);

//         // ✅ Save both users
//         await loggedInUser.save();
//         await userToFollow.save();
//         io.emit("follow", {
//             targetUserId: userIdToFollow, // जिसे follow किया
//             newFollower: loggedInUserId,  // जिसने follow किया (current user)
//             loggedInUserId: loggedInUserId // ✅ नई field जोड़ें
//         });
//         io.emit("update_profile_following", {
//             type: "follow",
//             profileUserId: loggedInUserId,  // जिसका following update होगा
//             targetUserId: userIdToFollow    // जिसे follow किया
//         });

//         return res.status(200).json({
//             message: `Successfully followed ${userToFollow.username}`,
//             userId: userIdToFollow
//         });

//     } catch (error) {
//         console.error("❌ Follow user error:", error);
//         return res.status(500).json({
//             message: "Something went wrong!",
//             error: error.message
//         });
//     }
// };


const followUser = async (req, res) => {
    const loggedInUserId = req.user._id.toString();
    const { userIdToFollow } = req.params;

    try {
        if (loggedInUserId === userIdToFollow) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const [userToFollow, loggedInUser] = await Promise.all([
            User.findById(userIdToFollow),
            User.findById(loggedInUserId)
        ]);

        if (!userToFollow || !loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ पहले से follow या request check करें
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
            // ✅ नया request बनाएं
            const newRequest = {
                _id: requestId,
                sender: loggedInUserId,
                status: "pending"
            };

            userToFollow.friendRequests.push(newRequest);
            loggedInUser.sentFriendRequests.push({
                _id: requestId,
                receiver: userIdToFollow,
                status: "pending"
            });

            await Promise.all([userToFollow.save(), loggedInUser.save()]);

            // ✅ WebSocket Event भेजें
            // गलत:
            io.to("friend_request_received", { /*...*/ });

            // सही:
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

        // Public Account का Logic
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
            userId: userIdToFollow // ✅ Follow किए गए user का ID
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
            profileUserId: loggedInUserId,   // जिसका following update होगा
            targetUserId: userIdToUnfollow   // जिसे unfollow किया
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
        const receiverId = req.user._id;
        const { requestId } = req.params;

        // 1. Find and remove the request
        const receiver = await User.findOneAndUpdate(
            { _id: receiverId, 'friendRequests._id': requestId },
            { $pull: { friendRequests: { _id: requestId } } },
            { new: true }
        );

        if (!receiver) {
            return res.status(404).json({ message: "Request not found" });
        }

        // 2. Get sender ID from request
        const request = receiver.friendRequests.id(requestId);
        const senderId = request?.sender;
        if (!senderId) {
            return res.status(400).json({ message: "Invalid request format" });
        }

        // 3. Update both users' relationships atomically
        await Promise.all([
            User.findByIdAndUpdate(receiverId, {
                $addToSet: { followers: senderId }
            }),
            User.findByIdAndUpdate(senderId, {
                $addToSet: { following: receiverId },
                $pull: { sentFriendRequests: { receiver: receiverId } }
            })
        ]);

        // 4. Emit real-time update
        io.to(senderId).emit('request_accepted', {
            receiverId: receiverId,
            requestId: requestId
        });

        res.status(200).json({
            success: true,
            message: "Request accepted successfully",
            senderId: senderId,
            receiverId: receiverId
        });

    } catch (error) {
        console.error("Accept request error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to accept request",
            error: error.message
        });
    }
};

const rejectFriendRequest = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { requestId } = req.params;
        const receiverId = req.user._id;
        console.log(requestId);
        // 1. Find and validate the request
        const receiver = await User.findOne({
            _id: receiverId,
            'friendRequests._id': requestId
        }).session(session);

        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Request not found" });
        }

        const request = receiver.friendRequests.id(requestId);
        const senderId = request.sender;

        // 2. Remove requests (both sides)
        await User.updateOne(
            { _id: receiverId },
            { $pull: { friendRequests: { _id: requestId } } }
        ).session(session);

        await User.updateOne(
            { _id: senderId },
            { $pull: { sentFriendRequests: { receiver: receiverId } } }
        ).session(session);

        await session.commitTransaction();

        // 3. Notify sender
        io.to(senderId.toString()).emit('request_declined', {
            requestId,
            receiver: {
                _id: receiverId,
                username: req.user.username
            }
        });

        res.status(200).json({ message: "Request declined" });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error declining request", error: error.message });
    } finally {
        session.endSession();
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

// const getFollowRequests = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id)
//             .populate('friendRequests.sender', 'username avatar _id')
//             .populate('sentFriendRequests.receiver', 'username avatar _id')
//             .lean();

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const response = {
//             pendingRequests: user.friendRequests.map(req => ({
//                 _id: req._id,
//                 status: req.status,
//                 createdAt: req.createdAt,
//                 user: req.sender
//             })),
//             sentRequests: user.sentFriendRequests.map(req => ({
//                 _id: req._id,
//                 status: req.status,
//                 createdAt: req.createdAt,
//                 user: req.receiver
//             }))
//         };

//         res.status(200).json(response);

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({
//             message: "Error fetching requests",
//             error: error.message
//         });
//     }
// };
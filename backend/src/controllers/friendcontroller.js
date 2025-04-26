
// this controller is for following purpose

import { json } from "express";
import { User } from "../models/user.models.js";
import { io } from "../socket.js";

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

        // Check if already following
        if (userToFollow.followers.includes(loggedInUserId)) {
            return res.status(200).json({
                message: `You are already following ${userToFollow.username}`
            });
        }

        if (userToFollow.privacy === "private") {
            console.log("🔒 Private Account - Sending Follow Request...");
            const existingRequest = userToFollow.friendRequests.find(
                (request) => request.sender.toString() === loggedInUserId
            );

            if (existingRequest) {
                return res.status(400).json({
                    message: "Follow request already sent!"
                });
            }

            userToFollow.friendRequests.push({
                sender: loggedInUserId,
                status: "pending"
            });
            loggedInUser.sentFriendRequests.push({
                receiver: userIdToFollow,
                status: "pending"

            })

            await Promise.all([userToFollow.save(), loggedInUser.save()])
            return res.status(200).json({
                message: "Follow request sent!",
                requestId: userToFollow.friendRequests[userToFollow.friendRequests.length - 1]._id
            });
        }

        // ✅ Add user to 'following' and 'followers'
        loggedInUser.following.push(userIdToFollow);
        userToFollow.followers.push(loggedInUserId);

        // ✅ Save both users
        await loggedInUser.save();
        await userToFollow.save();
        io.emit("follow", {
            targetUserId: userIdToFollow, // जिसे follow किया
            newFollower: loggedInUserId,  // जिसने follow किया (current user)
            loggedInUserId: loggedInUserId // ✅ नई field जोड़ें
        });
        io.emit("update_profile_following", {
            type: "follow",
            profileUserId: loggedInUserId,  // जिसका following update होगा
            targetUserId: userIdToFollow    // जिसे follow किया
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
    const loggedInUserId = req.user._id;
    const { senderId } = req.body;
    if (!senderId) {
        return res.status(400).json({ message: "Sender Id id required" })
    }
    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "user not  found " })
        }

        const requestIndex = user.friendRequests.findIndex(
            (request) => request.sender.toString() === senderId.toString()
        )

        if (requestIndex === -1) {
            return res.status(400).json({ message: "No pending request found" })
        }
        user.friends.push(senderId);
        user.friendRequests.splice(requestIndex, 1);
        await user.save();
        return res.status(200).json({ message: "Friend request accepted!" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}
const rejectFriendRequest = async (req, res) => {
    const loggedInUserId = req.user._id;
    const { senderId } = req.body;
    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const initialLength = user.friendRequests.length;
        //filter to delete
        user.friendRequests = user.friendRequests.filter((request) => request.sender.toString() !== senderId.toString())
        if (user.friendRequests.length === initialLength) {
            return res.status(400).json({ message: "No pending request found!" });
        }

        await user.save();
        return res.status(200).json({ message: "Friend request rejected!" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });

    }

}
//ab followed user ki list dikhana 
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
        const user = await User.findById(userId).select("followers following").populate({
            path: "followers following",
            select: "username profilePicture"
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            followers: user.followers,
            following: user.following
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}
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

export {
    followUser, cancelFollowRequest,
    unfollowUser, acceptFollowRequest,
    rejectFriendRequest, getFriendList,
    getMutualFriends, searchUsers,
    getFollowerAndFollowing,
    checkFollowStatus
}
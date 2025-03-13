
// this controller is for following purpose

import { json } from "express";
import { User } from "../models/user.models.js";

// sendFriendRequest (friend request bhejne ke liye)
// acceptFriendRequest (friend request ko accept karne ke liye)
// rejectFriendRequest (friend request ko reject karne ke liye)
// followUser (user ko follow karne ke liye)
// unfollowUser (user ko unfollow karne ke liye)

const followUser = async (req, res) => {
    const loggedInUserId = req.user._id;
    const { userIdToFollow } = req.params;


    try {
        //step 1 make sure user does not folow themselves
        if (loggedInUserId.toString() === userIdToFollow.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" })
        }
        //step 2 : find the user whom you want to follow 
        const userToFollow = await User.findById(userIdToFollow)
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }
        //check if user alrady follows 
        // const alreadyFollowing=userToFollow.friends.includes(loggedInUserId) this will have tc O of n
        //so lets use mongodb query
        // Instead of using .includes() (O(N)), we use MongoDB's `exists()` for better performance (O(1)).
        // Instead of using .includes() (O(N)), we use MongoDB's `exists()` for better performance (O(1)).
        const alreadyFollowing = await User.exists({
            _id: userIdToFollow,
            friends: loggedInUserId
        })//so in this function we are passing the id of person we want to follow and then check if at friends the person who wants to follow has the id already present or not
        if (alreadyFollowing) {
            return res.status(400).json({ message: "You are already following " })
        }
        //step 4 if account is privvate send friend request
        //some() -iska use  hai ki agar array mein kuch ek item hai aur usko satisfy karta hai to true return karna 
        if (userToFollow.privacy === "private") {
            const existingRequest = userToFollow.friendRequests.find(
                (request) => request.sender.toString() === loggedInUserId.toString()
            );

            if (existingRequest) {
                return res.status(400).json({ message: "Friend request already sent!" });
            }

            userToFollow.friendRequests.push({ sender: loggedInUserId, status: "pending" });
            await userToFollow.save();

            return res.status(200).json({ message: "Friend request sent!" });
        }
        //if account is public ,follow directly
        userToFollow.friends.push(loggedInUserId);
        await userToFollow.save();
        return res.status(200).json({ message: "User followed successfully!" });


    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });

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
    const loggedInUserId = req.user._id;
    const { userIdToUnfollow } = req.params;
    try {
        if (loggedInUserId.toString() === userIdToUnfollow.toString()) {
            return res.status(400).json({ message: "You cannot unfollow yourself" })
        }
        //check if users to unfollow exist 
        const userToUnfollow = await User.findById(userIdToUnfollow);
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }
        //step 3 check if logged in user is actually following
        const isFollowing = await User.exists({
            _id: loggedInUserId,
            friends: userIdToUnfollow
        })
        if (!isFollowing) {
            return res.status(400).json({ message: "You are not following this user" })
        }
        //step 4
        //removee from both friendship
        await User.updateOne({ _id: loggedInUserId },
            { $pull: { friends: userIdToUnfollow } });

        await User.updateOne({ _id: userIdToUnfollow },
            { $pull: { friends: loggedInUserId } }
        );

        return res.status(200).json({ message: "User unfollowed successfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong at else block of unfollow user!", error });

    }
}
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
            return res.status(200).json({
                followers: user.followers,
                following: user.following
            })
        }
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

export { followUser, cancelFollowRequest, unfollowUser, acceptFollowRequest, rejectFriendRequest, getFriendList, getMutualFriends, searchUsers, getFollowerAndFollowing, checkFollowStatus }
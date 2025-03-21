


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../../Redux/friendSlice';
import "./friendcss/followunfollow.css"

const FollowUnfollow = ({ userIdToFollow }) => {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.socket.instance); // ✅ Redux se socket le rahe hain
    const following = useSelector(state => state.friend.following);
const loggedInUserId = useSelector(state => state.user.loggedinuser?._id);
    const isFollowing = following.includes(userIdToFollow);

    const handleFollowUnfollow = () => {
        if (isFollowing) {
            dispatch(unfollowUser(userIdToFollow));
            // socket?.emit("unfollow", { userId: userIdToFollow }); // ✅ WebSocket Emit
            socket?.emit("unfollow", {
                targetUserId: userIdToFollow,
                unfollowerId: loggedInUserId
            });

        } else {
            dispatch(followUser(userIdToFollow));
            // socket?.emit("follow", { userId: userIdToFollow }); // ✅ WebSocket Emit
            socket?.emit("follow", {
                targetUserId: userIdToFollow,

                newFollower: loggedInUserId
            });

        }
    };

    return (
        <button onClick={handleFollowUnfollow} className="follow_button">
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FollowUnfollow;
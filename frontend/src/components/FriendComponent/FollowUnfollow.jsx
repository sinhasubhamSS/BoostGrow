


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addfollowing, followUser, removeFromSentRequests, unfollowUser, } from '../../Redux/friendSlice';
import "./friendcss/followunfollow.css"

const FollowUnfollow = ({ userIdToFollow }) => {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.socket.instance); // ✅ Redux se socket le rahe hain

    const loggedInUserId = useSelector(state => state.user.loggedinuser?._id);
    const loggedInUserFollowing = useSelector(state => state.friend.loggedInUserFollowing);

    console.log("following of me", loggedInUserFollowing);
    const isFollowing = loggedInUserFollowing?.includes(userIdToFollow);
    const sentRequests = useSelector(state => state.friend.sentRequests);
    // In FollowUnfollow component
    const isRequestSent = sentRequests?.some(request =>
        (request.receiver._id === userIdToFollow || // Handle existing object format
            request.receiver === userIdToFollow) &&    // Handle new string format
        request.status === "pending"
    );


    console.log(" sentRequests", sentRequests);
    console.log(" userIdToFollow", userIdToFollow);
    console.log("isRequestSent", isRequestSent);
    console.log("isfollowing", isFollowing);

    const handleFollowUnfollow = () => {
        if (isFollowing) {
            dispatch(unfollowUser(userIdToFollow));
            // socket?.emit("unfollow", { userId: userIdToFollow }); // ✅ WebSocket Emit
            socket?.emit("unfollow", {
                targetUserId: userIdToFollow,
                unfollowerId: loggedInUserId,
                loggedInUserId: loggedInUserId
            });

        } else {

            dispatch(followUser(userIdToFollow));
            // socket?.emit("follow", { userId: userIdToFollow }); // ✅ WebSocket Emit
            socket?.emit("follow", {
                targetUserId: userIdToFollow,
                newFollower: loggedInUserId,
                loggedInUserId: loggedInUserId
            });

        }
    };
    useEffect(() => {
        if (!socket) return;

        const handleRequestAccepted = (data) => {
            console.log("Request accepted event received:", data);
            // Check if the logged-in user is the sender of the accepted request
            if (data.senderId === loggedInUserId) {
                // Add the targetUserId (user they now follow) to their following list
                dispatch(addfollowing(data.targetUserId));
                // Remove the accepted request from sentRequests
                dispatch(removeFromSentRequests(data.requestId));
            }
        };

        socket.on("request_accepted", handleRequestAccepted);
        socket.on('following_added', (data) => {
            console.log("followunfollow user aded",data);
            dispatch(addfollowing(data.newFollowingId)); // Redux में अपडेट
        });

        return () => {
            socket.off("request_accepted", handleRequestAccepted);
            socket.off('following_added');
        };
    }, [socket, dispatch, loggedInUserId]);


    return (
        <button onClick={handleFollowUnfollow} className="follow_button">
            {isRequestSent ? "Requested" : isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
};

export default FollowUnfollow;
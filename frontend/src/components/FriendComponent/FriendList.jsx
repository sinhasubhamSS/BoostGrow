//here we have to display the request list of friend so from redux extract data of friend request and display 



import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { acceptFriendRequest, declineRequest } from '../../Redux/friendSlice';

function FriendList() {
    const dispatch=useDispatch()
    const friendRequests = useSelector(state => state.friend.friendRequests)
    console.log("checking friendRequest", friendRequests);
    const handleAccept = (requestId, senderId) => {
        dispatch(acceptFriendRequest({ requestId, senderId }));
    };

    const handleDecline = (requestId) => {
        dispatch(declineRequest(requestId));
    };
    return (
        <div className="requests-container">
            <h3>Pending Friend Requests</h3>
            {friendRequests?.map(request => (
                <div key={request._id} className="request-item">
                    <div className="user-info">
                        <img src={request.sender?.profilePicture || "/default-avatar.png"}
                            alt={request.sender?.username || "Unknown User"} />
                        <span>{request.sender?.username}</span>
                    </div>
                    <div className="request-actions">
                        <button
                            onClick={() => handleAccept(request._id, request.sender._id)}
                            className="accept-btn"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleDecline(request._id)}
                            className="decline-btn"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FriendList
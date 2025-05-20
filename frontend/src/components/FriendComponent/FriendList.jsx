import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests, acceptRequest, rejectRequest, addfriendRequest } from "../../Redux/friendSlice"

function FriendList() {
    const dispatch = useDispatch();
    const {
        pendingRequests,
        sentRequests,
    } = useSelector((state) => state.friend);
    const socket = useSelector(state => state.socket.instance);
    const loggedInUserId = useSelector(state => state.user.loggedinuser?._id);
    console.log(loggedInUserId);
    // Fetch requests on component mount
    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);


    useEffect(() => {
        if (!socket) {
            console.log("Socket instance not available yet.");
            return;
        }

        console.log("Socket connected?", socket.connected); // <-- Check here

        const handleFriendRequest = (data) => {
            console.log("Friend request received:", data); // ✅ Should run
            if (data.request.receiver === loggedInUserId) {
                dispatch(addfriendRequest(data.request));
            }
        };
        socket.on("friend_request_received", handleFriendRequest);

        return () => {
            socket.off("friend_request_received", handleFriendRequest);
           
        };
    }, [socket, loggedInUserId, dispatch]);

    // Handle accept request
    const handleAccept = (requestId) => {
        dispatch(acceptRequest(requestId));
    };

    // Handle reject request
    const handleReject = (requestId) => {
        dispatch(rejectRequest(requestId));
    };

    return (
        <div className="friend-list-container">
            {/* Pending Requests Section */}
            <div className="requests-section">
                <h2>Pending Requests ({pendingRequests.length})</h2>

                {pendingRequests.length > 0 ? (
                    <div className="requests-grid">
                        {pendingRequests.map((request) => (
                            <div key={request._id} className="request-card">
                                <div className="user-info">
                                    <img
                                        src={request.sender.avatar}
                                        alt={request.sender.username}
                                        className="user-avatar"
                                    />
                                    <div>
                                        <h3>{request.sender.username}</h3>
                                        <p className="request-time">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => handleAccept(request._id)}
                                        className="accept-btn"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(request._id)}
                                        className="reject-btn"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-requests">No pending requests</p>
                )}
            </div>

            {/* Sent Requests Section */}
            <div className="requests-section">
                <h2>Sent Requests ({sentRequests.length})</h2>

                {sentRequests.length > 0 ? (
                    <div className="requests-grid">
                        {sentRequests.map((request) => (
                            <div key={request._id} className="request-card">
                                <div className="user-info">
                                    <img
                                        src={request.receiver.avatar}
                                        alt={request.receiver.username}
                                        className="user-avatar"
                                    />
                                    <div>
                                        <h3>{request.receiver.username}</h3>
                                        <p className="request-time">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`status-tag ${request.status}`}>
                                    {request.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-requests">No sent requests</p>
                )}
            </div>
        </div>
    );
}

export default FriendList;
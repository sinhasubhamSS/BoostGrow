// Sidebar → Chats title + Search Bar + UserList
// ✔ UserList → Maps through users and filters via search
// ✔ UserItem → Displays one user with avatar & name
// ✔ ChatWindow → Shows messages if a user is selected, else "Hey, let's start chatting!"
// ✔ Message → Displays sent / received messages









import React from 'react'
import "./useritem.css"
import { setselectedUser } from '../../Redux/userSlice'
import { useDispatch } from 'react-redux'

function UserItem({ user, onlineUsersSet }) {
    const dispatch = useDispatch();
    const isOnline = onlineUsersSet.has(user._id);

    return (
        <div className="user__container" onClick={() => dispatch(setselectedUser(user))}>
            {/* Avatar container with relative positioning */}
            <div className="avatar-container">
                <img
                    src={user.ProfilePicture || `https://ui-avatars.com/api/?name=${user.username.charAt(0)}`}
                    alt=""
                    className="avatar__useritem"
                />
                {isOnline && <span className="online-dot"></span>}
            </div>
            <span className="username">{user.username}</span>
        </div>
    )
}

export default UserItem
import React, { useEffect, useMemo } from 'react';
import { fetchUsers } from '../../Redux/userSlice';
import "./userlist.css";
import { useDispatch, useSelector } from "react-redux";
import UserItem from './UserItem';

function UserList({ searchUser }) {
    const dispatch = useDispatch();
    const { otherUsers, loading, error, onlineUsers } = useSelector((state) => state.user);
    const socket = useSelector((state) => state.socket.instance);

    // ✅ Move hooks to the top to prevent rendering issues
    const onlineUsersSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);

    const filteredUsers = useMemo(() => {
        return otherUsers?.filter((user) =>
            user.username.toLowerCase().includes(searchUser.toLowerCase())
        );
    }, [otherUsers, searchUser]);

    useEffect(() => {
        if (!socket) return; // ✅ Prevents running when socket is null

        const handleNewUser = (newuser) => {
            console.log("🆕 New User Registered:", newuser);
            dispatch(fetchUsers());
        };

        socket.on("newUserRegistered", handleNewUser);

        return () => {
            socket.off("newUserRegistered", handleNewUser); // ✅ Cleanup on unmount
        };
    }, [dispatch, socket]); // ✅ Ensure `socket` dependency is handled

    // ✅ Only return JSX after hooks are fully defined
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='userlist'>
            {filteredUsers?.map((user) => (
                <UserItem key={user._id} user={user} onlineUsersSet={onlineUsersSet} />
            ))}
        </div>
    );
}

export default UserList;

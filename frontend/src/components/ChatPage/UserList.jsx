// import React, { useEffect, useMemo } from 'react';
// import { fetchUsers } from '../../Redux/userSlice';
// import "./userlist.css";
// import { useDispatch, useSelector } from "react-redux";
// import UserItem from './UserItem';
// import { messagedUsers } from '../../Redux/userSlice';

// function UserList({ searchUser }) {
//     const dispatch = useDispatch();
//     const {otherUsers, loading, error, onlineUsers } = useSelector((state) => state.user);

//     const socket = useSelector((state) => state.socket.instance);

//     // ✅ Move hooks to the top to prevent rendering issues
//     const onlineUsersSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);
//     useEffect(() => {
//         if (!messagedusers || messagedusers.length === 0) {
//             dispatch(messagedUsers());
//         }
//     }, [dispatch, messagedusers]); // ✅ Remove `.length` to prevent errors



//     const filteredUsers = useMemo(() => {
//         if (!messagedusers || !messagedusers.length === 0) return [];
//         return messagedusers?.filter((user) =>
//             user.username.toLowerCase().includes(searchUser.toLowerCase())
//         );
//     }, [messagedusers, searchUser]);
//     console.log("Filtered Users:", filteredUsers);

//     useEffect(() => {
//         if (!socket) return; // ✅ Prevents running when socket is null

//         const handleNewUser = (newuser) => {
//             console.log("🆕 New User Registered:", newuser);
//             dispatch(fetchUsers());
//         };

//         socket.on("newUserRegistered", handleNewUser);

//         return () => {
//             socket.off("newUserRegistered", handleNewUser); // ✅ Cleanup on unmount
//         };
//     }, [dispatch, socket]); // ✅ Ensure `socket` dependency is handled

//     // ✅ Only return JSX after hooks are fully defined
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className='userlist'>
//             {filteredUsers?.map((user) => (
//                 <UserItem key={user._id} user={user} onlineUsersSet={onlineUsersSet} />
//             ))}
//         </div>
//     );
// }

// export default UserList;



import React, { useEffect, useMemo } from 'react';
import { fetchUsers } from '../../Redux/userSlice';
import "./userlist.css";
import { useDispatch, useSelector } from "react-redux";
import UserItem from './UserItem';

function UserList({ searchUser }) {
    const dispatch = useDispatch();
    const { otherUsers, loading, error, onlineUsers } = useSelector((state) => state.user);
    const socket = useSelector((state) => state.socket.instance);

    const onlineUsersSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);

    // ✅ API कॉल को सही तरीके से हैंडल करें
    useEffect(() => {
        if (!otherUsers || otherUsers.length === 0) { // शर्त को ठीक करें
            dispatch(fetchUsers());
        }
    }, [dispatch, otherUsers]); // ✅ otherUsers को डिपेंडेंसी में रखें

    // ✅ फ़िल्टर लॉजिक सही करें
    const filteredUsers = useMemo(() => {
        if (!otherUsers || otherUsers.length === 0) return []; // शर्त ठीक करें
        return otherUsers.filter((user) => // टाइपो ठीक करें (returnotherUsers → return otherUsers)
            user.username.toLowerCase().includes(searchUser.toLowerCase())
        );
    }, [otherUsers, searchUser]);

    // सॉकेट लॉजिक (वैसा ही रखें)
    useEffect(() => {
        if (!socket) return;
        const handleNewUser = () => dispatch(fetchUsers());
        socket.on("newUserRegistered", handleNewUser);
        return () => socket.off("newUserRegistered", handleNewUser);
    }, [dispatch, socket]);

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
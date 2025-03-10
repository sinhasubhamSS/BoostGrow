import React, { useEffect, useMemo } from 'react'
import { fetchUsers } from '../../Redux/userSlice'
import "./userlist.css"
import { useDispatch, useSelector } from "react-redux"
import UserItem from './UserItem'

function UserList({ searchUser, }) {
    const dispatch = useDispatch()
    const { otherUsers, loading, error, onlineUsers } = useSelector((state) => state.user)

    useEffect(() => {
        if (!otherUsers?.length) {
            dispatch(fetchUsers());
        }
    }, [dispatch, otherUsers?.length]);
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    const onlineUsersSet = new Set(onlineUsers);
    //filter user based on the search term
    // Agar searchUser empty string ("" or falsy) hai, to filtering mein aisa ho sakta hai ki sabhi users return ho jayenge. JavaScript mein, "anyString".includes("") hamesha true return karta hai.
    const filteredusers = useMemo(() => {
        return otherUsers?.filter((user) =>
            user.username.toLowerCase().includes(searchUser.toLowerCase())
        );
    }, [otherUsers, searchUser]);
    return (
        <>
            <div className='userlist'>

                {/* otherUsers?.map((user) => (
                        <UserItem key={user._id} user={user} />
                    )) */}
                {/* //ab filtered user dikhao ya phir all user */}
                {filteredusers?.map((user) => (
                    <UserItem key={user._id} user={user} onlineUsersSet={onlineUsersSet} />
                ))}
            </div>

        </>
    )
}

export default UserList
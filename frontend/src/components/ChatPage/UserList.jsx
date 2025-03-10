import React, { useEffect } from 'react'
import { fetchUsers } from '../../Redux/userSlice'
import "./userlist.css"
import { useDispatch, useSelector } from "react-redux"
import UserItem from './UserItem'

function UserList({ searchUser, }) {
    const dispatch = useDispatch()
    const { otherUsers, loading, error } = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    //filter user based on the search term
    // Agar searchUser empty string ("" or falsy) hai, to filtering mein aisa ho sakta hai ki sabhi users return ho jayenge. JavaScript mein, "anyString".includes("") hamesha true return karta hai.
    const filteredusers = otherUsers?.filter((user) =>
        user.username.toLowerCase().includes(searchUser.toLowerCase()))
    return (
        <>
            <div className='userlist'>

                {/* otherUsers?.map((user) => (
                        <UserItem key={user._id} user={user} />
                    )) */}
                {/* //ab filtered user dikhao ya phir all user */}
                {filteredusers?.map((user) => (
                    <UserItem key={user._id} user={user} />
                ))}
            </div>

        </>
    )
}

export default UserList
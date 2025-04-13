import React from 'react'
import UserProfile from '../components/Profille/UserProfile'
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

function Profilepage() {
    const { userId } = useParams(); // userId URL se le raha hai
    const loggedinuser = useSelector(state => state.user.loggedinuser)
    if (!userId && !loggedinuser?._id) {
        navigate("/auth/login");
        return null;
    }

    const finalUserId = userId || loggedinuser?._id;
    return (
        <UserProfile userId={finalUserId}  />
    );
}

export default Profilepage;

import React from 'react'
import UserProfile from '../components/Profille/UserProfile'
import { useParams } from "react-router-dom";

function Profilepage() {
    const { userId } = useParams(); // userId URL se le raha hai

    return (
        <UserProfile userId={userId} /> 
    );
}

export default Profilepage;

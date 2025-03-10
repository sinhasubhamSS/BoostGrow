import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/userSlice'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser()); // Clear user state from Redux
        navigate('/auth/Login'); // Redirect to login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;

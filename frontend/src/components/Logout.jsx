import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate('/auth/Login');
    }, [dispatch, navigate]);

    return null;
}

export default Logout;

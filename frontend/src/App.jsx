import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Homepage from './pages/Homepage'
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'
import Todopage from './pages/Todopage'
import Logout from './components/Logout'
import { Toaster } from "react-hot-toast";
import Chatpage from './pages/Chatpage'
import useSocket from './services/Socket'
import Profilepage from './pages/Profilepage'
import { useDispatch, useSelector } from 'react-redux'
import { myprofile } from './Redux/friendSlice'
import FriendList from './components/FriendComponent/FriendList'

const router = createBrowserRouter
    (
        createRoutesFromElements(
            <>
                <Route path='/' element={<Layout />}>
                    <Route path='/' index element={<Homepage />} />

                    <Route path='Todopage' element={<Todopage />} />
                    <Route path='Chatpage' element={<Chatpage />} />
                    {/* <Route path="profile" element={<Profilepage />} /> */}
                    <Route path='profile/:userId' element={<Profilepage />} />
                    <Route path='friend-requests' element={<FriendList />} />



                </Route>
                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='Login' element={<Login />} />
                    <Route path='Signup' element={<Signup />} />

                </Route>
            </>
        ))
function App() {
    const loggedInUserId = useSelector((state) => state.user.loggedinuser)
    const dispatch = useDispatch();
    useEffect(() => {
        if (loggedInUserId) {
            dispatch(myprofile(loggedInUserId._id)); // ✅ लॉगिन यूजर का डेटा लोड करें
        }
    }, [loggedInUserId, dispatch]);
    useSocket(loggedInUserId)


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={router} />
        </>
    )
}
export default App
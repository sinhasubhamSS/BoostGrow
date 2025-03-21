


// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers } from '../Redux/userSlice';
// import "./Csscomponents/searchuser.css";
// import FollowUnfollow from './FriendComponent/FollowUnfollow';
// import { useNavigate } from 'react-router-dom';

// function SearchUsers() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const otherUsers = useSelector((state) => state.user.otherUsers);
//     const loggedInUserId = useSelector((state) => state.user.loggedinuser)
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     useEffect(() => {
//         if (!otherUsers.length) {
//             dispatch(fetchUsers());
//         }
//     }, [dispatch, otherUsers.length]);

//     const filteredUsers = searchTerm
//         ? otherUsers.filter(user =>
//             user.username.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//         : [];

//     return (
//         <div className="search__container">
//             <input
//                 type="text"
//                 value={searchTerm}
//                 placeholder='Search user..'
//                 onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setIsDropdownOpen(!!e.target.value.trim()); // Empty hone par close
//                 }}
//                 onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Click outside pe band
//                 className='search__input'
//             />

//             {searchTerm && isDropdownOpen && (
//                 <ul className="search__result">
//                     {filteredUsers.length > 0 ? (
//                         filteredUsers.map(user => (
//                             <li key={user._id} className="user__item" onClick={() => navigate(`/profile/${user._id}`)}>
//                                 <img
//                                     src={user.profilePicture || "/default-avatar.png"}
//                                     alt=""
//                                 />
//                                 <span>{user.username}</span>
//                                 <div onClick={(e) => e.stopPropagation()}>
//                                     <FollowUnfollow userIdToFollow={user._id} />
//                                 </div>
//                             </li>
//                         ))
//                     ) : (
//                         <p className="no__result">No users found</p>
//                     )}
//                 </ul>
//             )}
//         </div>
//     );
// }

// export default SearchUsers;






import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Redux/userSlice';
import "./Csscomponents/searchuser.css";
import FollowUnfollow from './FriendComponent/FollowUnfollow';
import { useNavigate } from 'react-router-dom';

function SearchUsers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const otherUsers = useSelector((state) => state.user.otherUsers);
    const loggedInUserId = useSelector((state) => state.user.loggedinuser);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const searchRef = useRef(null); // ✅ Ref for detecting outside clicks

    useEffect(() => {
        if (!otherUsers.length) {
            dispatch(fetchUsers());
        }
    }, [dispatch, otherUsers.length]);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredUsers = searchTerm
        ? otherUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="search__container" ref={searchRef}> {/* ✅ Ref added here */}
            <input
                type="text"
                value={searchTerm}
                placeholder='Search user..'
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(!!e.target.value.trim()); // ✅ Empty hone par close
                }}
                className='search__input'
            />

            {searchTerm && isDropdownOpen && (
                <ul className="search__result">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <li key={user._id} className="user__item" onClick={() => navigate(`/profile/${user._id}`)}>
                                <img
                                    src={user.profilePicture || "/default-avatar.png"}
                                    alt=""
                                />
                                <span>{user.username}</span>
                                <div onClick={(e) => e.stopPropagation()}> {/* ✅ Prevent closing on Follow click */}
                                    <FollowUnfollow userIdToFollow={user._id} />
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="no__result">No users found</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SearchUsers;

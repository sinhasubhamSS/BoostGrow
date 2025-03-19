import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../Redux/userSlice'
import "./Csscomponents/searchuser.css"

function SearchUsers() {
    const otherUsers = useSelector((state) => state.user.otherUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef(null);


    useEffect(() => {
        if (otherUsers.length === 0) {
            dispatch(fetchUsers()); // Agar users available nahi hai to API call karega
        }
    }, [dispatch, otherUsers.length]);



    const filteredUsers = searchTerm
        ? otherUsers.filter((user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];
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

    return (
        <>
            <div className="search__container" ref={searchRef}>
                <input type="text"
                    value={searchTerm}
                    placeholder='Search user..'
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true); // Jab search ho raha ho, dropdown open ho
                    }}
                    className='search__input' />

                {searchTerm && isDropdownOpen && (
                    <ul className="search__result">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <li key={user._id} className="user__item">
                                    <img
                                        src={user.profilePicture || "/default-avatar.png"}
                                        alt=""
                                    />
                                    <span>{user.username}</span>
                                    <button className="follow__btn">Follow</button>
                                </li>
                            ))
                        ) : (
                            <p className="no__result">No users found</p>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default SearchUsers
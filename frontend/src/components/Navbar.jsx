
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import "./Csscomponents/navbar.css";
import SearchUsers from './SearchUsers';

function Navbar() {
  const user = useSelector((state) => state.user.loggedinuser); // Redux state se user fetch kar rahe hain
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const toggleDropdown = () => {
    setDropDownOpen(!dropDownOpen)
  }
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDownOpen(false)
      }
    }
    if (dropDownOpen) {
      document.addEventListener('mousedown', handleClickOutside);

    } else {
      document.addEventListener('mousedown', handleClickOutside);

    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropDownOpen])

  return (
    <header>
      <nav className='navigation'>
        <div className="Logo">
          <a>
            <img src="" alt="alt" />
          </a>
        </div>
        <ul className="nav-items">
          <li>
            <Link to="/" className='nav__link'>Home</Link>
          </li>
          <li>
            <Link to="/about" className='nav__link'>About</Link>
          </li>
          <li>
            <Link to="/Chatpage" className='nav__link'>Chat</Link>
          </li>
          <li>
            <Link to="/friend-requests" className='nav__link'>Friend</Link>
          </li>
        </ul>
        {/* ✅ Search Box Navbar ke andar */}
        <div className="nav-search">
          <SearchUsers />
        </div>
        <div className="nav--btns">
          {user ? (
            <>
              <div className="profile-dropdown" ref={dropdownRef}>
                <button className='nav-user' onClick={toggleDropdown}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} className="profile-pic" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1.5em" width="1.5em">
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>

                  )}
                </button>
                {
                  dropDownOpen && (
                    <div className="dropdown-menu">
                      <p className="dropdown-header">Hello, {user.username}</p>
                      <Link to="/update-profile" className="dropdown-item">Update Profile</Link>
                      <Link to={`/profile/${user._id}`} className="dropdown-item">My profile</Link>
                      <Logout />
                    </div>
                  )
                }

              </div>
            </>

          ) : (
            <Link to="/auth/Login" className='nav__link'>Login</Link>
          )}
        </div>

      </nav>
    </header >
  );
}

export default Navbar;

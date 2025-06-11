import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./Csscomponents/navbar.css";
import SearchUsers from './SearchUsers';
import AddPost from './Post/AddPost';

function Navbar() {
  const user = useSelector((state) => state.user.loggedinuser);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [postModel, setPostModel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropDownOpen]);

  return (
    <header className="navbar-container">
      <nav className='navigation'>
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            {/* <img src="/logo.png" className="logo-img" /> */}
            <span className="logo-text">TaskSync</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className={`nav-items ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="nav-links">
            <Link to="/" className='nav-link'>Home</Link>
            <Link to="/about" className='nav-link'>About</Link>
            <Link to="/Chatpage" className='nav-link'>Chat</Link>
            <Link to="/friend-requests" className='nav-link'>Friends</Link>
          </div>

          {/* Search Box */}
          <div className="nav-search">
            <SearchUsers />
          </div>

          {/* User Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                <button
                  className="add-post-btn"
                  onClick={() => setPostModel(true)}
                  title="Add New Post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm112 272H272v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96H144c-8.8 0-16-7.2-16-16s7.2-16 16-16h96V144c0-8.8 7.2-16 16-16s16 7.2 16 16v96h96c8.8 0 16 7.2 16 16s-7.2 16-16 16z"/>
                  </svg>
                </button>

                {postModel && (
                  <AddPost onClose={() => setPostModel(false)}/>
                )}

                <div className="profile-dropdown" ref={dropdownRef}>
                  <button className='profile-button' onClick={toggleDropdown}>
                    {user.profilePicture ? (
                      <img src={user.profilePicture} className="profile-pic" alt="Profile" />
                    ) : (
                      <div className="profile-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="24" width="24">
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {dropDownOpen && (
                    <div className="dropdown-menu">
                      <p className="dropdown-header">Hello, {user.username}</p>
                      <Link to="/update-profile" className="dropdown-item">Update Profile</Link>
                      <Link to={`/profile/${user._id}`} className="dropdown-item">My Profile</Link>
                      <Link to={'/Logout'}className="dropdown-item" >Logout</Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth/Login" className='login-button'>Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
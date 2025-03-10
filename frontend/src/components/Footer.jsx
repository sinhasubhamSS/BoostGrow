import React from 'react'
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Footer Logo */}
          <div className="footer-logo">
            <Link to="/">
              <img src="your-logo.png" alt="Your Logo" className="logo" />
            </Link>
          </div>

          {/* Footer Navigation */}
          <div className="footer-nav">
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/auth/Login">Login</Link></li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="footer-socials">
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1.5em" width="1.5em">
                <path d="M448 56.7v398.5c0 31.4-25.5 56.7-56.7 56.7H56.7C25.3 512 0 486.5 0 455.2V56.7C0 25.3 25.3 0 56.7 0H391.3C422.5 0 448 25.3 448 56.7zM224 255.6h-57.7v127.1H134.8V255.6H102v-43.3h32.8v-25.7c0-32.2 17.4-50.8 52.2-50.8h50.2v43.3h50.8v43.3h-50.8z" />
              </svg>
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1.5em" width="1.5em">
                <path d="M400 32.3C388.1 46 371.4 56 353.2 61.6c18.7-11.2 33-28.8 39.7-49.9-17.6 10.5-37.2 18.2-57.8 22.3C316.4 21 294.1 11.3 270.6 11.3c-44.6 0-80.9 36.4-80.9 81.4 0 6.4.6 12.8 2 18.8-67.2-3.4-126.8-36.4-166.8-87.6-6.8 11.8-10.4 25.5-10.4 40.2 0 28 14.2 52.6 36.4 67.2-13-1.8-25.5-5.4-36.4-10.2v1c0 39.2 27.6 72 64.1 79.2-6.8 1.8-13.6 2.8-21.2 2.8-5 0-10.2-.4-14.8-1 10.2 32 40.2 55.4 75.6 56-27.6 22-62 34.8-100 34.8-6.8 0-13.6-.4-20.4-1.2 35.6 23.2 78 36.4 123.2 36.4 148 0 229.2-122.8 229.2-229.2 0-3.4 0-6.4-.2-9.8 15.8-11.8 30.6-26.8 42-43.4z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
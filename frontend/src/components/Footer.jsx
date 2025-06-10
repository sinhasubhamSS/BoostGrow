import React from "react";
import { Link } from "react-router-dom";
import "./Csscomponents/footer.css"; // Import your CSS for the footer

function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <h2>TaskSync</h2>
          <p>Your personal productivity partner.</p>
        </div>

        {/* Column 2: Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/auth/login">Login</Link></li>
          </ul>
        </div>

        {/* Column 3: Socials */}
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TaskSync. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

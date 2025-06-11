import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Csscomponents/footer.css";

function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); // Go to Homepage
    setTimeout(() => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

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
            <li onClick={handleHomeClick} style={{ cursor: "pointer" }}>
              Home
            </li>
            <li>
              <Link to="/about" style={{ cursor: "pointer" }}>About</Link>
            </li>
            <li>
              <Link to="/#contact" style={{ cursor: "pointer" }}>Contact</Link>
            </li>
            <li>
              <Link to="/logout" style={{ cursor: "pointer" }}>Logout</Link>
            </li>
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

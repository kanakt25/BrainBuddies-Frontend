import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-links">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BrainBuddies: The JNU Orbit. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout(() => {
      closeMenu();       // Close menu on mobile
      navigate('/login'); // Redirect to login page
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src="/logo.png" alt="JNU Orbit Logo" className="navbar-logo-img" />
          <h3 className="navbar-logo-text">BrainBuddies</h3>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
          <Link to="/search" className="navbar-link" onClick={closeMenu}>Find Teachers</Link>

          {!user ? (
            <>
              <Link to="/register" className="navbar-link" onClick={closeMenu}>Register</Link>
              <Link to="/login" className="navbar-link" onClick={closeMenu}>Login</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>Dashboard</Link>
              {/* Add the Chat link here */}
              <Link to="/messages" className="navbar-link" onClick={closeMenu}>Chats</Link>
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

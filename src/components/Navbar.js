import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${theme}-mode`}>
      <div className="navbar-brand">
        <Link to="/" onClick={closeMobileMenu}>WordCounter</Link>
      </div>

      <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <div className="theme-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="slider">
              <span className="sun-icon">☀️</span>
              <span className="moon-icon">🌙</span>
            </span>
          </label>
        </div>

        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

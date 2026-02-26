import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Header.css';

const Header = ({ onLoginClick }) => {
  const { isAuthenticated, user, credits } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-text glitch-text" data-text="NEONDREAM">
            NEONDREAM
          </span>
        </Link>

        {/* Navigation */}
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <Link to="/" className="header__link">Home</Link>
          <Link to="/products" className="header__link">Products</Link>
          <Link to="/plans" className="header__link">Plans</Link>
          <Link to="/about" className="header__link">About</Link>
          <Link to="/contact" className="header__link">Contact</Link>
        </nav>

        {/* User Section */}
        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <div className="header__credits">
                <span className="header__credits-icon">₵</span>
                <span className="header__credits-amount">{credits}</span>
              </div>
              <Link to="/profile" className="header__profile">
                <img src={user?.avatar} alt="User profile" />
              </Link>
            </>
          ) : (
            <button className="header__login-btn" onClick={onLoginClick}>
              <span>Access Terminal</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`header__menu-toggle ${menuOpen ? 'header__menu-toggle--active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

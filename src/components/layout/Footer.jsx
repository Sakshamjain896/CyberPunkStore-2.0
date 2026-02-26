import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__grid"></div>
      <div className="footer__container">
        <div className="footer__section">
          <h4 className="footer__title">NeonDream</h4>
          <p className="footer__text">
            Your gateway to the cyberpunk future. Premium digital goods and experiences.
          </p>
        </div>

        <div className="footer__section">
          <h4 className="footer__title">Quick Links</h4>
          <ul className="footer__links">
            <li><a href="/products">Products</a></li>
            <li><a href="/plans">Plans</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__title">Connect</h4>
          <div className="footer__social">
            <a href="#" className="footer__social-link">Twitter</a>
            <a href="#" className="footer__social-link">Discord</a>
            <a href="#" className="footer__social-link">GitHub</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright terminal-text">
          © {currentYear} NeonDream. All Rights Reserved. System Online.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

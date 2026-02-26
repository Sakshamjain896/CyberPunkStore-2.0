import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import Modal from '../components/ui/Modal';
import EpicButton from '../components/ui/EpicButton';
import './Home.css';

const Home = ({ showLoginModal, setShowLoginModal }) => {
  const { isAuthenticated, user } = useUser();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__content">
          {/* Main Title */}
          <h1 className="home__title cyber-title animate-fade-in-up" data-text="NEONDREAM">
            NEONDREAM
          </h1>

          {/* Subtitle */}
          <p className="home__subtitle animate-fade-in-up delay-200">
            Welcome to the <span className="text-cyber">Future</span> of Digital Commerce
          </p>

          {/* Description */}
          <p className="home__description animate-fade-in-up delay-300">
            Step into a cyberpunk marketplace where cutting-edge technology meets neon-soaked aesthetics.
            Access premium digital goods, exclusive content, and immersive experiences.
          </p>

          {/* CTA Buttons */}
          <div className="home__cta animate-fade-in-up delay-400">
            {isAuthenticated ? (
              <>
                <EpicButton 
                  variant="primary" 
                  size="large" 
                  glitch
                  onClick={() => window.location.href = '/products'}
                >
                  Browse Catalog
                </EpicButton>
                <EpicButton 
                  variant="secondary" 
                  size="large"
                  onClick={() => window.location.href = '/plans'}
                >
                  View Plans
                </EpicButton>
              </>
            ) : (
              <>
                <EpicButton 
                  variant="primary" 
                  size="large" 
                  glitch
                  onClick={() => setShowLoginModal(true)}
                >
                  Access Terminal
                </EpicButton>
                <EpicButton 
                  variant="secondary" 
                  size="large"
                  onClick={() => window.location.href = '/about'}
                >
                  Learn More
                </EpicButton>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="home__stats animate-fade-in-up delay-500">
            <div className="home__stat">
              <div className="home__stat-value">10K+</div>
              <div className="home__stat-label">Users</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-value">500+</div>
              <div className="home__stat-label">Products</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-value">24/7</div>
              <div className="home__stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login/Register Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </div>
  );
};

// Login Modal Component
const LoginModal = ({ isOpen, onClose, isLogin, setIsLogin }) => {
  const { login, register } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      login(formData);
    } else {
      register(formData);
    }
    
    onClose();
    setFormData({ username: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'Terminal Access' : 'Register Account'}
      size="small"
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form__field">
          <label className="login-form__label">Username</label>
          <input
            type="text"
            name="username"
            className="login-form__input"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        {!isLogin && (
          <div className="login-form__field">
            <label className="login-form__label">Email</label>
            <input
              type="email"
              name="email"
              className="login-form__input"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
        )}

        <div className="login-form__field">
          <label className="login-form__label">Password</label>
          <input
            type="password"
            name="password"
            className="login-form__input"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </div>

        <EpicButton type="submit" variant="primary" size="medium" glitch>
          {isLogin ? 'Access System' : 'Create Account'}
        </EpicButton>

        <div className="login-form__toggle">
          <span className="login-form__toggle-text">
            {isLogin ? "Don't have an account?" : 'Already registered?'}
          </span>
          <button
            type="button"
            className="login-form__toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Home;

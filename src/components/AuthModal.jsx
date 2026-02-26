import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signup, hasAccount } = useStore();
  const { playCoinSound, speakSystem } = useAudio();
  
  // Determine initial mode based on whether user has signed up
  const [mode, setMode] = useState(hasAccount ? 'login' : 'signup');

  // Matrix rain effect
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    
    const chars = '01';
    const columns = 15;
    const newChars = [];
    
    for (let i = 0; i < columns; i++) {
      newChars.push({
        id: i,
        chars: Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]),
        offset: Math.random() * 100,
        speed: 2 + Math.random() * 3
      });
    }
    
    setMatrixChars(newChars);
  }, [isOpen]);

  useEffect(() => {
    // Update mode when hasAccount changes
    setMode(hasAccount ? 'login' : 'signup');
  }, [hasAccount]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleAuth = () => {
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Email required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    // Validate password
    if (!password.trim()) {
      setError('Password required');
      return;
    }

    if (mode === 'signup') {
      // Signup validations
      if (!validatePassword(password)) {
        setError('Password must be 8+ chars with uppercase, lowercase & number');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Perform signup
      const btn = document.querySelector('#auth-submit-btn');
      if (btn) btn.innerText = "INITIALIZING...";
      
      setTimeout(() => {
        signup(email, password);
        playCoinSound();
        onClose();
        speakSystem("Neural interface initialized. Welcome to the network, Operative.");
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }, 1500);
    } else {
      // Login
      const btn = document.querySelector('#auth-submit-btn');
      if (btn) btn.innerText = "VERIFYING...";
      
      setTimeout(() => {
        const success = login(email, password);
        if (success) {
          playCoinSound();
          onClose();
          speakSystem("Identity verified. Welcome back, Operative.");
          setEmail('');
          setPassword('');
        } else {
          setError('Invalid credentials');
          if (btn) btn.innerText = mode === 'login' ? 'ESTABLISH LINK' : 'INITIALIZE ID';
        }
      }, 1500);
    }
  };

  const toggleMode = (newMode) => {
    if (!hasAccount && newMode === 'login') {
      setError('No account found. Please initialize first.');
      return;
    }
    
    setMode(newMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    
    gsap.to("#auth-form-container", {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.to("#auth-form-container", { opacity: 1, duration: 0.2 });
      }
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      gsap.to("#auth-overlay", { opacity: 1, duration: 0.3 });
      gsap.to(".auth-box", { scaleY: 1, duration: 0.5, ease: "power4.out" });
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(".auth-box", { scaleY: 0, duration: 0.3, ease: "power4.in" });
    gsap.to("#auth-overlay", {
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <div
      id="auth-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(2, 2, 5, 0.6)',
        backdropFilter: 'blur(15px)',
        zIndex: 3000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
        pointerEvents: 'auto'
      }}
    >
      <div
        className="auth-box"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(10, 15, 20, 0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px',
          position: 'relative',
          transform: 'scaleY(0)',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(0, 242, 255, 0.1)'
        }}
      >
        {/* Matrix Rain Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          opacity: 0.15,
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          {matrixChars.map((column) => (
            <div
              key={column.id}
              style={{
                position: 'absolute',
                top: 0,
                left: `${(column.id / 15) * 100}%`,
                width: '20px',
                height: '100%',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'var(--primary)',
                textShadow: '0 0 5px var(--primary)',
                animation: `matrixFall ${column.speed}s linear infinite`,
                animationDelay: `-${column.offset}s`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {column.chars.map((char, idx) => (
                <div key={idx} style={{ 
                  opacity: 1 - (idx / column.chars.length) * 0.8,
                  marginBottom: '5px'
                }}>
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes matrixFall {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>

        <div style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'var(--primary)',
          boxShadow: '0 0 20px var(--primary)'
        }} />

        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="auth-title" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '5px', color: 'white', marginBottom: '5px' }}>
            ACCESS
          </div>
          <div className="auth-subtitle" style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--primary)' }}>
            SECURE NEURAL LINK
          </div>
        </div>

        <div className="auth-toggle-bar" style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
          <div
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => toggleMode('login')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px',
              cursor: 'pointer',
              fontFamily: 'Space Mono',
              fontSize: '0.8rem',
              color: mode === 'login' ? 'white' : '#666',
              transition: '0.3s',
              borderBottom: mode === 'login' ? '2px solid var(--primary)' : 'none'
            }}
          >
            LOGIN
          </div>
          <div
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => toggleMode('signup')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px',
              cursor: 'pointer',
              fontFamily: 'Space Mono',
              fontSize: '0.8rem',
              color: mode === 'signup' ? 'white' : '#666',
              transition: '0.3s',
              borderBottom: mode === 'signup' ? '2px solid var(--primary)' : 'none'
            }}
          >
            INITIALIZE
          </div>
        </div>

        <div id="auth-form-container" style={{ position: 'relative', zIndex: 1 }}>
          {error && (
            <div style={{
              background: 'rgba(255, 0, 85, 0.1)',
              border: '1px solid #ff0055',
              padding: '12px',
              marginBottom: '20px',
              color: '#ff0055',
              fontSize: '0.75rem',
              fontFamily: 'Space Mono',
              textAlign: 'center',
              letterSpacing: '1px'
            }}>
              ⚠ {error}
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="IDENTITY (EMAIL)" 
            className="auth-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '15px',
              marginBottom: '20px',
              color: 'white',
              outline: 'none',
              fontFamily: 'Space Grotesk',
              transition: '0.3s'
            }} 
          />
          
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="PASSPHRASE" 
              className="auth-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '15px',
                paddingRight: '45px',
                color: 'white',
                outline: 'none',
                fontFamily: 'Space Grotesk',
                transition: '0.3s'

              }} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="interactive"
              style={{
                position: 'absolute',
                right: '12px',
                top: '35%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: showPassword ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '5px',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = showPassword ? 'var(--primary)' : 'rgba(255,255,255,0.4)';
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {mode === 'signup' && (
            <>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="CONFIRM PASSPHRASE" 
                  className="auth-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  style={{
                    width: '100%',
                    top: '35%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '15px',
                    paddingRight: '45px',
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'Space Grotesk',
                    transition: '0.3s'
                  }} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="interactive"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '35%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: showConfirmPassword ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '5px',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = showConfirmPassword ? 'var(--primary)' : 'rgba(255,255,255,0.4)';
                  }}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '20px',
                fontFamily: 'Space Mono',
                lineHeight: '1.6'
              }}>
                • Minimum 8 characters<br/>
                • At least 1 uppercase letter<br/>
                • At least 1 lowercase letter<br/>
                • At least 1 number
              </div>
            </>
          )}
          
          <button 
            id="auth-submit-btn"
            className="epic-btn" 
            style={{ width: '100%', marginTop: '10px' }} 
            onClick={handleAuth}
          >
            {mode === 'login' ? 'ESTABLISH LINK' : 'INITIALIZE ID'}
          </button>
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '0.7rem',
              color: '#666',
              cursor: 'pointer'
            }}
            onClick={handleClose}
          >
            [ CANCEL UPLINK ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';

const Header = ({ onNavigate, onOpenAuth, onOpenSettings, onOpenCart, onOpenProfile }) => {
  const { isLoggedIn, cart, currentTier, tiers } = useStore();
  const { playGlitchSound } = useAudio();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainView = document.getElementById('home-page');
      if (mainView) {
        setScrolled(mainView.scrollTop > 50);
      }
    };

    const mainView = document.getElementById('home-page');
    if (mainView) {
      mainView.addEventListener('scroll', handleScroll);
      return () => mainView.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <header
      className={scrolled ? 'scrolled' : ''}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scrolled ? '15px 5%' : '25px 5%',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: scrolled ? 'rgba(2, 2, 5, 0.75)' : 'rgba(2, 2, 5, 0.0)',
        backdropFilter: scrolled ? 'blur(15px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <div
        className="cyber-logo"
        onClick={() => onNavigate('main-view')}
        onMouseEnter={playGlitchSound}
        style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          letterSpacing: '5px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          position: 'relative',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          className="prefix"
          style={{
            color: 'white',
            textShadow: '0 0 5px var(--primary), 0 0 10px var(--primary), 0 0 20px var(--primary)',
            animation: 'neon-flicker 4s infinite'
          }}
        >
          NEON
        </span>
        <span
          className="suffix"
          style={{
            position: 'relative',
            color: 'transparent',
            WebkitTextStroke: '1px white',
            marginLeft: '2px',
            transition: '0.2s'
          }}
        >
          DREAM
        </span>
      </div>

      <nav id="nav-links" style={{ pointerEvents: 'auto' }}>
        {['main-view', 'products-view', 'plans-view', 'about-view', 'contact-view', 'hacking-view'].map((view, i) => (
          <a
            key={view}
            onClick={() => onNavigate(view)}
            style={{
              color: 'white',
              textDecoration: 'none',
              margin: '0 10px',
              fontSize: '0.7rem',
              letterSpacing: '2px',
              opacity: 0.6,
              transition: '0.3s',
              fontWeight: 700,
              textShadow: '0 0 5px rgba(0,0,0,0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 1;
              e.target.style.color = 'var(--primary)';
              e.target.style.textShadow = '0 0 15px var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0.6;
              e.target.style.color = 'white';
              e.target.style.textShadow = '0 0 5px rgba(0,0,0,0.5)';
            }}
          >
            {['HOME', 'PRODUCTS', 'PLANS', 'ABOUT', 'CONTACT', 'HACK'][i]}
          </a>
        ))}
        {isLoggedIn && (
          <a
            onClick={() => onNavigate('wallet-view')}
            style={{
              color: 'white',
              textDecoration: 'none',
              margin: '0 10px',
              fontSize: '0.7rem',
              letterSpacing: '2px',
              opacity: 0.6,
              transition: '0.3s',
              fontWeight: 700,
              textShadow: '0 0 5px rgba(0,0,0,0.5)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 1;
              e.target.style.color = '#00ff41';
              e.target.style.textShadow = '0 0 15px #00ff41';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0.6;
              e.target.style.color = 'white';
              e.target.style.textShadow = '0 0 5px rgba(0,0,0,0.5)';
            }}
          >
            WALLET
          </a>
        )}
      </nav>

      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'auto' }}>
        {!isLoggedIn ? (
          <button
            className="epic-btn"
            onClick={onOpenAuth}
            style={{ padding: '8px 16px', fontSize: '0.6rem' }}
          >
            LOGIN
          </button>
        ) : (
          <div
            className="profile-icon"
            onClick={onOpenProfile}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, var(--primary), white)',
              transition: 'transform 0.3s',
              display: 'block',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'rotate(90deg) scale(1.1)')}
            onMouseLeave={(e) => (e.target.style.transform = 'rotate(0deg) scale(1)')}
          />
        )}

        <div
          className="config-btn"
          onClick={onOpenSettings}
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: '0.3s',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 15px var(--primary)';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) {
              svg.style.stroke = 'var(--primary)';
              svg.style.transform = 'rotate(90deg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.boxShadow = 'none';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) {
              svg.style.stroke = 'white';
              svg.style.transform = 'rotate(0deg)';
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px', stroke: 'white', transition: '0.3s' }}
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
          </svg>
        </div>

        {/* Tier Badge */}
        {isLoggedIn && currentTier > 0 && (
          <div
            className="interactive"
            onClick={onOpenProfile}
            style={{
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(5px)',
              pointerEvents: 'auto',
              marginRight: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.boxShadow = '0 0 40px var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{tiers[currentTier].badge}</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'Space Grotesk'
            }}>
              {tiers[currentTier].name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

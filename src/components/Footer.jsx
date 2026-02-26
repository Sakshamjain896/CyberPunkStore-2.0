import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
      
      if (Math.random() > 0.8) {
        setPing(Math.floor(Math.random() * (45 - 12) + 12));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      style={{
        flexShrink: 0,
        marginTop: 'auto',
        padding: '20px 5%',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#666',
        fontSize: '0.7rem',
        letterSpacing: '1px',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(2, 2, 5, 0.95)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Space Mono, monospace',
        pointerEvents: 'auto',
        position: 'relative'
      }}
    >
      <div className="footer-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span>&copy; {new Date().getFullYear()} NEON DREAM INC.</span>
        <span style={{ color: 'var(--primary)' }}>|</span>
        <span>
          <div
            className="sys-dot active"
            style={{
              width: '8px',
              height: '8px',
              background: '#00ff41',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px',
              boxShadow: '0 0 10px #00ff41',
              animation: 'pulse 2s infinite'
            }}
          />
          SYSTEM: ONLINE
        </span>
      </div>
      <div className="footer-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span>PING: {ping}ms</span>
        <span style={{ color: 'var(--primary)' }}>|</span>
        <span>{currentTime}</span>
      </div>
    </footer>
  );
};

export default Footer;

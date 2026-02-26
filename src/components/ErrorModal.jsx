import React from 'react';
import gsap from 'gsap';
import { useAudio } from '../hooks/useAudio';

const ErrorModal = ({ isOpen, onClose, requiredAmount }) => {
  const { playErrorSound } = useAudio();

  React.useEffect(() => {
    if (isOpen) {
      playErrorSound();
      gsap.fromTo(
        ".error-window",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1,0.5)" }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(".error-window", {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <div
      id="error-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(15px)'
      }}
    >
      <div
        className="error-window"
        style={{
          width: '90%',
          maxWidth: '500px',
          background: '#0a0000',
          border: '2px solid var(--danger)',
          padding: '40px',
          textAlign: 'center',
          color: 'var(--danger)',
          boxShadow: '0 0 80px rgba(255, 42, 42, 0.3)',
          transform: 'scale(0.8)',
          opacity: 0
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', letterSpacing: '5px' }}>
          SYSTEM FAILURE
        </h1>
        <p style={{ fontFamily: 'Space Mono', color: 'white', marginBottom: '20px' }}>
          INSUFFICIENT CREDITS DETECTED
        </p>
        <div style={{ borderTop: '1px solid var(--danger)', paddingTop: '20px', fontSize: '0.9rem' }}>
          REQUIRED: <span style={{ color: 'white', fontWeight: 'bold' }}>{requiredAmount} CR</span>
        </div>
        <button
          className="epic-btn danger"
          style={{ width: '100%', marginTop: '30px' }}
          onClick={handleClose}
        >
          ACKNOWLEDGE
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, getCartTotal, deductCredits, completePurchase, clearHackDiscount, userCredits } = useStore();
  const { playCoinSound, speakSystem } = useAudio();
  const [showSuccess, setShowSuccess] = useState(false);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (isOpen && !showSuccess) {
      gsap.fromTo(".terminal-window", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
      
      const terminalLines = ["> CONNECTING...", "> APPLYING DISCOUNT...", "> TRANSFERRING...", "> COMPLETE."];
      setLines([]);
      
      const tl = gsap.timeline();
      terminalLines.forEach((line, i) => {
        tl.add(() => {
          playCoinSound();
          setLines(prev => [...prev, line]);
        }, i * 0.8);
      });

      tl.add(() => {
        const { total } = getCartTotal();
        deductCredits(total);
        completePurchase(); // Use completePurchase instead of clearCart to track history
        clearHackDiscount(); // Clear the hack discount after purchase
        setShowSuccess(true);
        speakSystem(`Transaction Verified. Remaining balance ${userCredits - total} credits.`);
      }, "+=0.5");
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowSuccess(false);
    setLines([]);
    onClose();
  };

  if (!isOpen) return null;

  const { total } = getCartTotal();

  return (
    <div
      id="checkout-overlay"
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
        className="terminal-window"
        style={{
          width: '90%',
          maxWidth: '600px',
          background: '#050505',
          border: '1px solid var(--primary)',
          padding: '30px',
          fontFamily: 'Space Mono, monospace',
          color: 'var(--primary)',
          boxShadow: '0 0 60px rgba(0, 242, 255, 0.15)',
          transform: 'scale(0.9)',
          opacity: 0
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #333',
            paddingBottom: '15px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#555',
            fontSize: '0.7rem'
          }}
        >
          <span>SECURE UPLINK NODE</span>
          <span>ID: 884-X</span>
        </div>
        
        <div className="terminal-text" id="terminal-content">
          {lines.map((line, i) => (
            <p key={i} style={{ margin: '8px 0', opacity: 1 }}>{line}</p>
          ))}
        </div>

        {showSuccess && (
          <div
            style={{
              color: '#00ff41',
              fontWeight: 'bold',
              marginTop: '20px',
              borderTop: '1px dashed #333',
              paddingTop: '20px'
            }}
          >
            <span>REMAINING: {userCredits - total} CR</span>
            <br /><br />
            <button className="epic-btn" style={{ width: '100%' }} onClick={handleClose}>
              DISCONNECT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;

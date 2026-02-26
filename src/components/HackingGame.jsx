import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import gsap from 'gsap';

function HackingGame({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('intro'); // intro, playing, success, failed
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedCells, setSelectedCells] = useState([]);
  const [targetSequence, setTargetSequence] = useState([]);
  const [attempts, setAttempts] = useState(3);
  const [reward, setReward] = useState(null);
  const { buyCredits, activateHackDiscount, primaryColor } = useStore();
  const { playCoinSound, playErrorSound, playKeySound, speakSystem } = useAudio();
  const timerRef = useRef(null);

  // Generate random target sequence
  useEffect(() => {
    if (isOpen && gameState === 'intro') {
      const sequence = [];
      for (let i = 0; i < 5; i++) {
        sequence.push(Math.floor(Math.random() * 16));
      }
      setTargetSequence(sequence);
    }
  }, [isOpen, gameState]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver(false);
            return 0;
          }
          if (prev <= 5) {
            playKeySound();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setSelectedCells([]);
    setAttempts(3);
    speakSystem('Hacking initiated. Find the sequence.');
  };

  const handleCellClick = (index) => {
    if (gameState !== 'playing') return;
    
    playKeySound();
    const newSelected = [...selectedCells, index];
    setSelectedCells(newSelected);

    // Check if sequence matches so far
    const isCorrect = newSelected.every((cell, i) => cell === targetSequence[i]);
    
    if (!isCorrect) {
      playErrorSound();
      gsap.to('.grid-cell', {
        backgroundColor: 'rgba(255, 42, 42, 0.3)',
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
      setAttempts(prev => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          handleGameOver(false);
        } else {
          speakSystem(`Incorrect. ${newAttempts} attempts remaining.`);
          setSelectedCells([]);
        }
        return newAttempts;
      });
      return;
    }

    // Check if complete sequence is matched
    if (newSelected.length === targetSequence.length) {
      handleGameOver(true);
    }
  };

  const handleGameOver = (success) => {
    clearInterval(timerRef.current);
    setGameState(success ? 'success' : 'failed');
    
    if (success) {
      // Random reward: either 50% discount or 1000 credits
      const rewardType = Math.random() > 0.5 ? 'discount' : 'credits';
      setReward(rewardType);
      
      if (rewardType === 'credits') {
        buyCredits(1000);
        playCoinSound();
        speakSystem('Access granted. One thousand credits transferred.');
      } else {
        activateHackDiscount();
        playCoinSound();
        speakSystem('Access granted. Fifty percent discount activated.');
      }
      
      gsap.to('.grid-cell', {
        backgroundColor: 'rgba(0, 255, 65, 0.5)',
        scale: 1.1,
        duration: 0.3,
        stagger: 0.05,
        ease: 'elastic.out(1, 0.5)'
      });
    } else {
      playErrorSound();
      speakSystem('Access denied. Security lockdown initiated.');
      gsap.to('.grid-cell', {
        opacity: 0.3,
        duration: 0.5
      });
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setTimeLeft(30);
    setSelectedCells([]);
    setAttempts(3);
    setReward(null);
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      sequence.push(Math.floor(Math.random() * 16));
    }
    setTargetSequence(sequence);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.95)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          style={{
            background: 'var(--glass)',
            border: `2px solid ${primaryColor}`,
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            boxShadow: `0 0 50px ${primaryColor}40`
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ×
          </button>

          {/* Intro State */}
          {gameState === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{
                fontSize: '2.5rem',
                color: primaryColor,
                marginBottom: '20px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: `0 0 20px ${primaryColor}`
              }}>
                HACK THE MAINFRAME
              </h2>
              
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '25px',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                  <span style={{ color: primaryColor }}>► MISSION:</span> Breach the security grid by selecting the correct sequence
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                  <span style={{ color: primaryColor }}>► TIME LIMIT:</span> 30 seconds
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                  <span style={{ color: primaryColor }}>► ATTEMPTS:</span> 3 tries to crack the code
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                  <span style={{ color: '#00ff41' }}>► REWARD:</span> 1000 CR or 50% discount
                </p>
              </div>

              <button
                className="epic-btn"
                onClick={startGame}
                style={{
                  padding: '15px 50px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  letterSpacing: '2px'
                }}
              >
                INITIATE HACK
              </button>
            </motion.div>
          )}

          {/* Playing State */}
          {gameState === 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '30px',
                fontSize: '1.2rem'
              }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>TIME: </span>
                  <span style={{
                    color: timeLeft <= 5 ? 'var(--danger)' : primaryColor,
                    fontFamily: 'Space Mono',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {timeLeft}s
                  </span>
                </div>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>ATTEMPTS: </span>
                  <span style={{
                    color: attempts === 1 ? 'var(--danger)' : '#00ff41',
                    fontFamily: 'Space Mono',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {attempts}
                  </span>
                </div>
              </div>

              {/* Target Sequence Display */}
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: `1px solid ${primaryColor}40`,
                textAlign: 'center'
              }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '10px' }}>
                  SEQUENCE PATTERN
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {targetSequence.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: `2px solid ${selectedCells[i] !== undefined ? '#00ff41' : primaryColor}`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selectedCells[i] !== undefined ? 'rgba(0, 255, 65, 0.2)' : 'transparent',
                        color: selectedCells[i] !== undefined ? '#00ff41' : primaryColor,
                        fontFamily: 'Space Mono',
                        fontSize: '1.2rem',
                        fontWeight: '700'
                      }}
                    >
                      {selectedCells[i] !== undefined ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px'
              }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="grid-cell"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCellClick(i)}
                    style={{
                      aspectRatio: '1',
                      border: selectedCells.includes(i) 
                        ? '2px solid #00ff41' 
                        : `1px solid ${primaryColor}40`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: selectedCells.includes(i) 
                        ? 'rgba(0, 255, 65, 0.2)' 
                        : 'rgba(0, 242, 255, 0.05)',
                      transition: 'all 0.2s',
                      fontFamily: 'Space Mono',
                      fontSize: '1.5rem',
                      color: selectedCells.includes(i) ? '#00ff41' : primaryColor,
                      fontWeight: '700',
                      boxShadow: selectedCells.includes(i) ? '0 0 20px rgba(0, 255, 65, 0.5)' : 'none'
                    }}
                  >
                    {i.toString(16).toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {gameState === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: '5rem',
                  marginBottom: '20px'
                }}
              >
                🎯
              </motion.div>
              
              <h2 style={{
                fontSize: '2.5rem',
                color: '#00ff41',
                marginBottom: '20px',
                fontWeight: '900',
                textShadow: '0 0 20px #00ff41'
              }}>
                ACCESS GRANTED
              </h2>

              <div style={{
                background: 'rgba(0, 255, 65, 0.1)',
                border: '2px solid #00ff41',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '15px' }}>
                  SYSTEM BREACHED SUCCESSFULLY
                </p>
                <p style={{ color: '#00ff41', fontSize: '2rem', fontWeight: '900', fontFamily: 'Space Mono' }}>
                  {reward === 'credits' ? '+1000 CR' : '50% DISCOUNT'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '10px' }}>
                  {reward === 'credits' 
                    ? 'Credits have been transferred to your account' 
                    : 'Discount will be applied to your next purchase'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  className="epic-btn"
                  onClick={resetGame}
                  style={{ padding: '12px 30px' }}
                >
                  HACK AGAIN
                </button>
                <button
                  className="epic-btn"
                  onClick={onClose}
                  style={{
                    padding: '12px 30px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  EXIT
                </button>
              </div>
            </motion.div>
          )}

          {/* Failed State */}
          {gameState === 'failed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                style={{
                  fontSize: '5rem',
                  marginBottom: '20px'
                }}
              >
                🔒
              </motion.div>
              
              <h2 style={{
                fontSize: '2.5rem',
                color: 'var(--danger)',
                marginBottom: '20px',
                fontWeight: '900',
                textShadow: '0 0 20px var(--danger)'
              }}>
                ACCESS DENIED
              </h2>

              <div style={{
                background: 'rgba(255, 42, 42, 0.1)',
                border: '2px solid var(--danger)',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  {attempts === 0 ? 'TOO MANY FAILED ATTEMPTS' : 'TIME EXPIRED'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '15px' }}>
                  Security protocols activated. Try again to breach the system.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  className="epic-btn"
                  onClick={resetGame}
                  style={{ padding: '12px 30px' }}
                >
                  RETRY HACK
                </button>
                <button
                  className="epic-btn"
                  onClick={onClose}
                  style={{
                    padding: '12px 30px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  ABORT
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HackingGame;

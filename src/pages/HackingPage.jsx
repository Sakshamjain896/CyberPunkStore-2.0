import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import gsap from 'gsap';

function HackingPage({ onNavigate }) {
  const [gameState, setGameState] = useState('intro'); // intro, playing, success, failed
  const [timeLeft, setTimeLeft] = useState(60);
  const [moves, setMoves] = useState(0);
  const [puzzle, setPuzzle] = useState([]);
  const [solved, setSolved] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [reward, setReward] = useState(null);
  const [showSparks, setShowSparks] = useState(false);
  const { buyCredits, activateHackDiscount, primaryColor, isLoggedIn } = useStore();
  const { playCoinSound, playErrorSound, playKeySound, speakSystem } = useAudio();
  const timerRef = useRef(null);

  // Shuffle puzzle
  const shufflePuzzle = () => {
    let shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Perform 100 random valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(9);
      const possibleMoves = [];
      if (emptyIndex % 3 !== 0) possibleMoves.push(emptyIndex - 1); // left
      if (emptyIndex % 3 !== 2) possibleMoves.push(emptyIndex + 1); // right
      if (emptyIndex >= 3) possibleMoves.push(emptyIndex - 3); // up
      if (emptyIndex < 6) possibleMoves.push(emptyIndex + 3); // down
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    return shuffled;
  };

  // Initialize puzzle
  useEffect(() => {
    if (gameState === 'intro') {
      setPuzzle(shufflePuzzle());
      setMoves(0);
    }
  }, [gameState]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver(false);
            return 0;
          }
          if (prev <= 10) {
            playKeySound();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  // Check if puzzle is solved
  useEffect(() => {
    if (gameState === 'playing' && JSON.stringify(puzzle) === JSON.stringify(solved)) {
      handleGameOver(true);
    }
  }, [puzzle, gameState]);

  const startGame = () => {
    if (!isLoggedIn) {
      speakSystem('Access denied. Login required.');
      playErrorSound();
      return;
    }
    
    setPuzzle(shufflePuzzle());
    setGameState('playing');
    setTimeLeft(60);
    setMoves(0);
    speakSystem('Security puzzle activated. Solve to breach system.');
  };

  const handleTileClick = (index) => {
    if (gameState !== 'playing') return;
    
    const emptyIndex = puzzle.indexOf(9);
    const clickedValue = puzzle[index];
    
    // Check if clicked tile is adjacent to empty space
    const isAdjacent = (
      (index === emptyIndex - 1 && emptyIndex % 3 !== 0) || // left
      (index === emptyIndex + 1 && emptyIndex % 3 !== 2) || // right
      (index === emptyIndex - 3) || // up
      (index === emptyIndex + 3)    // down
    );
    
    if (!isAdjacent) {
      playErrorSound();
      gsap.to(`#tile-${index}`, {
        x: [0, -5, 5, -5, 5, 0],
        duration: 0.4,
        ease: 'power2.inOut'
      });
      return;
    }
    
    // Swap tiles
    playKeySound();
    const newPuzzle = [...puzzle];
    [newPuzzle[emptyIndex], newPuzzle[index]] = [newPuzzle[index], newPuzzle[emptyIndex]];
    setPuzzle(newPuzzle);
    setMoves(prev => prev + 1);
    
    gsap.fromTo(`#tile-${index}`,
      { scale: 1.1 },
      { scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
    );
  };

  const handleGameOver = (success) => {
    if (gameState === 'success' || gameState === 'failed') return; // Prevent duplicate calls
    
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
      // Only trigger failure effects - close minigame without logging out
      playErrorSound();
      speakSystem('Access denied. Security breach failed.');
      gsap.to('.grid-cell', {
        backgroundColor: 'rgba(255, 0, 85, 0.3)',
        opacity: 0.5,
        duration: 0.5
      });

      // Show sparks effect
      setTimeout(() => {
        setShowSparks(true);
        playErrorSound();
        
        // Shake the container
        gsap.to('.game-container', {
          x: [-10, 10, -10, 10, -5, 5, 0],
          y: [-5, 5, -5, 5, 0],
          duration: 0.6,
          ease: 'power2.inOut'
        });
      }, 1000);

      // Close the minigame after showing effects (no logout, no blackout)
      setTimeout(() => {
        onNavigate('main-view');
      }, 3000);
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setTimeLeft(60);
    setMoves(0);
    setReward(null);
    setPuzzle(shufflePuzzle());
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px',
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'relative'
    }}>
      {/* Back Button */}
      <button
        onClick={() => onNavigate('main-view')}
        style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontFamily: 'Space Mono',
          borderRadius: '4px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = primaryColor;
          e.target.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.3)';
          e.target.style.color = 'white';
        }}
      >
        ← BACK
      </button>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(2, 2, 5, 0.9)',
        border: `2px solid ${primaryColor}`,
        borderRadius: '12px',
        padding: '40px',
        boxShadow: `0 0 50px ${primaryColor}40`,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="game-container"
      >
        {/* Sparks Effect */}
        <AnimatePresence>
          {showSparks && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    ease: 'easeOut'
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: Math.random() * 8 + 4 + 'px',
                    height: Math.random() * 8 + 4 + 'px',
                    background: i % 3 === 0 ? '#ff0055' : i % 3 === 1 ? '#ffaa00' : 'var(--primary)',
                    borderRadius: '50%',
                    boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                />
              ))}
              {/* Electric arcs */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`arc-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0, 1, 0],
                    scaleX: [0.8, 1.2, 0.9, 1.1, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1
                  }}
                  style={{
                    position: 'absolute',
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    boxShadow: '0 0 10px var(--primary)',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

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
                <span style={{ color: primaryColor }}>► MISSION:</span> Solve the 9-piece sliding puzzle
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                <span style={{ color: primaryColor }}>► OBJECTIVE:</span> Arrange numbers 1-8 in order (9 is empty space)
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                <span style={{ color: primaryColor }}>► CONTROLS:</span> Click tiles adjacent to empty space
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '15px' }}>
                <span style={{ color: primaryColor }}>► TIME LIMIT:</span> 60 seconds
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
              {isLoggedIn ? 'INITIATE HACK' : 'LOGIN REQUIRED'}
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
                  color: timeLeft <= 10 ? 'var(--danger)' : primaryColor,
                  fontFamily: 'Space Mono',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {timeLeft}s
                </span>
              </div>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>MOVES: </span>
                <span style={{
                  color: '#00ff41',
                  fontFamily: 'Space Mono',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {moves}
                </span>
              </div>
            </div>

            {/* Puzzle Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              maxWidth: '400px',
              margin: '0 auto',
              padding: '20px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: `2px solid ${primaryColor}40`
            }}>
              {puzzle.map((value, index) => (
                <motion.div
                  key={`${index}-${value}`}
                  id={`tile-${index}`}
                  whileHover={value !== 9 ? { scale: 1.05 } : {}}
                  whileTap={value !== 9 ? { scale: 0.95 } : {}}
                  onClick={() => handleTileClick(index)}
                  style={{
                    aspectRatio: '1',
                    border: value === 9 ? 'none' : `2px solid ${primaryColor}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: value === 9 ? 'default' : 'pointer',
                    background: value === 9 
                      ? 'transparent' 
                      : value === solved[index]
                        ? 'rgba(0, 255, 65, 0.15)'
                        : 'rgba(0, 242, 255, 0.1)',
                    transition: 'all 0.2s',
                    fontFamily: 'Space Mono',
                    fontSize: '2.5rem',
                    color: value === 9 ? 'transparent' : primaryColor,
                    fontWeight: '900',
                    boxShadow: value === 9 ? 'none' : `0 0 20px ${primaryColor}30`,
                    textShadow: value === 9 ? 'none' : `0 0 10px ${primaryColor}`
                  }}
                >
                  {value === 9 ? '' : value}
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
              PUZZLE SOLVED
            </h2>

            <div style={{
              background: 'rgba(0, 255, 65, 0.1)',
              border: '2px solid #00ff41',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '15px' }}>
                SYSTEM BREACHED IN {moves} MOVES
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
                SOLVE AGAIN
              </button>
              <button
                className="epic-btn"
                onClick={() => onNavigate('main-view')}
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
              TIME EXPIRED
            </h2>

            <div style={{
              background: 'rgba(255, 42, 42, 0.1)',
              border: '2px solid var(--danger)',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '10px' }}>
                PUZZLE INCOMPLETE
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginTop: '15px' }}>
                You made {moves} moves but ran out of time.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '10px' }}>
                Security protocols activated. Try again to breach the system.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                className="epic-btn"
                onClick={resetGame}
                style={{ padding: '12px 30px' }}
              >
                RETRY PUZZLE
              </button>
              <button
                className="epic-btn"
                onClick={() => onNavigate('main-view')}
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
      </div>
    </div>
  );
}

export default HackingPage;

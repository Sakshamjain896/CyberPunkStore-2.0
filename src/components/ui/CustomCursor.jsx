import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // 1. Track Mouse Position
  useEffect(() => {
    const moveCursor = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if we are hovering over a clickable element
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.interactive') // Add this class to interactive divs
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  return (
    <>
      {/* MAIN CURSOR (The Dot) - Moves Instantly */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      >
        <div style={{
          width: '8px', height: '8px',
          background: 'var(--primary)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px var(--primary)'
        }} />
      </div>

      {/* OUTER RING (The Reticle) - Has Physics Lag */}
      <motion.div
        animate={{
          x: mousePos.x - 20, // Center the 40px div
          y: mousePos.y - 20,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          rotate: isHovering ? 90 : 0, // Spin when hovering
          borderColor: isClicking ? '#ff2a2a' : 'var(--primary)',
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5 // Makes it feel light and snappy
        }}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '40px', height: '40px',
          border: '1px solid var(--primary)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference' // Cool inversion effect over white text
        }}
      >
        {/* CROSSHAIR DECORATIONS */}
        {isHovering && (
          <>
            <div style={{
              position: 'absolute', top: '50%', left: '-10px', 
              width: '60px', height: '1px', background: 'var(--primary)',
              opacity: 0.5,
              transform: 'translateY(-50%)'
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '-10px', 
              height: '60px', width: '1px', background: 'var(--primary)',
              opacity: 0.5,
              transform: 'translateX(-50%)'
            }} />
          </>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;

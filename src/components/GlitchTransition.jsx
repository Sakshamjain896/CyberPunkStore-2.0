import React from 'react';
import { motion } from 'framer-motion';

const GlitchTransition = ({ children }) => {
  const glitchVariants = {
    initial: {
      opacity: 0,
      x: 0,
      y: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // Random glitch positions for multiple layers
  const glitchOffset1 = Math.random() * 40 - 20;
  const glitchOffset2 = Math.random() * 40 - 20;
  const glitchOffset3 = Math.random() * 40 - 20;

  return (
    <motion.div
      variants={glitchVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Main content with corrupted stream effect */}
      <motion.div
        animate={{
          // Glitch tear effect
          x: [0, glitchOffset1, 0, glitchOffset2, 0, glitchOffset3, 0],
          skewX: [0, 5, 0, -5, 0, 3, 0],
          // RGB channel split
          filter: [
            'contrast(1) brightness(1)',
            'contrast(1.5) brightness(1.2) saturate(1.5)',
            'contrast(1) brightness(1)',
            'contrast(1.3) brightness(0.9) saturate(1.3)',
            'contrast(1) brightness(1)'
          ]
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
          ease: 'easeInOut'
        }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* RGB Split layers */}
        <motion.div
          animate={{
            x: [-3, 3, -2, 2, 0],
            opacity: [0.8, 0.9, 0.8, 0.9, 0]
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, rgba(0, 242, 255, 0.3) 0%, transparent 100%)',
            zIndex: 1
          }}
        />
        
        <motion.div
          animate={{
            x: [3, -3, 2, -2, 0],
            opacity: [0.8, 0.9, 0.8, 0.9, 0]
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 85, 0.3) 100%)',
            zIndex: 1
          }}
        />

        {/* Horizontal scan lines glitch */}
        <motion.div
          animate={{
            y: ['0%', '100%', '0%'],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.5, 1],
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(0, 242, 255, 0.8)',
            boxShadow: '0 0 10px rgba(0, 242, 255, 0.8)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Vertical tear lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.05,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: `${20 + i * 15}%`,
              width: '2px',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.3)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Digital noise blocks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`noise-${i}`}
            animate={{
              opacity: [0, 0.8, 0, 0.6, 0],
              x: [Math.random() * 100 - 50, 0],
              y: [Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.04,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              width: `${20 + Math.random() * 60}px`,
              height: `${5 + Math.random() * 15}px`,
              background: `rgba(${Math.random() > 0.5 ? '0, 242, 255' : '255, 0, 85'}, 0.6)`,
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Corrupted pixel effect */}
        <motion.div
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [1, 1.02, 1, 1.01, 1]
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.2, 0.4, 0.7, 1]
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 242, 255, 0.03) 2px,
              rgba(0, 242, 255, 0.03) 4px
            )`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Main content */}
        <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlitchTransition;

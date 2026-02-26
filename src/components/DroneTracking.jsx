import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const DroneTracking = ({ order, onClose }) => {
  const { currentTier } = useStore();
  const [scanlinePos, setScanlinePos] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanlinePos(prev => (prev + 1) % 100);
    }, 50);

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  // Generate drone ID from order timestamp
  const droneId = `DRN-${String(order.timestamp).slice(-3)}`;
  
  // Calculate ETA based on tier
  const getETA = () => {
    if (currentTier === 2) return '6 hours';
    if (currentTier === 1) return '1 day';
    return '2-3 days';
  };

  const getStatus = () => {
    if (currentTier === 2) return 'PRIORITY VECTOR | STEALTH MODE ACTIVE';
    if (currentTier === 1) return 'FAST-TRACK ROUTE | EVASION MODE ENABLED';
    return 'STANDARD ROUTE | LOW-ALTITUDE FLIGHT';
  };

  // Random coordinates for visual effect
  const [coords] = useState({
    lat: (Math.random() * 40 + 30).toFixed(6),
    lon: (Math.random() * 40 - 100).toFixed(6)
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          background: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#fff',
              fontFamily: 'Space Grotesk',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '5px'
            }}>
              DRONE SURVEILLANCE FEED
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--primary)',
              fontFamily: 'Space Mono',
              letterSpacing: '1px'
            }}>
              LIVE TRACKING SYSTEM // ACCESS GRANTED
            </div>
          </div>
          <button
            className="interactive"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              fontFamily: 'Space Mono'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
          >
            ×
          </button>
        </div>

        {/* Satellite Map View */}
        <div style={{
          position: 'relative',
          height: '400px',
          background: '#1a1a1a',
          overflow: 'hidden',
          filter: glitchActive ? 'contrast(1.2) brightness(1.1)' : 'none'
        }}>
          {/* Grainy overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
            `,
            pointerEvents: 'none',
            opacity: 0.3
          }} />

          {/* Scanline */}
          <div style={{
            position: 'absolute',
            top: `${scanlinePos}%`,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            boxShadow: '0 0 10px var(--primary)',
            pointerEvents: 'none'
          }} />

          {/* Grid overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0, 242, 255, 0.1) 49px, rgba(0, 242, 255, 0.1) 50px),
              repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0, 242, 255, 0.1) 49px, rgba(0, 242, 255, 0.1) 50px)
            `,
            pointerEvents: 'none'
          }} />

          {/* Simulated map terrain */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '40%',
            height: '60%',
            background: 'rgba(255, 255, 255, 0.05)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 90% 70%, 50% 100%, 10% 80%, 0% 40%)',
            filter: 'blur(2px)'
          }} />

          {/* Drone marker */}
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'var(--primary)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              boxShadow: '0 0 20px var(--primary)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                border: '1px solid var(--primary)',
                borderRadius: '50%',
                animation: 'radarPing 2s infinite'
              }} />
            </div>
          </div>

          {/* Coordinates overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontFamily: 'Space Mono',
            fontSize: '0.7rem',
            color: 'var(--primary)',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '8px 12px',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            letterSpacing: '1px'
          }}>
            LAT: {coords.lat} / LON: {coords.lon}
          </div>

          {/* Timestamp */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontFamily: 'Space Mono',
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.5)',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            letterSpacing: '1px'
          }}>
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>

        {/* Status Panel */}
        <div style={{
          padding: '25px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderTop: '1px solid rgba(0, 242, 255, 0.3)'
        }}>
          {/* Drone ID */}
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'Space Grotesk',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              UNIT ID
            </div>
            <div style={{
              fontSize: '1.2rem',
              color: 'var(--primary)',
              fontFamily: 'Space Mono',
              fontWeight: '700',
              letterSpacing: '3px'
            }}>
              {droneId}
            </div>
            <div style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              background: 'rgba(0, 255, 65, 0.1)',
              border: '1px solid #00ff41',
              color: '#00ff41',
              fontSize: '0.65rem',
              fontFamily: 'Space Grotesk',
              fontWeight: '700',
              letterSpacing: '2px'
            }}>
              ACTIVE
            </div>
          </div>

          {/* Status */}
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'Space Grotesk',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              STATUS
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#fff',
              fontFamily: 'Space Mono',
              letterSpacing: '1px',
              lineHeight: '1.6'
            }}>
              {getStatus()}
            </div>
          </div>

          {/* ETA */}
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'Space Grotesk',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              ESTIMATED TIME OF ARRIVAL
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--primary)',
              fontFamily: 'Space Mono',
              fontWeight: '700',
              letterSpacing: '2px'
            }}>
              {getETA()}
            </div>
          </div>

          {/* Cargo Details */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'Space Grotesk',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              CARGO MANIFEST
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              fontFamily: 'Space Mono',
              fontSize: '0.75rem'
            }}>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes radarPing {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DroneTracking;

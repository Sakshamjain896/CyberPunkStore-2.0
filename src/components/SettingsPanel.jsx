import React from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { scanlinesActive, setScanlinesActive, lowPowerMode, setLowPowerMode, setTheme, primaryColor } = useStore();
  const { playCoinSound } = useAudio();

  const toggleScanlines = () => {
    setScanlinesActive(!scanlinesActive);
    playCoinSound();
  };

  const toggleLowPower = () => {
    setLowPowerMode(!lowPowerMode);
    playCoinSound();
  };

  const handleThemeChange = (color) => {
    setTheme(color);
    playCoinSound();
  };

  const themes = [
    { color: '#00f2ff', name: 'NIGHT CITY', desc: 'Classic neon cyan' },
    { color: '#ff0055', name: 'BLADE RUNNER', desc: 'Red district glow' },
    { color: '#bd00ff', name: 'AKIRA', desc: 'Neo-Tokyo purple' },
    { color: '#00ff41', name: 'MATRIX', desc: 'Digital rain green' },
    { color: '#ff6b00', name: 'GHOST SHELL', desc: 'Thermal orange' },
    { color: '#ffff00', name: 'NEUROMANCER', desc: 'Data stream yellow' }
  ];

  React.useEffect(() => {
    if (isOpen) {
      gsap.to("#profile-panel", { right: "0%", duration: 0.5, ease: "expo.out" });
    } else {
      gsap.to("#profile-panel", { right: "-100%", duration: 0.5, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div
      id="profile-panel"
      className="side-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: '-100%',
        width: '450px',
        maxWidth: '100vw',
        height: '100%',
        zIndex: 2000,
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#030305',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        borderLeft: '1px solid var(--primary)',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="panel-close"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'white',
          zIndex: 3
        }}
      >
        X
      </div>

      <h2 style={{ color: 'white', letterSpacing: '4px', marginBottom: '30px' }}>SYSTEM CONFIG</h2>

      <div className="setting-group" style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <h4 style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          VISUALS
        </h4>

        <div className="toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontFamily: 'Space Mono', fontSize: '0.8rem', color: 'white' }}>
          <span>CRT SCANLINES</span>
          <div
            className={`toggle-switch ${scanlinesActive ? 'active' : ''}`}
            onClick={toggleScanlines}
            style={{
              position: 'relative',
              width: '40px',
              height: '20px',
              background: scanlinesActive ? 'var(--primary)' : '#333',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            <div
              style={{
                content: '',
                position: 'absolute',
                top: '2px',
                left: scanlinesActive ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: scanlinesActive ? 'black' : 'white',
                borderRadius: '50%',
                transition: '0.3s'
              }}
            />
          </div>
        </div>

        <div className="toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontFamily: 'Space Mono', fontSize: '0.8rem', color: 'white' }}>
          <span>LOW POWER MODE</span>
          <div
            className={`toggle-switch ${lowPowerMode ? 'active' : ''}`}
            onClick={toggleLowPower}
            style={{
              position: 'relative',
              width: '40px',
              height: '20px',
              background: lowPowerMode ? 'var(--primary)' : '#333',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            <div
              style={{
                content: '',
                position: 'absolute',
                top: '2px',
                left: lowPowerMode ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: lowPowerMode ? 'black' : 'white',
                borderRadius: '50%',
                transition: '0.3s'
              }}
            />
          </div>
        </div>

        <label style={{ fontSize: '0.7rem', color: '#666', display: 'block', marginTop: '15px', marginBottom: '5px', fontFamily: 'Space Mono' }}>
          COLOR GRADING PRESET
        </label>
        <div className="theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '10px' }}>
          {themes.map((theme) => (
            <div
              key={theme.color}
              className={`theme-option ${primaryColor === theme.color ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme.color)}
              style={{
                background: primaryColor === theme.color ? theme.color : 'rgba(255,255,255,0.03)',
                border: `1px solid ${primaryColor === theme.color ? theme.color : 'rgba(255,255,255,0.1)'}`,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
                transition: '0.3s',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: primaryColor === theme.color ? `0 0 20px ${theme.color}` : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="t-preview"
                  style={{
                    width: '10px',
                    height: '10px',
                    background: primaryColor === theme.color ? 'black' : theme.color,
                    boxShadow: primaryColor === theme.color ? 'none' : `0 0 10px ${theme.color}`,
                    flexShrink: 0
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Space Mono',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                    color: primaryColor === theme.color ? 'black' : 'white',
                    fontWeight: primaryColor === theme.color ? 900 : 700
                  }}
                >
                  {theme.name}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'Space Mono',
                  fontSize: '0.6rem',
                  color: primaryColor === theme.color ? 'rgba(0,0,0,0.7)' : '#666',
                  lineHeight: '1.3'
                }}
              >
                {theme.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="epic-btn danger"
        style={{ width: '100%', marginTop: '20px' }}
        onClick={() => window.location.reload()}
      >
        SYSTEM PURGE (RESET)
      </button>
    </div>
  );
};

export default SettingsPanel;

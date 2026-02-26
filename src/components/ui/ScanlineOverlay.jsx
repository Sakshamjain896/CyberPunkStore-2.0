import React from 'react';
import { useApp } from '../../context/AppContext';
import './ScanlineOverlay.css';

const ScanlineOverlay = () => {
  const { showScanlines } = useApp();

  if (!showScanlines) return null;

  return (
    <div className="scanline-overlay">
      <div className="scanline"></div>
    </div>
  );
};

export default ScanlineOverlay;

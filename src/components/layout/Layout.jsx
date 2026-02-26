import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SceneContainer from '../three/SceneContainer';
import ScanlineOverlay from '../ui/ScanlineOverlay';
import './Layout.css';

const Layout = ({ children, onLoginClick, showBackground = true }) => {
  return (
    <div className="layout">
      {showBackground && <SceneContainer />}
      <ScanlineOverlay />
      
      <div className="layout__content">
        <Header onLoginClick={onLoginClick} />
        <main className="layout__main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

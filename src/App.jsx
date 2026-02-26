import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider, useStore } from './context/StoreContext';
import ThreeScene from './components/ThreeScene';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SettingsPanel from './components/SettingsPanel';
import CartPanel from './components/CartPanel';
import GlitchTransition from './components/GlitchTransition';
import CustomCursor from './components/ui/CustomCursor';
import AIAssistant from './components/AIAssistant';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import PlansPage from './pages/PlansPage';
import WalletPage from './pages/WalletPage';
import HackingPage from './pages/HackingPage';

function AppContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState('main-view');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { scanlinesActive } = useStore();

  const handleEnterApp = () => {
    setShowLanding(false);
    // Open auth modal after entering
    setTimeout(() => setShowAuthModal(true), 500);
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  const handleNavigate = (view) => {
    if (activeView === view) return;
    
    const currentEl = document.getElementById(activeView + '-container');
    const nextEl = document.getElementById(view + '-container');
    
    if (currentEl) {
      currentEl.style.opacity = '0';
      setTimeout(() => {
        currentEl.style.display = 'none';
        if (nextEl) {
          nextEl.style.display = 'block';
          setTimeout(() => {
            nextEl.style.opacity = '1';
          }, 50);
        }
      }, 300);
    }
    
    setActiveView(view);
    
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.scrollTop = 0;
  };

  return (
    <>
      <ThreeScene activeView={activeView} />
      
      <div
        className={`scanlines ${scanlinesActive ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: scanlinesActive ? 1 : 0,
          transition: 'opacity 0.5s'
        }}
      />

      <div
        id="home-page"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          opacity: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth'
        }}
      >
        <Header
          onNavigate={handleNavigate}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenCart={() => setShowCart(true)}
          onOpenProfile={() => handleNavigate('profile-view')}
        />

        <main
          id="main-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'block',
            opacity: 1,
            flex: 1,
            position: 'relative'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'main-view' && (
              <GlitchTransition key="main-view">
                <HomePage onNavigate={handleNavigate} />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="products-view-container"
          style={{
            padding: '40px 5%',
            paddingTop: '120px',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'products-view' && (
              <GlitchTransition key="products-view">
                <ProductsPage onOpenCart={() => setShowCart(true)} />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="plans-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'plans-view' && (
              <GlitchTransition key="plans-view">
                <PlansPage onNavigate={handleNavigate} />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="about-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'about-view' && (
              <GlitchTransition key="about-view">
                <AboutPage />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="contact-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'contact-view' && (
              <GlitchTransition key="contact-view">
                <ContactPage />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="profile-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'profile-view' && (
              <GlitchTransition key="profile-view">
                <ProfilePage />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="wallet-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'wallet-view' && (
              <GlitchTransition key="wallet-view">
                <WalletPage />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <main
          id="hacking-view-container"
          style={{
            padding: '0',
            paddingTop: '0',
            width: '100%',
            display: 'none',
            opacity: 0,
            flex: 1,
            position: 'relative',
            transition: 'opacity 0.3s'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'hacking-view' && (
              <GlitchTransition key="hacking-view">
                <HackingPage onNavigate={handleNavigate} />
              </GlitchTransition>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <CustomCursor />
      <AIAssistant />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <CartPanel isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;

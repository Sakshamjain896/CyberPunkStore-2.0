import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import './CyberApp.css';

const CyberApp = () => {
  const containerRef = useRef(null);
  const { isAuthenticated, user, credits, login, register, logout, cart, addToCart, removeFromCart, cartTotal, deductCredits, addCredits } = useUser();
  const { showScanlines } = useApp();

  useEffect(() => {
    // Expose React state to vanilla JS
    window.reactState = {
      isLoggedIn: isAuthenticated,
      userCredits: credits,
      cart: cart,
      addToCart: (productId) => {
        const products = window.productsData || [];
        const product = products.find(p => p.id === productId);
        if (product) addToCart(product);
      },
      removeFromCart: (index) => {
        if (cart[index]) removeFromCart(cart[index].id);
      },
      login: (userData) => login(userData),
      logout: () => logout(),
      deductCredits: (amount) => deductCredits(amount),
      addCredits: (amount) => addCredits(amount)
    };

    // Load GSAP
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    gsapScript.async = true;
    document.head.appendChild(gsapScript);

    // Initialize app after GSAP loads
    gsapScript.onload = () => {
      initializeCyberApp();
    };

    return () => {
      // Cleanup
      if (gsapScript.parentNode) {
        gsapScript.parentNode.removeChild(gsapScript);
      }
    };
  }, []);

  // Sync React state changes to vanilla JS
  useEffect(() => {
    if (window.reactState) {
      window.reactState.isLoggedIn = isAuthenticated;
      window.reactState.userCredits = credits;
      window.reactState.cart = cart;
      
      // Update UI elements
      const creditElements = document.querySelectorAll('[data-credits]');
      creditElements.forEach(el => {
        el.textContent = `${credits} CR`;
      });

      const cartCount = document.getElementById('cart-count');
      if (cartCount) cartCount.textContent = cart.length;
    }
  }, [isAuthenticated, credits, cart]);

  const initializeCyberApp = () => {
    // This function will be called after GSAP loads
    // The vanilla JS code will be executed here
    console.log('Cyber App Initialized');
  };

  return (
    <div ref={containerRef} id="cyber-app-container">
      <div className={`scanlines ${showScanlines ? 'active' : ''}`} id="scanline-layer"></div>
      
      {/* The main content will be rendered here via vanilla JS */}
      <div id="home-page">
        {/* Placeholder - will be populated by vanilla JS */}
      </div>
    </div>
  );
};

export default CyberApp;

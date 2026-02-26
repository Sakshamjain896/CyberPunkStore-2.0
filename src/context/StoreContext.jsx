import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCredits, setUserCredits] = useState(5000);
  const [cart, setCart] = useState([]);
  const [currentTier, setCurrentTier] = useState(0);
  const [scanlinesActive, setScanlinesActive] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#00f2ff');
  const [hackDiscountActive, setHackDiscountActive] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [hasAccount, setHasAccount] = useState(false);

  // Check if user has an account on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cyberpunk_user');
    if (storedUser) {
      setHasAccount(true);
      // Load user data if they were logged in
      const userData = JSON.parse(localStorage.getItem('cyberpunk_session') || '{}');
      if (userData.isLoggedIn) {
        setIsLoggedIn(true);
        setUserCredits(userData.credits || 5000);
        setCurrentTier(userData.tier || 0);
        setPurchaseHistory(userData.purchaseHistory || []);
      }
    }
  }, []);

  // Save session data when important state changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('cyberpunk_session', JSON.stringify({
        isLoggedIn,
        credits: userCredits,
        tier: currentTier,
        purchaseHistory
      }));
    }
  }, [isLoggedIn, userCredits, currentTier, purchaseHistory]);

  const tiers = [
    { name: "NEOPHYTE", cost: 0, discount: 0, perks: ["Ads Included", "Standard Marketplace"], badge: null },
    { name: "OPERATIVE", cost: 29, discount: 0.05, perks: ["No System Ads", "5% Discount", "Priority Uplink"], badge: "⚡" },
    { name: "ARCHITECT", cost: 99, discount: 0.20, perks: ["No System Ads", "20% Discount", "AI Assistant", "Admin Clearance"], badge: "" }
  ];

  const products = [
    // Standard Products (All Tiers)
    // HARDWARE
    { id: 1, type: 'hardware', name: "NEURAL JACK MK3", price: "2400 CR", desc: "High-speed neural interface port.", minTier: 0 },
    { id: 2, type: 'hardware', name: "OPTIC IMPLANT X7", price: "3200 CR", desc: "Enhanced vision with AR overlay.", minTier: 0 },
    { id: 3, type: 'hardware', name: "SUBDERMAL RFID CHIP", price: "890 CR", desc: "Biometric access chip implant.", minTier: 0 },
    { id: 4, type: 'hardware', name: "SMARTGUN LINK", price: "4500 CR", desc: "Weapon targeting interface.", minTier: 0 },
    { id: 5, type: 'hardware', name: "BIOMONITOR V2", price: "1200 CR", desc: "Real-time health diagnostics.", minTier: 0 },
    { id: 6, type: 'hardware', name: "SYNAPSE ACCELERATOR", price: "5400 CR", desc: "Reaction time enhancement chip.", minTier: 0 },
    { id: 7, type: 'hardware', name: "DERMAL ARMOR WEAVE", price: "6800 CR", desc: "Ballistic-resistant skin layer.", minTier: 0 },
    { id: 8, type: 'hardware', name: "REFLEX BOOSTER", price: "4200 CR", desc: "Neural reflex amplifier.", minTier: 0 },
    { id: 9, type: 'hardware', name: "CYBER-ARM PROSTHETIC", price: "9800 CR", desc: "Military-grade arm replacement.", minTier: 0 },
    { id: 10, type: 'hardware', name: "MEMORY EXPANSION CHIP", price: "2100 CR", desc: "32TB neural storage implant.", minTier: 0 },
    { id: 11, type: 'hardware', name: "THERMAL OPTICS MOD", price: "3700 CR", desc: "Infrared vision enhancement.", minTier: 0 },
    { id: 12, type: 'hardware', name: "ADRENALINE REGULATOR", price: "5900 CR", desc: "Combat performance booster.", minTier: 0 },
    
    // SOFTWARE
    { id: 13, type: 'software', name: "CORTEX OS v8.4", price: "5000 CR", desc: "Neural operating system core.", minTier: 0 },
    { id: 14, type: 'software', name: "GHOST PROTOCOL SUITE", price: "8000 CR", desc: "Anonymous network routing.", minTier: 0 },
    { id: 15, type: 'software', name: "FIREWALL DAEMON PRO", price: "3800 CR", desc: "ICE breach protection system.", minTier: 0 },
    { id: 16, type: 'software', name: "DECRYPT MATRIX TOOLKIT", price: "7500 CR", desc: "AI-powered decryption suite.", minTier: 0 },
    { id: 17, type: 'software', name: "VOICE SYNTH MODULE", price: "1600 CR", desc: "Real-time voice modulation.", minTier: 0 },
    { id: 18, type: 'software', name: "NETRUNNER PRO SUITE", price: "12000 CR", desc: "Professional hacking framework.", minTier: 0 },
    { id: 19, type: 'software', name: "TRACKER KILLER v3", price: "2700 CR", desc: "Anti-surveillance software.", minTier: 0 },
    { id: 20, type: 'software', name: "DATACRYPT SECURE", price: "4400 CR", desc: "Military-grade encryption.", minTier: 0 },
    
    // OPERATIVE Exclusive Products (Beta Access)
    { id: 21, type: 'hardware', name: "COMBAT AI PROCESSOR β", price: "7800 CR", desc: "[BETA] Tactical combat AI implant.", minTier: 1, exclusive: true },
    { id: 22, type: 'software', name: "STEALTH CLOAK SYSTEM β", price: "9200 CR", desc: "[BETA] Advanced digital cloaking.", minTier: 1, exclusive: true },
    { id: 23, type: 'hardware', name: "TITAN SKELETON FRAME", price: "15000 CR", desc: "[OPERATIVE] Reinforced endoskeleton.", minTier: 1, exclusive: true },
    
    // ARCHITECT Exclusive Products (Premium)
    { id: 24, type: 'hardware', name: "QUANTUM NEURAL CORE", price: "25000 CR", desc: "[ARCHITECT] Quantum computing brain implant.", minTier: 2, exclusive: true },
    { id: 25, type: 'software', name: "OMNINET BLACK ACCESS", price: "30000 CR", desc: "[ARCHITECT] Unrestricted darknet access.", minTier: 2, exclusive: true },
    { id: 26, type: 'hardware', name: "FULL-DIVE INTERFACE", price: "35000 CR", desc: "[ARCHITECT] Complete consciousness digitization.", minTier: 2, exclusive: true }
  ];

  const parsePrice = (s) => parseInt(s.replace(/[^0-9]/g, ''));

  const addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const buyCredits = (amount) => {
    setUserCredits(prev => prev + amount);
  };

  const deductCredits = (amount) => {
    if (userCredits >= amount) {
      setUserCredits(prev => prev - amount);
      return true;
    }
    return false;
  };

  const clearCart = () => {
    setCart([]);
  };

  const completePurchase = () => {
    const purchase = {
      items: [...cart],
      timestamp: Date.now(),
      total: getCartTotal().total,
      tier: currentTier
    };
    setPurchaseHistory([purchase, ...purchaseHistory]);
    clearCart();
  };

  const signup = (email, password) => {
    // Hash password (simple encoding for demo - use proper hashing in production)
    const encodedPassword = btoa(password);
    
    // Store user credentials
    localStorage.setItem('cyberpunk_user', JSON.stringify({
      email,
      password: encodedPassword
    }));
    
    setHasAccount(true);
    setIsLoggedIn(true);
    
    // Initialize session
    localStorage.setItem('cyberpunk_session', JSON.stringify({
      isLoggedIn: true,
      credits: 5000,
      tier: 0,
      purchaseHistory: []
    }));
  };

  const login = (email, password) => {
    const storedUser = localStorage.getItem('cyberpunk_user');
    
    if (!storedUser) {
      return false;
    }
    
    const user = JSON.parse(storedUser);
    const encodedPassword = btoa(password);
    
    if (user.email === email && user.password === encodedPassword) {
      setIsLoggedIn(true);
      
      // Load saved session data
      const sessionData = JSON.parse(localStorage.getItem('cyberpunk_session') || '{}');
      setUserCredits(sessionData.credits || 5000);
      setCurrentTier(sessionData.tier || 0);
      setPurchaseHistory(sessionData.purchaseHistory || []);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCart([]);
    
    // Update session
    const sessionData = JSON.parse(localStorage.getItem('cyberpunk_session') || '{}');
    localStorage.setItem('cyberpunk_session', JSON.stringify({
      ...sessionData,
      isLoggedIn: false
    }));
  };

  const activatePlan = (tierIndex) => {
    const cost = tiers[tierIndex].cost;
    if (deductCredits(cost)) {
      setCurrentTier(tierIndex);
      return true;
    }
    return false;
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
    let discount = Math.floor(subtotal * tiers[currentTier].discount);
    
    // Add 50% hack discount if active
    if (hackDiscountActive) {
      discount = Math.floor(subtotal * 0.5);
    }
    
    return { subtotal, discount, total: subtotal - discount };
  };

  const setTheme = (color) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--primary', color);
  };

  const activateHackDiscount = () => {
    setHackDiscountActive(true);
  };

  const clearHackDiscount = () => {
    setHackDiscountActive(false);
  };

  const value = {
    isLoggedIn,
    userCredits,
    cart,
    currentTier,
    tiers,
    products,
    scanlinesActive,
    lowPowerMode,
    primaryColor,
    hackDiscountActive,
    purchaseHistory,
    hasAccount,
    addToCart,
    removeFromCart,
    buyCredits,
    deductCredits,
    clearCart,
    completePurchase,
    signup,
    login,
    logout,
    activatePlan,
    getCartTotal,
    parsePrice,
    setScanlinesActive,
    setLowPowerMode,
    setTheme,
    activateHackDiscount,
    clearHackDiscount
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

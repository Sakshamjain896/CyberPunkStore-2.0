import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('neondream_user');
    const storedCredits = localStorage.getItem('neondream_credits');
    const storedCart = localStorage.getItem('neondream_cart');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedCredits) {
      setCredits(Number(storedCredits));
    }
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Login function
  const login = (userData) => {
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      joinedDate: new Date().toISOString(),
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setCredits(1000); // Welcome bonus

    // Persist to localStorage
    localStorage.setItem('neondream_user', JSON.stringify(newUser));
    localStorage.setItem('neondream_credits', '1000');

    return newUser;
  };

  // Register function
  const register = (userData) => {
    return login(userData); // For demo, register acts like login
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCredits(0);
    setCart([]);

    // Clear localStorage
    localStorage.removeItem('neondream_user');
    localStorage.removeItem('neondream_credits');
    localStorage.removeItem('neondream_cart');
  };

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('neondream_cart', JSON.stringify(newCart));
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('neondream_cart', JSON.stringify(newCart));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('neondream_cart', JSON.stringify(newCart));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('neondream_cart');
  };

  // Add credits
  const addCredits = (amount) => {
    const newCredits = credits + amount;
    setCredits(newCredits);
    localStorage.setItem('neondream_credits', newCredits.toString());
  };

  // Deduct credits
  const deductCredits = (amount) => {
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      localStorage.setItem('neondream_credits', newCredits.toString());
      return true;
    }
    return false;
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    user,
    credits,
    cart,
    isAuthenticated,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addCredits,
    deductCredits,
    cartTotal,
    cartItemCount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

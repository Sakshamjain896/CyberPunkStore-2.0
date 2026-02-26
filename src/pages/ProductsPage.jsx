import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import AuthModal from '../components/AuthModal';

const ProductsPage = ({ onOpenCart }) => {
  const { products, addToCart, isLoggedIn, cart, currentTier, tiers } = useStore();
  const { playCoinSound } = useAudio();
  const [filter, setFilter] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleAddToCart = (id) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    const product = products.find(p => p.id === id);
    
    // Check tier requirement
    if (product.minTier > currentTier) {
      setNotification(`Requires ${tiers[product.minTier].name} tier or higher`);
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    
    addToCart(id);
    playCoinSound();
    
    // Show notification
    setNotification(`${product.name} added to cart`);
    setTimeout(() => setNotification(null), 2000);
    
    gsap.from("#cart-count", { scale: 2, duration: 0.3 });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    gsap.fromTo(
      ".product-modal",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3 }
    );
  };

  const closeModal = () => {
    gsap.to(".product-modal", {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      onComplete: () => setSelectedProduct(null)
    });
  };

  const handleFilter = (type) => {
    setFilter(type);
    gsap.fromTo(
      ".product-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
    );
  };

  const filteredProducts = filter === 'exclusive' 
    ? products.filter(p => p.exclusive) 
    : filter === 'all' 
    ? products 
    : products.filter(p => p.type === filter);

  // Filter products by tier access
  const accessibleProducts = filteredProducts.filter(p => (p.minTier || 0) <= currentTier);
  const lockedProducts = filteredProducts.filter(p => (p.minTier || 0) > currentTier);

  const getProductDetails = (product) => {
    const details = {
      hardware: {
        manufacturer: ['MILITECH', 'ARASAKA', 'KANG TAO', 'ZETATECH'][Math.floor(Math.random() * 4)],
        warranty: '2 YEARS',
        compatibility: 'NEURAL PORT 2.0+',
        installTime: '2-4 HOURS'
      },
      software: {
        version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
        license: 'LIFETIME',
        updates: 'AUTOMATIC',
        requirements: 'CORTEX OS 5.0+'
      }
    };
    return details[product.type] || details.hardware;
  };

  return (
    <div className="page-container" style={{
      padding: '40px 5%',
      paddingTop: '120px',
      width: '100%',
      display: 'block',
      opacity: 1,
      flex: 1,
      position: 'relative'
    }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '900',
          color: '#fff',
          marginBottom: '15px',
          letterSpacing: '8px',
          textTransform: 'uppercase',
          textShadow: `0 0 20px var(--primary), 0 0 40px var(--primary)`,
          animation: 'neon-flicker 3s infinite'
        }}>
          <span style={{ color: 'var(--primary)' }}>CYBER</span> MARKETPLACE
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'Space Mono',
          letterSpacing: '3px'
        }}>
          // AUGMENTATIONS & SOFTWARE UPGRADES
        </p>
      </div>

      <div className="filter-bar" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '50px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button className="epic-btn" onClick={() => handleFilter('all')}>ALL</button>
        <button className="epic-btn" onClick={() => handleFilter('hardware')}>HARDWARE</button>
        <button className="epic-btn" onClick={() => handleFilter('software')}>SOFTWARE</button>
        <button
          className="epic-btn"
          onClick={onOpenCart}
          style={{
            marginLeft: '30px',
            borderColor: 'var(--primary)',
            color: 'var(--primary)'
          }}
        >
          CART [<span id="cart-count">{cart.length}</span>]
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'rgba(0, 242, 255, 0.2)',
          border: '1px solid var(--primary)',
          padding: '15px 25px',
          borderRadius: '0',
          color: 'var(--primary)',
          fontFamily: 'Space Mono',
          fontSize: '0.9rem',
          zIndex: 10000,
          boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)',
          animation: 'slideInRight 0.3s ease'
        }}>
          {notification}
        </div>
      )}

      {/* Tier Benefits Banner for paid tiers */}
      {isLoggedIn && currentTier >= 1 && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 40px',
          padding: '15px 25px',
          background: currentTier === 2 ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 242, 255, 0.1)',
          border: `1px solid ${currentTier === 2 ? '#ff0055' : 'var(--primary)'}`,
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: 'Space Mono',
            fontSize: '0.9rem',
            color: currentTier === 2 ? '#ff0055' : 'var(--primary)'
          }}>
            🔓 TIER UNLOCKED: Access to exclusive {tiers[currentTier].name} products
          </div>
        )}
  
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '40px',
        paddingBottom: '100px',
        width: '100%'
      }}>
        {/* Accessible Products */}
        {accessibleProducts.map((product) => (
          <div
            key={product.id}
            className="product-card interactive"
            style={{
              position: 'relative',
              background: product.exclusive ? 'rgba(255, 0, 85, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              border: product.exclusive ? '1px solid rgba(255, 0, 85, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
              padding: '30px',
              borderRadius: '0px',
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
              transition: 'all 0.3s'
            }}
            onClick={() => handleProductClick(product)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = product.exclusive ? '#ff0055' : 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = product.exclusive ? '0 10px 30px rgba(255, 0, 85, 0.3)' : '0 10px 30px rgba(0, 242, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = product.exclusive ? 'rgba(255, 0, 85, 0.3)' : 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Exclusive Badge */}
            {product.exclusive && (
              <div style={{
                position: 'absolute',
                top: '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: 'black',
                padding: '5px 15px',
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk',
                zIndex: 10
              }}>
                {product.minTier === 2 ? 'ARCHITECT' : 'OPERATIVE'}
              </div>
  )}
            {/* Type Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              fontSize: '0.6rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 700,
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'Space Grotesk'
            }}>
              {product.type}
            </div>

            <div
              className="price-tag"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.7rem',
                color: 'black',
                background: 'var(--primary)',
                fontWeight: 700,
                padding: '5px 15px',
                transform: 'translateZ(40px)'
              }}
            >
              {product.price}
            </div>
            <div className="card-inner" style={{
              transform: 'translateZ(30px)',
              pointerEvents: 'none',
              position: 'relative',
              zIndex: 1
            }}>
              <h4
                className="hacker-text"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '1.4rem',
                  marginBottom: '10px',
                  color: 'white',
                  letterSpacing: '-1px',
                  fontWeight: 700
                }}
              >
                {product.name}
              </h4>
        <div
          className="tech-line"
          style={{
                  width: '20px',
                  height: '3px',
                  background: 'var(--primary)',
                  margin: '15px 0'
                }}
              />
              <p>{product.desc}</p>
              <button
                className="epic-btn interactive"
                style={{ width: '100%', pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
              >
                ACQUIRE
              </button>
            </div>
          </div>
        ))}

        {/* Locked Products */}
        {lockedProducts.length > 0 && lockedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '0px',
              cursor: 'not-allowed',
              opacity: 0.5,
              filter: 'grayscale(1)',
              transformStyle: 'preserve-3d',
              transition: 'all 0.3s'
            }}
          >
            {/* Lock Icon */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '4rem',
              opacity: 0.3,
              zIndex: 10
            }}>
              🔒
            </div>

            {/* Tier Required Badge */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '5px 15px',
              fontSize: '0.7rem',
              fontWeight: '900',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: 'Space Grotesk',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 10
            }}>
              {tiers[product.minTier].name}
            </div>

            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              fontSize: '0.6rem',
              color: 'rgba(255, 255, 255, 0.3)',
              fontWeight: 700,
              padding: '3px 10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              {product.type}
            </div>

            <div
              className="price-tag"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.7rem',
                color: 'black',
                background: 'rgba(255, 255, 255, 0.3)',
                fontWeight: 700,
                padding: '5px 15px',
                transform: 'translateZ(40px)'
              }}
            >
              {product.price}
            </div>

            <div style={{
              transform: 'translateZ(30px)',
              pointerEvents: 'none',
              position: 'relative',
              zIndex: 1
            }}>
              <h4
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '1.4rem',
                  marginBottom: '10px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '-1px',
                  fontWeight: 700
                }}
              >
                {product.name}
              </h4>
              <div
                style={{
                  width: '20px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  margin: '15px 0'
                }}
              />
                <p style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{product.desc}</p>
              </div>
            </div>
          ))}
        </div>
  
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div
            className="product-modal"
            style={{
              background: 'rgba(10, 10, 10, 0.98)',
              border: '2px solid var(--primary)',
              maxWidth: '600px',
              width: '100%',
              padding: '40px',
              position: 'relative',
              boxShadow: '0 0 50px rgba(0, 242, 255, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="interactive"
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '2rem',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              ×
            </button>

            {/* Type Badge */}
            <div style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              color: 'var(--primary)',
              fontWeight: 700,
              padding: '5px 15px',
              border: '1px solid var(--primary)',
              letterSpacing: '3px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              {selectedProduct.type}
            </div>

            {/* Product Name */}
            <h2 style={{
              fontSize: '2.5rem',
              color: 'white',
              marginBottom: '10px',
              fontFamily: 'Space Mono',
              letterSpacing: '-1px',
              textShadow: '0 0 10px var(--primary)'
            }}>
              {selectedProduct.name}
            </h2>

            {/* Description */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              {selectedProduct.desc}
            </p>

            {/* Divider */}
            <div style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
              marginBottom: '30px'
            }} />

            {/* Technical Specs */}
            <div style={{
              background: 'rgba(0, 242, 255, 0.05)',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                color: 'var(--primary)',
                fontSize: '0.9rem',
                letterSpacing: '3px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}>
                TECHNICAL SPECIFICATIONS
              </h3>
              {Object.entries(getProductDetails(selectedProduct)).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  fontFamily: 'Space Mono',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ color: 'white' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Price and Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                fontSize: '2rem',
                color: 'var(--primary)',
                fontWeight: '900',
                fontFamily: 'Space Mono',
                textShadow: '0 0 10px var(--primary)'
              }}>
                {selectedProduct.price}
              </div>
              <button
                className="epic-btn interactive"
                style={{ flex: 1 }}
                onClick={() => {
                  handleAddToCart(selectedProduct.id);
                  closeModal();
                }}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default ProductsPage;

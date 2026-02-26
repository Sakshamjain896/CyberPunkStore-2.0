import React, { useState } from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import ErrorModal from './ErrorModal';
import CheckoutModal from './CheckoutModal';

const CartPanel = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, getCartTotal, userCredits, hackDiscountActive, currentTier, tiers } = useStore();
  const [showError, setShowError] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [errorAmount, setErrorAmount] = useState(0);

  const getDeliveryInfo = () => {
    switch(currentTier) {
      case 2:
        return { speed: 'SAME-DAY', color: '#ff0055', icon: '⚡' };
      case 1:
        return { speed: 'FAST-TRACK', color: 'var(--primary)', icon: '🚀' };
      default:
        return { speed: 'STANDARD', color: 'rgba(255, 255, 255, 0.5)', icon: '📦' };
    }
  };

  const deliveryInfo = getDeliveryInfo();

  React.useEffect(() => {
    if (isOpen) {
      gsap.to("#cart-panel", { right: "0%", duration: 0.5, ease: "expo.out" });
    } else {
      gsap.to("#cart-panel", { right: "-100%", duration: 0.5, ease: "power2.in" });
    }
  }, [isOpen]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("EMPTY");
      return;
    }

    const { total } = getCartTotal();
    if (userCredits < total) {
      setErrorAmount(total);
      setShowError(true);
      return;
    }

    onClose();
    setShowCheckout(true);
  };

  const { subtotal, discount, total } = getCartTotal();

  return (
    <>
      <div
        id="cart-panel"
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

        <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>DATABASE</h3>

        <div id="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ color: '#444', padding: '20px', textAlign: 'center' }}>EMPTY</div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="cart-item"
                  style={{
                    padding: '15px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>{item.name}</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: 'var(--primary)' }}>{item.price}</span>
                    <span
                      className="cart-remove"
                      onClick={() => removeFromCart(index)}
                      style={{
                        color: '#ff2a2a',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        paddingLeft: '10px',
                        opacity: 0.7,
                        pointerEvents: 'auto'
                      }}
                    >
                      [X]
                    </span>
                  </div>
                </div>
              ))}

              {discount > 0 && (
                <>
                  <div
                    className="cart-discount-line"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#00ff41',
                      fontFamily: 'Space Mono',
                      fontSize: '0.8rem',
                      marginTop: '10px'
                    }}
                  >
                    <span>SUBTOTAL</span>
                    <span>{subtotal} CR</span>
                  </div>
                  <div
                    className="cart-discount-line"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: hackDiscountActive ? '#ff0055' : '#00ff41',
                      fontFamily: 'Space Mono',
                      fontSize: '0.8rem',
                      marginTop: '10px',
                      fontWeight: hackDiscountActive ? '700' : '400',
                      textShadow: hackDiscountActive ? '0 0 10px #ff0055' : 'none'
                    }}
                  >
                    <span>{hackDiscountActive ? '⚡ HACK DISCOUNT (50%)' : `TIER DISCOUNT (${(discount / subtotal * 100).toFixed(0)}%)`}</span>
                    <span>-{discount} CR</span>
                  </div>
                </>
              )}

              {/* Delivery Speed Badge */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  background: `${deliveryInfo.color}15`,
                  border: `1px solid ${deliveryInfo.color}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{deliveryInfo.icon}</span>
                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Delivery Speed
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: deliveryInfo.color,
                    fontWeight: '700',
                    fontFamily: 'Space Mono'
                  }}>
                    {deliveryInfo.speed}
                  </div>
                </div>
              </div>

              <div
                className="cart-total"
                style={{
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '2px dashed var(--primary)',
                  fontSize: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  fontFamily: 'Space Mono, monospace'
                }}
              >
                <span>TOTAL</span>
                <span>{total} CR</span>
              </div>
            </>
          )}
        </div>

        <button
          className="epic-btn"
          style={{ width: '100%', borderColor: 'var(--primary)', marginTop: '20px' }}
          onClick={handleCheckout}
        >
          INITIATE TRANSFER
        </button>
      </div>

      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        requiredAmount={errorAmount}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
};

export default CartPanel;

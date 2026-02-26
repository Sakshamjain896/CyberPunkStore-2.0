import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import gsap from 'gsap';

function WalletPage() {
  const { isLoggedIn, userCredits, buyCredits } = useStore();
  const { playCoinSound, speakSystem } = useAudio();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    gsap.fromTo('.credit-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' }
    );
  }, []);

  const creditPackages = [
    { name: 'STARTER', amount: 1000, price: '$4.99', color: '#888' },
    { name: 'RUNNER', amount: 5000, price: '$19.99', color: 'var(--primary)', bonus: '+500 BONUS' },
    { name: 'WHALE', amount: 20000, price: '$69.99', color: '#ff0055', bonus: '+5000 BONUS' }
  ];

  const handlePurchase = (amount, packageName) => {
    if (!isLoggedIn) {
      speakSystem('Login required.');
      return;
    }

    setProcessing(true);
    speakSystem('Processing payment...');

    setTimeout(() => {
      buyCredits(amount);
      playCoinSound();
      speakSystem(`${amount.toLocaleString()} credits added.`);
      
      // Animate the credit balance
      gsap.fromTo('.credit-balance',
        { scale: 1.3, color: '#00ff41' },
        { scale: 1, color: 'var(--primary)', duration: 0.6, ease: 'elastic.out(1, 0.5)' }
      );
      
      setProcessing(false);
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div id="wallet-view" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--primary)' }}>
            ACCESS DENIED
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Login required to access wallet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="wallet-view" style={{
      height: '100vh',
      overflowY: 'auto',
      padding: '120px 20px 80px'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="page-title" style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '20px',
          color: 'var(--primary)',
          textAlign: 'center'
        }}>
          CREDIT WALLET
        </h1>

        {/* Current Balance */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '40px',
          background: 'var(--glass)',
          border: '2px solid var(--primary)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            CURRENT BALANCE
          </div>
          <div
            className="credit-balance"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '900',
              color: 'var(--primary)',
              fontFamily: 'Space Mono',
              textShadow: '0 0 20px rgba(0, 242, 255, 0.5)'
            }}
          >
            {userCredits.toLocaleString()} CR
          </div>
        </div>

        <h2 style={{
          fontSize: '1.8rem',
          marginBottom: '30px',
          color: '#fff',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          PURCHASE CREDITS
        </h2>

        {/* Credit Packages */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {creditPackages.map((pkg, index) => (
            <div
              key={index}
              className="credit-card"
              style={{
                background: 'var(--glass)',
                border: `2px solid ${pkg.color}`,
                borderRadius: '12px',
                padding: '40px 30px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 10px 40px ${pkg.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {pkg.bonus && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#00ff41',
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>
                  {pkg.bonus}
                </div>
              )}

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: pkg.color,
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {pkg.name}
              </h3>

              <div style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: '#fff',
                marginBottom: '10px',
                fontFamily: 'Space Mono'
              }}>
                {pkg.amount.toLocaleString()}
              </div>

              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '30px'
              }}>
                CREDITS
              </div>

              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: '30px'
              }}>
                {pkg.price}
              </div>

              <button
                className="epic-btn"
                onClick={() => handlePurchase(pkg.amount, pkg.name)}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  opacity: processing ? 0.5 : 1,
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                {processing ? 'PROCESSING...' : 'PURCHASE'}
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          padding: '40px',
          background: 'var(--glass)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            marginBottom: '20px',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ABOUT CREDITS
          </h3>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.8',
            fontSize: '0.95rem'
          }}>
            <p style={{ marginBottom: '15px' }}>
              • Credits are the primary currency used in NEON DREAM marketplace
            </p>
            <p style={{ marginBottom: '15px' }}>
              • All purchases are processed securely through encrypted channels
            </p>
            <p style={{ marginBottom: '15px' }}>
              • Bonus credits are added automatically for RUNNER and WHALE packages
            </p>
            <p style={{ marginBottom: '15px' }}>
              • Credits never expire and can be used across all products
            </p>
            <p style={{ marginBottom: '15px' }}>
              • Subscription tier discounts apply automatically at checkout
            </p>
            <p>
              • For bulk purchases or custom packages, contact support
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div style={{
          marginTop: '40px',
          padding: '40px',
          background: 'var(--glass)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            marginBottom: '20px',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            TRANSACTION HISTORY
          </h3>
          <div style={{
            fontFamily: 'Space Mono',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '2'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span>2026-02-01 14:23:05</span>
              <span style={{ color: '#00ff41' }}>+5,000 CR</span>
              <span>Initial deposit</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span>2026-01-28 09:15:32</span>
              <span style={{ color: 'var(--danger)' }}>-2,400 CR</span>
              <span>Product purchase</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span>2026-01-15 18:47:21</span>
              <span style={{ color: 'var(--danger)' }}>-29 CR</span>
              <span>OPERATIVE tier upgrade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;

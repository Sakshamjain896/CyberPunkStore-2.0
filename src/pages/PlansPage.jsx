import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import gsap from 'gsap';

function PlansPage({ onNavigate }) {
  const { tiers, currentTier, isLoggedIn, activatePlan } = useStore();
  const { playCoinSound, playErrorSound, speakSystem } = useAudio();

  useEffect(() => {
    gsap.fromTo('.tier-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );
  }, []);

  const handleActivate = (tierIndex) => {
    if (!isLoggedIn) {
      playErrorSound();
      speakSystem('Login required.');
      return;
    }

    if (tierIndex <= currentTier) {
      playErrorSound();
      speakSystem('Already at this tier or higher.');
      return;
    }

    const success = activatePlan(tierIndex);
    if (success) {
      playCoinSound();
      speakSystem(`${tiers[tierIndex].name} tier activated.`);
    } else {
      playErrorSound();
      speakSystem('Insufficient credits.');
    }
  };

  return (
    <div id="plans-view" style={{
      height: '100vh',
      overflowY: 'auto',
      padding: '120px 20px 80px'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 className="page-title" style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '20px',
          color: 'var(--primary)',
          textAlign: 'center'
        }}>
          SUBSCRIPTION TIERS
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px'
        }}>
          Upgrade your access level for exclusive benefits and discounts
        </p>

        {isLoggedIn && (
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            padding: '20px',
            background: 'rgba(0, 242, 255, 0.1)',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '5px', fontWeight: '700', letterSpacing: '1px' }}>
              CURRENT TIER
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
              {tiers[currentTier].name}
            </div>
            {tiers[currentTier].discount > 0 && (
              <div style={{ fontSize: '1rem', color: '#00ff41', fontWeight: '700' }}>
                🎉 Active: {(tiers[currentTier].discount * 100).toFixed(0)}% Discount on All Purchases
              </div>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            padding: '20px',
            background: 'rgba(255, 42, 42, 0.1)',
            border: '1px solid rgba(255, 42, 42, 0.3)',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            <div style={{ fontSize: '1rem', color: '#ff2a2a', fontWeight: '700' }}>
              ⚠ Please login to activate subscription tiers
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          padding: '20px 0'
        }}>
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="tier-card"
              style={{
                background: 'var(--glass)',
                border: currentTier === index ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '40px 30px',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: currentTier === index ? '0 0 30px rgba(0, 242, 255, 0.3)' : 'none',
                transform: currentTier === index ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {currentTier === index && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--primary)',
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>
                  CURRENT TIER
                </div>
              )}

              <div style={{
                textAlign: 'center',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: index === 0 ? '#888' : index === 1 ? 'var(--primary)' : '#ff0055',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {tier.name}
                </h3>

                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#fff',
                  marginBottom: '10px'
                }}>
                  {tier.cost === 0 ? 'FREE' : `${tier.cost} CR`}
                </div>

                {tier.discount > 0 && (
                  <div style={{
                    fontSize: '1.2rem',
                    color: '#00ff41',
                    fontWeight: '700'
                  }}>
                    {tier.discount}% DISCOUNT
                  </div>
                )}
              </div>

              <div style={{
                marginBottom: '30px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '2.2'
                }}>
                  {index === 0 && (
                    <>
                      <div style={{ marginBottom: '8px' }}>✓ Access to product catalog</div>
                      <div style={{ marginBottom: '8px' }}>✓ Standard support</div>
                      <div style={{ marginBottom: '8px' }}>✓ Basic features</div>
                      <div style={{ marginBottom: '8px' }}>✓ Community forum access</div>
                      <div style={{ marginBottom: '8px' }}>✓ View pricing & product details</div>
                      <div style={{ opacity: 0.4, marginBottom: '8px' }}>✗ No discounts</div>
                      <div style={{ opacity: 0.4, marginBottom: '8px' }}>✗ No priority support</div>
                      <div style={{ opacity: 0.4, marginBottom: '8px' }}>✗ Standard delivery only</div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div style={{ color: '#00ff41', fontWeight: '600', marginBottom: '8px' }}>✓ 5% discount on all products</div>
                      <div style={{ marginBottom: '8px' }}>✓ Priority support (24h response)</div>
                      <div style={{ marginBottom: '8px' }}>✓ Early access to new items</div>
                      <div style={{ marginBottom: '8px' }}>✓ Exclusive OPERATIVE badge</div>
                      <div style={{ marginBottom: '8px' }}>✓ Monthly product updates</div>
                      <div style={{ marginBottom: '8px' }}>✓ Private Discord channel</div>
                      <div style={{ marginBottom: '8px' }}>✓ Fast-track delivery</div>
                      <div style={{ marginBottom: '8px' }}>✓ Beta feature access</div>
                      <div style={{ marginBottom: '8px' }}>✓ No marketplace ads</div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div style={{ color: '#00ff41', fontWeight: '700', marginBottom: '8px' }}>✓ 20% discount on all products</div>
                      <div style={{ marginBottom: '8px' }}>✓ VIP support 24/7 (instant)</div>
                      <div style={{ marginBottom: '8px' }}>✓ First access to beta products</div>
                      <div style={{ marginBottom: '8px' }}>✓ AI Assistant enabled</div>
                      <div style={{ marginBottom: '8px' }}>✓ Exclusive ARCHITECT badge</div>
                      <div style={{ marginBottom: '8px' }}>✓ Private community access</div>
                      <div style={{ marginBottom: '8px' }}>✓ Custom product requests</div>
                      <div style={{ marginBottom: '8px' }}>✓ Quarterly strategy calls</div>
                      <div style={{ marginBottom: '8px' }}>✓ Premium delivery (same-day)</div>
                      <div style={{ marginBottom: '8px' }}>✓ API access for integrations</div>
                      <div style={{ marginBottom: '8px' }}>✓ Advanced analytics dashboard</div>
                      <div style={{ marginBottom: '8px' }}>✓ White-glove onboarding</div>
                    </>
                  )}
                </div>
              </div>

              <button
                className="epic-btn"
                onClick={() => handleActivate(index)}
                disabled={currentTier >= index}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  opacity: currentTier >= index ? 0.5 : 1,
                  cursor: currentTier >= index ? 'not-allowed' : 'pointer'
                }}
              >
                {currentTier === index ? 'CURRENT TIER' : currentTier > index ? 'TIER UNLOCKED' : tier.cost === 0 ? 'DEFAULT TIER' : 'ACTIVATE'}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '80px',
          padding: '40px',
          background: 'var(--glass)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            color: 'var(--primary)'
          }}>
            NEED MORE CREDITS?
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '20px'
          }}>
            Visit the Wallet page to purchase additional credits
          </p>
          <button
            className="epic-btn"
            onClick={() => onNavigate && onNavigate('wallet-view')}
            style={{
              padding: '12px 40px',
              fontSize: '0.9rem'
            }}
          >
            GO TO WALLET
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;

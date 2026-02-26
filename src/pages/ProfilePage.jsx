import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import DroneTracking from '../components/DroneTracking';
import gsap from 'gsap';

function ProfilePage() {
  const { isLoggedIn, userCredits, currentTier, tiers, cart, purchaseHistory } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    gsap.fromTo('.profile-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
  }, []);

  if (!isLoggedIn) {
    return (
      <div id="profile-view" style={{ 
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
            Login required to view profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-view" style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      padding: '120px 20px 80px'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '60px',
          color: 'var(--primary)'
        }}>
          USER PROFILE
        </h1>

        {/* User Info Card */}
        <div className="profile-card" style={{
          background: 'var(--glass)',
          border: '1px solid var(--primary)',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 0 20px rgba(0, 242, 255, 0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                USER ID
              </div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'Space Mono', color: 'var(--primary)' }}>
                USR-{Math.floor(Math.random() * 999999).toString().padStart(6, '0')}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                CREDIT BALANCE
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ff41' }}>
                {userCredits.toLocaleString()} CR
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                CURRENT TIER
              </div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: '700', 
                color: currentTier === 0 ? '#888' : currentTier === 1 ? '#00f2ff' : '#ff0055',
                textTransform: 'uppercase'
              }}>
                {tiers[currentTier].name}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                DISCOUNT RATE
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                {tiers[currentTier].discount}%
              </div>
            </div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="profile-card" style={{
          background: 'var(--glass)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)' }}>
            TIER BENEFITS
          </h2>
          <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
            {currentTier === 0 && (
              <>
                <p>• Standard access to product catalog</p>
                <p>• Basic customer support</p>
                <p>• Upgrade available to OPERATIVE tier</p>
              </>
            )}
            {currentTier === 1 && (
              <>
                <p>• 5% discount on all purchases</p>
                <p>• Priority customer support</p>
                <p>• Early access to new products</p>
                <p>• Exclusive OPERATIVE badge</p>
              </>
            )}
            {currentTier === 2 && (
              <>
                <p>• 20% discount on all purchases</p>
                <p>• VIP customer support 24/7</p>
                <p>• First access to beta products</p>
                <p>• AI Assistant enabled</p>
                <p>• Exclusive ARCHITECT badge</p>
                <p>• Private community access</p>
              </>
            )}
          </div>
        </div>

        {/* Analytics Dashboard - ARCHITECT Exclusive */}
        {currentTier >= 2 && (
          <div className="profile-card" style={{ marginTop: '30px' }}>
            <AnalyticsDashboard />
          </div>
        )}

        {/* Tier Benefits Section */}
        {currentTier > 0 && (
          <div className="profile-card" style={{
            background: currentTier === 2 ? 'rgba(255, 0, 85, 0.05)' : 'rgba(0, 242, 255, 0.05)',
            border: `2px solid ${currentTier === 2 ? '#ff0055' : 'var(--primary)'}`,
            borderRadius: '8px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '20px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ 
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '3px',
                padding: '5px 15px',
                background: 'var(--primary)',
                color: 'black',
                fontFamily: 'Space Grotesk'
              }}>{tiers[currentTier].name}</span>
              BENEFITS ACTIVE
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              fontFamily: 'Space Mono',
              fontSize: '0.9rem'
            }}>
              {currentTier === 1 && (
                <>
                  <div style={{ color: '#00ff41' }}>✓ 5% discount on all products</div>
                  <div style={{ color: '#00ff41' }}>✓ Access to BETA products</div>
                  <div style={{ color: '#00ff41' }}>✓ Early access to new items</div>
                  <div style={{ color: '#00ff41' }}>✓ Priority support (24h)</div>
                  <div style={{ color: '#00ff41' }}>✓ Fast-track delivery</div>
                  <div style={{ color: '#00ff41' }}>✓ No marketplace ads</div>
                </>
              )}
              {currentTier === 2 && (
                <>
                  <div style={{ color: '#00ff41' }}>✓ 20% discount on all products</div>
                  <div style={{ color: '#00ff41' }}>✓ All exclusive products</div>
                  <div style={{ color: '#00ff41' }}>✓ Analytics dashboard</div>
                  <div style={{ color: '#00ff41' }}>✓ VIP support 24/7</div>
                  <div style={{ color: '#00ff41' }}>✓ Premium same-day delivery</div>
                  <div style={{ color: '#00ff41' }}>✓ AI Assistant enabled</div>
                  <div style={{ color: '#00ff41' }}>✓ Advanced insights</div>
                  <div style={{ color: '#00ff41' }}>✓ Custom product requests</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mission Logs / Order History */}
        <div className="profile-card" style={{
          background: 'var(--glass)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '30px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)' }}>
            MISSION LOGS
          </h2>
          <div style={{ 
            fontFamily: 'Space Mono', 
            fontSize: '0.9rem', 
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '2'
          }}>
            {purchaseHistory.length > 0 ? (
              purchaseHistory.slice(0, 10).map((order, index) => (
                <div key={index} style={{ 
                  marginBottom: '15px', 
                  paddingBottom: '15px', 
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                className="interactive"
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--primary)' }}>
                      {new Date(order.timestamp).toLocaleString()}
                    </span>
                    <span style={{ color: '#00ff41' }}>✓ DELIVERED</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div>ORDER #NDS-{String(order.timestamp).slice(-4)}</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                        {order.items.length} item(s) → {order.total} CR
                      </div>
                    </div>
                    <button
                      className="epic-btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.65rem',
                        minWidth: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                    >
                      TRACK 🛸
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--primary)' }}>2026-02-01 14:23:05</span>
                    <span style={{ color: '#00ff41' }}>✓ COMPLETED</span>
                  </div>
                  <div>ORDER #NDS-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Neural Link V1 × 1 → 2,400 CR</div>
                </div>
                
                <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--primary)' }}>2026-01-28 09:15:32</span>
                    <span style={{ color: '#00ff41' }}>✓ COMPLETED</span>
                  </div>
                  <div>ORDER #NDS-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Synapse Booster × 2 → 6,400 CR</div>
                </div>
                
                <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--primary)' }}>2026-01-15 18:47:21</span>
                    <span style={{ color: '#00ff41' }}>✓ COMPLETED</span>
                  </div>
                  <div>TIER UPGRADE</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                    {currentTier >= 1 ? 'OPERATIVE Tier Activated' : 'Tier upgrade available'}
                  </div>
                </div>
              </>
            )}
            
            {cart.length === 0 && purchaseHistory.length === 0 && (
              <div style={{ marginTop: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                No orders yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drone Tracking Modal */}
      {selectedOrder && (
        <DroneTracking 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}

export default ProfilePage;

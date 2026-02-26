import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import gsap from 'gsap';

const AnalyticsDashboard = () => {
  const { purchaseHistory, products, currentTier } = useStore();
  const [stats, setStats] = useState({
    totalSpent: 0,
    itemsPurchased: 0,
    avgOrderValue: 0,
    favoriteCategory: 'N/A',
    lastPurchase: null
  });

  useEffect(() => {
    if (purchaseHistory.length > 0) {
      const totalSpent = purchaseHistory.reduce((sum, p) => sum + p.total, 0);
      const itemsPurchased = purchaseHistory.reduce((sum, p) => sum + p.items.length, 0);
      const avgOrderValue = Math.floor(totalSpent / purchaseHistory.length);
      
      // Calculate favorite category
      const categories = {};
      purchaseHistory.forEach(purchase => {
        purchase.items.forEach(item => {
          categories[item.type] = (categories[item.type] || 0) + 1;
        });
      });
      const favoriteCategory = Object.keys(categories).length > 0
        ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
        : 'N/A';
      
      setStats({
        totalSpent,
        itemsPurchased,
        avgOrderValue,
        favoriteCategory: favoriteCategory.toUpperCase(),
        lastPurchase: purchaseHistory[0]
      });
    }

    // Animate cards on mount
    gsap.fromTo('.stat-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
    );
  }, [purchaseHistory]);

  if (currentTier < 2) {
    return (
      <div style={{
        padding: '40px',
        background: 'rgba(255, 0, 85, 0.05)',
        border: '1px solid rgba(255, 0, 85, 0.3)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
        <h3 style={{ fontSize: '1.5rem', color: '#ff0055', marginBottom: '10px' }}>
          ARCHITECT EXCLUSIVE
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Upgrade to ARCHITECT tier to unlock advanced analytics
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 0, 85, 0.05)',
      border: '2px solid #ff0055',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 0 30px rgba(255, 0, 85, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '30px'
      }}>
        <span style={{ fontSize: '2rem' }}></span>
        <h3 style={{
          fontSize: '1.8rem',
          color: '#ff0055',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Analytics Dashboard
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card" style={{
          background: 'rgba(0, 242, 255, 0.1)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Total Spent
          </div>
          <div style={{
            fontSize: '2rem',
            color: 'var(--primary)',
            fontWeight: '900',
            fontFamily: 'Space Mono'
          }}>
            {stats.totalSpent} CR
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'rgba(0, 242, 255, 0.1)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Items Purchased
          </div>
          <div style={{
            fontSize: '2rem',
            color: '#00ff41',
            fontWeight: '900',
            fontFamily: 'Space Mono'
          }}>
            {stats.itemsPurchased}
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'rgba(0, 242, 255, 0.1)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Avg Order Value
          </div>
          <div style={{
            fontSize: '2rem',
            color: '#ff0055',
            fontWeight: '900',
            fontFamily: 'Space Mono'
          }}>
            {stats.avgOrderValue} CR
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'rgba(0, 242, 255, 0.1)',
          border: '1px solid rgba(0, 242, 255, 0.3)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Favorite Category
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: '700',
            fontFamily: 'Space Mono'
          }}>
            {stats.favoriteCategory}
          </div>
        </div>
      </div>

      {/* Purchase History */}
      {purchaseHistory.length > 0 && (
        <div>
          <h4 style={{
            fontSize: '1.2rem',
            color: 'var(--primary)',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Recent Purchases
          </h4>
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '10px'
          }}>
            {purchaseHistory.slice(0, 10).map((purchase, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'Space Mono'
                  }}>
                    {new Date(purchase.timestamp).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontSize: '1rem',
                    color: '#00ff41',
                    fontWeight: '700',
                    fontFamily: 'Space Mono'
                  }}>
                    {purchase.total} CR
                  </span>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  {purchase.items.length} item{purchase.items.length > 1 ? 's' : ''} • {purchase.items.map(i => i.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {purchaseHistory.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Space Mono'
        }}>
          No purchase history yet. Start shopping to see your analytics!
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

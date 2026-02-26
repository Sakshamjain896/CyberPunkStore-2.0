import React, { useEffect } from 'react';
import gsap from 'gsap';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';

const HomePage = ({ onNavigate }) => {
  const { products, tiers, isLoggedIn, currentTier, activatePlan } = useStore();
  const { playCoinSound, speakSystem } = useAudio();

  useEffect(() => {
    // Reveal sections on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('.overview-section');
      const windowHeight = window.innerHeight;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < windowHeight * 0.75) {
          sec.classList.add('visible');
        }
      });
    };

    const homePage = document.getElementById('home-page');
    if (homePage) {
      homePage.addEventListener('scroll', handleScroll);
      return () => homePage.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handlePlanActivate = (index) => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }
    
    const success = activatePlan(index);
    if (success) {
      playCoinSound();
      speakSystem(`Clearance level updated to ${tiers[index].name}.`);
      alert(`UPGRADE COMPLETE: ${tiers[index].name}`);
    } else {
      alert("INSUFFICIENT CREDITS");
    }
  };

  return (
    <>
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <h1 className="hero-title" style={{ textAlign: 'center', fontSize: '9vw', lineHeight: 0.9 }}>
          FUTURE<br />
          <span style={{ color: 'var(--primary)', WebkitTextStroke: '1px white' }}>REALITY</span>
        </h1>
        <p style={{ textAlign: 'center', color: '#666', letterSpacing: '8px', marginTop: '30px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Neural Interface v2.0
        </p>
        <div className="scroll-indicator" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Space Mono',
          fontSize: '0.7rem',
          color: '#666',
          animation: 'bounce 2s infinite',
          pointerEvents: 'none'
        }}>
          ▼ SCROLL TO INITIALIZE ▼
        </div>
      </section>

      <section className="overview-section" style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 5%',
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <h2 className="section-title" style={{ fontSize: '4rem', letterSpacing: '5px', marginBottom: '50px', textAlign: 'center' }}>
          LATEST <span style={{ color: 'var(--primary)' }}>DROPS</span>
        </h2>
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '40px',
          paddingBottom: '100px',
          width: '100%',
          perspective: '1500px',
          marginBottom: '50px'
        }}>
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="product-card" style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '30px',
              borderRadius: '0px',
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
              transition: 'border-color 0.3s'
            }}>
              <div className="price-tag" style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '0.7rem',
                color: 'black',
                background: 'var(--primary)',
                fontWeight: 700,
                padding: '5px 15px'
              }}>
                {product.price}
              </div>
              <div className="card-inner" style={{ pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
                <h4 className="hacker-text" style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '1.4rem',
                  marginBottom: '10px',
                  color: 'white',
                  letterSpacing: '-1px',
                  fontWeight: 700
                }}>
                  {product.name}
                </h4>
                <div className="tech-line" style={{
                  width: '20px',
                  height: '3px',
                  background: 'var(--primary)',
                  margin: '15px 0'
                }} />
                <p>{product.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="epic-btn" onClick={() => onNavigate('products-view')}>
          VIEW ALL HARDWARE
        </button>
      </section>

      <section className="overview-section" style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 5%',
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'linear-gradient(to bottom, transparent, rgba(0, 242, 255, 0.05), transparent)'
      }}>
        <h2 className="section-title" style={{ fontSize: '4rem', letterSpacing: '5px', marginBottom: '50px', textAlign: 'center' }}>
          SYSTEM <span style={{ color: 'var(--primary)' }}>ACCESS</span>
        </h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
          {tiers.slice(1).map((tier, index) => {
            const realIndex = index + 1;
            const isActive = currentTier === realIndex;
            return (
              <div key={realIndex} className="product-card" style={{
                width: '250px',
                textAlign: 'center',
                borderColor: isActive ? '#00ff41' : (index === 0 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'),
                boxShadow: isActive ? '0 0 30px rgba(0, 255, 65, 0.2)' : (index === 0 ? '0 0 30px rgba(0,242,255,0.1)' : 'none')
              }}>
                {index === 0 && (
                  <div className="subscription-badge" style={{
                    background: 'var(--primary)',
                    color: 'black',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    padding: '5px',
                    marginBottom: '15px',
                    display: 'inline-block'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ letterSpacing: '3px', color: 'white' }}>{tier.name}</h3>
                <h1 style={{
                  color: isActive ? '#00ff41' : 'var(--primary)',
                  margin: '20px 0'
                }}>
                  {tier.cost} CR
                </h1>
                <ul className="feature-list" style={{
                  listStyle: 'none',
                  textAlign: 'left',
                  margin: '20px 0',
                  color: '#888',
                  fontSize: '0.8rem',
                  fontFamily: 'Space Mono'
                }}>
                  {tier.perks.map((perk, i) => (
                    <li key={i} style={{
                      marginBottom: '10px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '5px'
                    }}>
                      {'> '}{perk}
                    </li>
                  ))}
                </ul>
                <button
                  className="epic-btn"
                  style={{
                    width: '100%',
                    color: isActive ? '#00ff41' : 'white',
                    borderColor: isActive ? '#00ff41' : 'rgba(255,255,255,0.2)'
                  }}
                  onClick={() => handlePlanActivate(realIndex)}
                  disabled={isActive}
                >
                  {isActive ? 'ACTIVE PLAN' : `UPGRADE (${tier.cost} CR)`}
                </button>
              </div>
            );
          })}
        </div>
        <button
          className="epic-btn"
          style={{ background: 'white', color: 'black' }}
          onClick={() => onNavigate('plans-view')}
        >
          UPGRADE NOW
        </button>
      </section>

      <section className="overview-section" style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 5%',
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'linear-gradient(to bottom, transparent, rgba(255, 0, 85, 0.05), transparent)'
      }}>
        <h2 className="section-title" style={{ fontSize: '4rem', letterSpacing: '5px', marginBottom: '50px', textAlign: 'center' }}>
          BREACH <span style={{ color: 'var(--primary)' }}>PROTOCOL</span>
        </h2>
        
        <div className="product-card" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '60px',
          textAlign: 'center',
          border: '2px solid var(--primary)',
          boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '30px',
            filter: 'drop-shadow(0 0 20px var(--primary))'
          }}>
            🧩
          </div>
          
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px', 
            letterSpacing: '5px',
            color: 'var(--primary)',
            textShadow: '0 0 20px var(--primary)'
          }}>
            PUZZLE HACK CHALLENGE
          </h3>
          
          <p style={{
            fontFamily: 'Space Mono',
            lineHeight: 1.8,
            color: '#aaa',
            marginBottom: '30px',
            fontSize: '1.1rem'
          }}>
            Test your cognitive processing capabilities. Solve the 9-piece sliding puzzle to breach the mainframe security protocols.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(0, 242, 255, 0.05)',
              padding: '20px',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              borderRadius: '4px'
            }}>
              <div style={{ 
                color: 'var(--primary)', 
                fontWeight: '900',
                marginBottom: '10px',
                fontSize: '0.9rem',
                letterSpacing: '2px'
              }}>
                ⚡ OBJECTIVE
              </div>
              <p style={{ 
                fontFamily: 'Space Mono', 
                fontSize: '0.85rem', 
                color: '#888',
                lineHeight: '1.6'
              }}>
                Arrange tiles 1-8 in sequential order by sliding them into the empty space
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 242, 255, 0.05)',
              padding: '20px',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              borderRadius: '4px'
            }}>
              <div style={{ 
                color: 'var(--primary)', 
                fontWeight: '900',
                marginBottom: '10px',
                fontSize: '0.9rem',
                letterSpacing: '2px'
              }}>
                ⏱ TIME LIMIT
              </div>
              <p style={{ 
                fontFamily: 'Space Mono', 
                fontSize: '0.85rem', 
                color: '#888',
                lineHeight: '1.6'
              }}>
                Complete the puzzle within 60 seconds to successfully breach the system
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 255, 65, 0.05)',
              padding: '20px',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              borderRadius: '4px'
            }}>
              <div style={{ 
                color: '#00ff41', 
                fontWeight: '900',
                marginBottom: '10px',
                fontSize: '0.9rem',
                letterSpacing: '2px'
              }}>
                💰 REWARDS
              </div>
              <p style={{ 
                fontFamily: 'Space Mono', 
                fontSize: '0.85rem', 
                color: '#888',
                lineHeight: '1.6'
              }}>
                Win <span style={{ color: '#00ff41', fontWeight: '700' }}>1000 CR</span> or <span style={{ color: '#ff0055', fontWeight: '700' }}>50% Discount</span> on your next purchase
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '25px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              fontFamily: 'Space Mono', 
              fontSize: '0.9rem', 
              color: '#666',
              lineHeight: '1.8',
              fontStyle: 'italic'
            }}>
              <span style={{ color: 'var(--danger)' }}>⚠ WARNING:</span> Login required to access puzzle protocols. Unauthorized access attempts will be logged.
            </p>
          </div>

          <button 
            className="epic-btn" 
            style={{ 
              padding: '15px 50px',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, var(--primary), #ff0055)',
              border: 'none',
              boxShadow: '0 0 30px rgba(0, 242, 255, 0.5)',
              fontWeight: '900'
            }}
            onClick={() => onNavigate('hacking-view')}
          >
            INITIATE BREACH
          </button>
        </div>
      </section>

      <section className="overview-section" style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 5%',
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div className="product-card" style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', letterSpacing: '5px' }}>IDENTITY</h2>
          <p style={{
            fontFamily: 'Space Mono',
            lineHeight: 1.8,
            color: '#aaa',
            marginBottom: '40px'
          }}>
            We are the bridge between biology and byte. Born in the back alleys of Neo-Tokyo, Neon Dream provides the tools for the next stage of human evolution.
          </p>
          <button className="epic-btn" onClick={() => onNavigate('about-view')}>
            READ DATABASE
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;

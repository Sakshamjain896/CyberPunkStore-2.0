import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import gsap from 'gsap';

function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const aboutRef = useRef(null);
  const { primaryColor } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return;
      const rect = aboutRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.75) {
        setIsVisible(true);
      }
    };

    const aboutEl = aboutRef.current;
    if (aboutEl) {
      aboutEl.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (aboutEl) {
        aboutEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !statsAnimated) {
      setStatsAnimated(true);
      // Animate stats
      gsap.to('.stat-num', {
        innerText: (i, target) => {
          const finalVal = parseInt(target.getAttribute('data-val'));
          return finalVal;
        },
        duration: 2,
        snap: { innerText: 1 },
        stagger: 0.2,
        ease: 'power1.out'
      });
    }
  }, [isVisible, statsAnimated]);

  const scrambleText = (e) => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const target = e.target;
    const original = target.getAttribute('data-text') || target.innerText;
    let iteration = 0;

    const interval = setInterval(() => {
      target.innerText = original
        .split('')
        .map((char, idx) => {
          if (idx < iteration) return original[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= original.length) clearInterval(interval);
      iteration += 1;
    }, 30);
  };

  return (
    <div id="about-view" ref={aboutRef} style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      padding: '120px 20px 80px',
      position: 'relative'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 
          className="page-title" 
          data-text="ABOUT NEON DREAM"
          onMouseEnter={scrambleText}
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '60px',
            cursor: 'pointer',
            color: primaryColor
          }}
        >
          ABOUT NEON DREAM
        </h1>

        <div className="about-section" style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            OUR MISSION
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '800px'
          }}>
            In a world where the line between human and machine blurs, NEON DREAM stands at the forefront 
            of cybernetic enhancement. We provide cutting-edge augmentations and neural software to help 
            you transcend your biological limitations. Our products are designed for those who refuse to 
            accept the constraints of flesh and bone.
          </p>
        </div>

        <div className="timeline-section" style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            TIMELINE
          </h2>
          <div className="timeline">
            {[
              { year: '2024', event: 'NEON DREAM founded in Neo-Tokyo' },
              { year: '2025', event: 'First neural implant series released' },
              { year: '2026', event: 'Expanded to 128 countries globally' },
              { year: '2027', event: 'Breakthrough in consciousness transfer tech' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="timeline-entry"
                style={{
                  display: 'flex',
                  gap: '30px',
                  marginBottom: '30px',
                  padding: '20px',
                  background: 'rgba(0, 242, 255, 0.03)',
                  border: '1px solid rgba(0, 242, 255, 0.1)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 255, 0.08)';
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div className="timeline-year" style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: primaryColor,
                  minWidth: '80px'
                }}>
                  {item.year}
                </div>
                <div className="timeline-event" style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.8)',
                  paddingTop: '5px'
                }}>
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            GLOBAL IMPACT
          </h2>
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {[
              { value: 52400, label: 'ENHANCED USERS', suffix: '+' },
              { value: 128, label: 'COUNTRIES', suffix: '' },
              { value: 1247, label: 'PRODUCTS DELIVERED', suffix: '' },
              { value: 99, label: 'SATISFACTION RATE', suffix: '%' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="stat-card"
                style={{
                  padding: '30px',
                  background: 'rgba(0, 242, 255, 0.03)',
                  border: '1px solid rgba(0, 242, 255, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 255, 0.08)';
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 242, 255, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div 
                  className="stat-num"
                  data-val={stat.value}
                  style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: primaryColor,
                    marginBottom: '10px'
                  }}
                >
                  0{stat.suffix}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '2px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudio } from '../hooks/useAudio';
import gsap from 'gsap';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [transmitting, setTransmitting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const { primaryColor } = useStore();
  const { playKeySound, playCoinSound, speakSystem } = useAudio();

  const handleInputChange = (e) => {
    playKeySound();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      speakSystem('All fields required.');
      return;
    }

    setTransmitting(true);
    setLogs([]);
    setProgress(0);

    const messages = [
      '> INITIALIZING SECURE CHANNEL...',
      '> ENCRYPTING MESSAGE PAYLOAD...',
      '> ROUTING THROUGH PROXY NODES...',
      '> TRANSMITTING TO NEON DREAM HQ...',
      '> AWAITING CONFIRMATION...',
      '> ✓ MESSAGE RECEIVED',
      '> ✓ RESPONSE EXPECTED WITHIN 24H'
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < messages.length) {
        setLogs(prev => [...prev, messages[currentLog]]);
        const newProgress = ((currentLog + 1) / messages.length) * 100;
        setProgress(newProgress);
        
        gsap.to('.progress-bar', {
          width: `${newProgress}%`,
          duration: 0.5,
          ease: 'power2.out'
        });

        currentLog++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => {
          playCoinSound();
          speakSystem('Message transmitted successfully.');
          setTimeout(() => {
            setTransmitting(false);
            setFormData({ name: '', email: '', message: '' });
            setLogs([]);
            setProgress(0);
          }, 2000);
        }, 500);
      }
    }, 600);
  };

  return (
    <div id="contact-view" style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      padding: '120px 20px 80px',
      position: 'relative'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '20px',
          color: primaryColor
        }}>
          CONTACT
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '60px'
        }}>
          Establish a secure connection with our support network
        </p>

        {!transmitting ? (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                IDENTIFICATION
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name..."
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(0, 242, 255, 0.05)',
                  border: '1px solid rgba(0, 242, 255, 0.3)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'Space Mono, monospace',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.background = 'rgba(0, 242, 255, 0.08)';
                  e.target.style.boxShadow = `0 0 20px rgba(0, 242, 255, 0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 242, 255, 0.3)';
                  e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                TRANSMISSION VECTOR
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(0, 242, 255, 0.05)',
                  border: '1px solid rgba(0, 242, 255, 0.3)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'Space Mono, monospace',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.background = 'rgba(0, 242, 255, 0.08)';
                  e.target.style.boxShadow = `0 0 20px rgba(0, 242, 255, 0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 242, 255, 0.3)';
                  e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                MESSAGE PAYLOAD
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                rows="8"
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(0, 242, 255, 0.05)',
                  border: '1px solid rgba(0, 242, 255, 0.3)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'Space Mono, monospace',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.background = 'rgba(0, 242, 255, 0.08)';
                  e.target.style.boxShadow = `0 0 20px rgba(0, 242, 255, 0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 242, 255, 0.3)';
                  e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button type="submit" className="epic-btn" style={{ width: '100%' }}>
              TRANSMIT MESSAGE
            </button>
          </form>
        ) : (
          <div className="transmission-panel" style={{
            background: 'rgba(0, 242, 255, 0.05)',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            padding: '40px',
            fontFamily: 'Space Mono, monospace'
          }}>
            <div className="transmission-logs" style={{ marginBottom: '30px' }}>
              {logs.map((log, idx) => (
                <div 
                  key={idx}
                  style={{
                    color: log.includes('✓') ? '#00ff41' : primaryColor,
                    marginBottom: '10px',
                    fontSize: '0.95rem',
                    animation: 'blink 0.5s'
                  }}
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="progress-container" style={{
              width: '100%',
              height: '4px',
              background: 'rgba(0, 242, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div 
                className="progress-bar"
                style={{
                  width: '0%',
                  height: '100%',
                  background: primaryColor,
                  boxShadow: `0 0 10px ${primaryColor}`
                }}
              />
            </div>
          </div>
        )}

        <div className="contact-info" style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            padding: '30px',
            background: 'rgba(0, 242, 255, 0.03)',
            border: '1px solid rgba(0, 242, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              LOCATION
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              Neo-Tokyo, Sector 7<br />
              Block 2049
            </div>
          </div>

          <div style={{
            padding: '30px',
            background: 'rgba(0, 242, 255, 0.03)',
            border: '1px solid rgba(0, 242, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              SUPPORT LINE
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              +81-3-NEON-DREAM<br />
              24/7 Availability
            </div>
          </div>

          <div style={{
            padding: '30px',
            background: 'rgba(0, 242, 255, 0.03)',
            border: '1px solid rgba(0, 242, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              NETWORK
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              support@neondream.io<br />
              Encrypted Channel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

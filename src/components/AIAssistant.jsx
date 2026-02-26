import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import gsap from 'gsap';

const AIAssistant = () => {
  const { currentTier, products, userCredits, purchaseHistory } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'ARCHITECT AI Assistant activated. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.ai-panel', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (currentTier < 2) return null;

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Product recommendations
    if (input.includes('recommend') || input.includes('suggest') || input.includes('best')) {
      const exclusiveProducts = products.filter(p => p.exclusive && p.minTier === 2);
      const productNames = exclusiveProducts.map(p => p.name).join(', ');
      return `Based on your ARCHITECT tier, I recommend our exclusive products: ${productNames}. These are premium-grade augmentations with cutting-edge technology.`;
    }
    
    // Credits info
    if (input.includes('credit') || input.includes('balance') || input.includes('money')) {
      return `Your current balance is ${userCredits} CR. As an ARCHITECT member, you enjoy a 20% discount on all purchases, maximizing your credit efficiency.`;
    }
    
    // Purchase history
    if (input.includes('history') || input.includes('bought') || input.includes('purchased')) {
      if (purchaseHistory.length > 0) {
        const totalSpent = purchaseHistory.reduce((sum, p) => sum + p.total, 0);
        const itemCount = purchaseHistory.reduce((sum, p) => sum + p.items.length, 0);
        return `You've made ${purchaseHistory.length} purchase(s) totaling ${totalSpent} CR with ${itemCount} items. Your most recent purchase was ${new Date(purchaseHistory[0].timestamp).toLocaleDateString()}.`;
      }
      return 'No purchase history found yet. Start shopping to build your profile!';
    }
    
    // Tier benefits
    if (input.includes('benefit') || input.includes('perk') || input.includes('feature')) {
      return 'Your ARCHITECT tier includes: 20% discount on all products, access to all exclusive items, analytics dashboard, VIP 24/7 support, same-day premium delivery, custom product requests, and this AI assistant. Upgrade your cybernetic arsenal with premium privileges.';
    }
    
    // Exclusive products
    if (input.includes('exclusive') || input.includes('premium') || input.includes('architect')) {
      return 'ARCHITECT exclusive products include: Quantum Core (25,000 CR) - experimental quantum processor, Omninet Access (30,000 CR) - unrestricted network access, and Neural Matrix Pro (35,000 CR) - full brain digitization interface. These are cutting-edge augmentations reserved for elite operatives.';
    }
    
    // Analytics
    if (input.includes('analytic') || input.includes('stat') || input.includes('dashboard')) {
      return 'Your analytics dashboard is available on the Profile page. It tracks total spending, items purchased, average order value, favorite categories, and recent purchase history. Use these insights to optimize your augmentation strategy.';
    }

    // Help
    if (input.includes('help') || input.includes('how') || input.includes('what')) {
      return 'I can help you with product recommendations, credit information, purchase history, tier benefits, exclusive products, and analytics. Just ask me anything about your account or our products!';
    }
    
    // Default response
    return 'I understand your query. As your ARCHITECT AI, I can provide information about products, credits, purchase history, tier benefits, and analytics. What specific information do you need?';
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = { type: 'ai', text: generateAIResponse(input) };
      setMessages(prev => [...prev, aiResponse]);
    }, 800);
    
    setInput('');
  };

  return (
    <>
      {/* AI Button - Same style as website */}
      {!isOpen && (
        <button
          className="epic-btn interactive"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.7rem',
            padding: '12px 24px'
          }}
        >
          <span style={{ 
            fontSize: '1.2rem',
            animation: 'pulse 2s infinite'
          }}></span>
          ARCHITECT AI
        </button>
      )}

      {/* AI Chat Interface - Opens in place of button */}
      {isOpen && (
        <div
          className="ai-panel"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '420px',
            maxWidth: 'calc(100vw - 60px)',
            height: '600px',
            maxHeight: 'calc(100vh - 60px)',
            background: 'rgba(10, 10, 10, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}></span>
              <div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#fff',
                  fontFamily: 'Space Grotesk',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  ARCHITECT AI
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--primary)',
                  fontFamily: 'Space Mono',
                  letterSpacing: '1px'
                }}>
                  Neural Assistant Active
                </div>
              </div>
            </div>
            <button
              className="interactive"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                fontFamily: 'Space Mono'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.boxShadow = '0 0 20px var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  background: msg.type === 'ai' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 242, 255, 0.1)',
                  border: `1px solid ${msg.type === 'ai' ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary)'}`,
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: '#fff',
                  fontFamily: 'Space Mono',
                  transition: 'all 0.3s'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginTop: '6px',
                  fontFamily: 'Space Mono',
                  textAlign: msg.type === 'user' ? 'right' : 'left',
                  letterSpacing: '1px'
                }}>
                  {msg.type === 'ai' ? 'AI' : 'YOU'}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '0.85rem',
                fontFamily: 'Space Mono',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 255, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              className="epic-btn interactive"
              onClick={handleSend}
              style={{
                padding: '12px 20px',
                minWidth: 'auto'
              }}
            >
              SEND
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .ai-panel::-webkit-scrollbar {
            width: 6px;
          }

          .ai-panel::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }

          .ai-panel::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }

          .ai-panel::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
          }
        `}
      </style>
    </>
  );
};

export default AIAssistant;

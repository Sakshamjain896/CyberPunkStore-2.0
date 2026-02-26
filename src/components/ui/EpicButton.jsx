import React from 'react';
import './EpicButton.css';

const EpicButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  glitch = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClass = `epic-btn epic-btn--${variant} epic-btn--${size} ${glitch ? 'epic-btn--glitch' : ''} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="epic-btn__text">{children}</span>
      <span className="epic-btn__glitch" aria-hidden="true">{children}</span>
      <span className="epic-btn__border"></span>
    </button>
  );
};

export default EpicButton;

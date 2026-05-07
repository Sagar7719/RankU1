// BadgeComponent.js
import React from 'react';
import './BadgeComponent.css';

const BadgeComponent = ({ 
  children, 
  variant = 'primary', 
  outline = false,
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  hideTextOnMobile = false, // New prop for extreme small screens
  ...props 
}) => {
  const badgeClasses = [
    'custom-badge',
    `custom-badge-${variant}`,
    outline ? 'custom-badge-outline' : '',
    size !== 'md' ? `custom-badge-${size}` : '',
    hideTextOnMobile ? 'hide-text-on-mobile' : '',
    onClick ? 'clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={badgeClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <span className="badge-icon">
          <Icon />
        </span>
      )}
      <span className="badge-text">{children}</span>
      {Icon && iconPosition === 'right' && (
        <span className="badge-icon">
          <Icon />
        </span>
      )}
    </span>
  );
};

export default BadgeComponent;
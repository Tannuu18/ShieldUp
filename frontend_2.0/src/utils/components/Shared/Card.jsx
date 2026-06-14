import React from 'react';

export default function Card({
  children,
  className = '',
  hover = true,
  glowColor = '',
  ...props
}) {
  const glowStyles = {
    cyan: 'hover:border-cyber-cyan/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    purple: 'hover:border-cyber-purple/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    green: 'hover:border-cyber-green/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    red: 'hover:border-cyber-red/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    yellow: 'hover:border-cyber-yellow/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  };

  return (
    <div
      className={`bg-cyber-gray/95 border border-cyber-border/40 backdrop-blur-md rounded-xl p-6 transition-all duration-300 ${
        hover ? 'hover:-translate-y-0.5' : ''
      } ${
        glowColor ? glowStyles[glowColor] : 'hover:border-cyber-cyan/30'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
import React from 'react';

export default function GlowEffect({ color = 'cyan', className = '' }) {
  const colors = {
    cyan: 'bg-cyber-cyan/10 blur-[120px]',
    purple: 'bg-cyber-purple/10 blur-[120px]',
    magenta: 'bg-cyber-magenta/10 blur-[120px]',
  };

  return (
    <div
      className={`absolute pointer-events-none rounded-full ${colors[color]} ${className}`}
      aria-hidden="true"
    />
  );
}

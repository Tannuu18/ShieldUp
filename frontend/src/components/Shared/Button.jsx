import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
}) {
  const baseStyle =
    'px-5 py-2.5 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-black font-semibold hover:opacity-90 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    outline:
      'border border-cyber-border text-gray-300 hover:border-cyber-cyan hover:text-white hover:bg-cyber-cyan/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'text-gray-400 hover:text-white hover:bg-cyber-lightGray/30 active:scale-95 disabled:opacity-50',
    danger:
      'bg-gradient-to-r from-cyber-red to-cyber-magenta text-white hover:opacity-90 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 disabled:opacity-50',
    secondary:
      'bg-cyber-lightGray border border-cyber-border text-gray-200 hover:border-cyber-purple/50 hover:text-white active:scale-95 disabled:opacity-50',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

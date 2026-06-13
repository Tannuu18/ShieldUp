/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0A0A0C",
          gray: "#121218",
          dark: "#060608",
          lightGray: "#1E1E26",
          border: "#2A2A35",
          cyan: "#00F0FF",
          purple: "#8B5CF6",
          magenta: "#FF007F",
          green: "#10B981",
          yellow: "#F59E0B",
          red: "#EF4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.15)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.15)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.15)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.15)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

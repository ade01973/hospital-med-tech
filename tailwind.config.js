export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6), inset 0 0 30px rgba(34, 211, 238, 0.2)' },
        },
        'glow-pulse-green': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.7), inset 0 0 30px rgba(16, 185, 129, 0.2)' },
        },
        'glow-pulse-red': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(239, 68, 68, 0.7), inset 0 0 30px rgba(239, 68, 68, 0.2)' },
        },
        'points-bounce': {
          '0%': { transform: 'scale(0) translateY(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(-30px)', opacity: '0' },
        },
        'slide-in-left': {
          'from': { transform: 'translateX(-30px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'confetti-fall': {
          'to': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        'float-coin': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(1.2)' },
        },
      },
      animation: {
        'shake': 'shake 0.3s ease-in-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-green': 'glow-pulse-green 2s ease-in-out infinite',
        'glow-pulse-red': 'glow-pulse-red 2s ease-in-out infinite',
        'points-bounce': 'points-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'confetti-fall': 'confetti-fall 3s ease-in forwards',
        'fade-in-out': 'fade-in-out 2s ease-in-out',
        'float-coin': 'float-coin 2s ease-out forwards',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
    },
  },
  plugins: [],
}

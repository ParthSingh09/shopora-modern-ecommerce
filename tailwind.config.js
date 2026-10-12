/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shopora: {
          dark: '#0A0B0E',
          card: '#13151B',
          cardHover: '#181B23',
          border: '#242834',
          accent: '#CCFF00', // Volt yellow-green signature street accent
          accentHover: '#B8E600',
          crimson: '#FF3366',
          cyan: '#00F0FF',
          muted: '#8E95A5',
          light: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 25px -5px rgba(204, 255, 0, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(255, 51, 102, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'marquee': 'marquee 25s linear infinite',
      }
    },
  },
  plugins: [],
}

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
          dark: '#0B0C0E',
          surface: '#111318',
          card: '#16181F',
          cardHover: '#1C202A',
          border: '#272B38',
          borderLight: '#373D4F',
          accent: '#CCFF00', // Signature Volt
          accentHover: '#B5E300',
          accentDark: '#1E2600',
          crimson: '#FF3B30',
          cyan: '#00F0FF',
          muted: '#94A3B8', // High-contrast WCAG AA accessible muted text
          text: '#F8FAFC',
          light: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
        'accent-ring': '0 0 0 2px #CCFF00',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      }
    },
  },
  plugins: [],
}

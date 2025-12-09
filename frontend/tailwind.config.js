/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ef',
          100: '#e8e4db',
          200: '#d9d2c3',
          300: '#d2c5a1',
          400: '#c8b68a',
          500: '#b8a577',
          600: '#a89466',
          700: '#8a7854',
          800: '#6e6047',
          900: '#5a4f3c',
        },
        dark: {
          50: '#f8f8f8',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#808080',
          500: '#4d4d4d',
          600: '#3a3a3a',
          700: '#2b2b2b',
          800: '#1f1f1f',
          900: '#141414',
          950: '#0a0a0a',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(200, 182, 138, 0.3)',
        'glow-lg': '0 0 30px rgba(200, 182, 138, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    },
  },
  plugins: [],
}

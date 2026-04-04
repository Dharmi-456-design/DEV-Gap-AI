/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02030A', // Obsidian Black
          900: '#0D0F1A', // Deep Graphite
          800: '#121420', // Frosted Carbon
          700: '#1f2937',
        },
        slate: {
          950: '#02030A', // Obsidian Black
          900: '#0D0F1A', // Deep Graphite
          800: '#121420',
          700: '#1f2937',
          600: '#374151',
          500: '#4b5563',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
        },
        primary: { 400: '#8b5cf6', 500: '#7C3AED', 600: '#6d28d9' }, // Aurora Purple
        secondary: { 400: '#67e8f9', 500: '#14F1D9', 600: '#06b6d4' }, // Quantum Teal
        accent: { 400: '#f472b6', 500: '#FF2E88', 600: '#db2777' }, // Plasma Pink
        tertiary: { 400: '#fde047', 500: '#FACC15', 600: '#eab308' }, // Solar Gold
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'radar-spin': 'radarSpin 4s linear infinite',
        'typing': 'typing 1.5s steps(20, end) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,0.3)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 25px rgba(34,211,238,0.4)', borderColor: 'rgba(34,211,238,0.5)' },
        },
        radarSpin: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        typing: { '0%, 40%, 100%': { transform: 'translateY(0)' }, '20%': { transform: 'translateY(-4px)' } },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' }
        }
      }
    }
  },
  plugins: [],
}

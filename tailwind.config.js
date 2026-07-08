/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050505',
          900: '#0A0A0B',
          800: '#131316',
          700: '#1B1B1F',
          600: '#25262B',
          500: '#323338',
        },
        emerald: {
          400: '#4FBFA0',
          500: '#2E9C7D',
          600: '#1F7A63',
          700: '#155C4A',
        },
        gold: {
          300: '#E4CE9A',
          400: '#CBA968',
          500: '#B08D4F',
          600: '#8C6E3A',
        },
        cream: {
          50: '#F8F6F0',
          100: '#EFE9DB',
          200: '#E1D8C2',
        },
        ink: {
          100: '#F1EFE9',
          300: '#B8B9BD',
          400: '#8A8B90',
          500: '#616266',
        },
        success: '#4FBFA0',
        warning: '#C9A15A',
        danger: '#B85C50',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '22px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 14px 36px -14px rgba(0,0,0,0.7)',
        elevate: '0 24px 56px -20px rgba(0,0,0,0.75)',
        gold: '0 0 0 1px rgba(203,169,104,0.35), 0 8px 26px -8px rgba(203,169,104,0.3)',
        glow: '0 0 0 1px rgba(79,191,160,0.35), 0 8px 26px -8px rgba(79,191,160,0.3)',
      },
      backgroundImage: {
        'grid-board': 'linear-gradient(rgba(203,169,104,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(203,169,104,0.05) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(79,191,160,0.12) 0%, rgba(10,10,11,0) 70%)',
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(.22,.9,.3,1)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(79,191,160,0.4)' },
          '70%': { boxShadow: '0 0 0 12px rgba(79,191,160,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(79,191,160,0)' },
        },
        drift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(2%,-3%) scale(1.05)' },
        },
        driftSlow: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(-3%,2%) scale(1.03)' },
        },
        particleFloat: {
          '0%,100%': { transform: 'translateY(0px)', opacity: '0.15' },
          '50%': { transform: 'translateY(-24px)', opacity: '0.5' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        pulseRing: 'pulseRing 2.2s cubic-bezier(.22,.9,.3,1) infinite',
        drift: 'drift 18s ease-in-out infinite',
        driftSlow: 'driftSlow 24s ease-in-out infinite',
        particleFloat: 'particleFloat 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
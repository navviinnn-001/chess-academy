/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#05070F',
          900: '#0A0F1E',
          800: '#0F1730',
          700: '#152040',
          600: '#1C2C52',
          500: '#293F70',
        },
        emerald: {
          400: '#3FCBA6',
          500: '#1FAE8A',
          600: '#158A6E',
          700: '#0F6B56',
        },
        gold: {
          300: '#F0DBA0',
          400: '#E8C77E',
          500: '#D4AF6A',
          600: '#B8924A',
        },
        cream: {
          50: '#FBF9F4',
          100: '#F6F2E9',
          200: '#EDE6D6',
        },
        ink: {
          100: '#F3F5FA',
          300: '#C7CEE0',
          400: '#9BA6C4',
          500: '#71799A',
        },
        success: '#3FCBA6',
        warning: '#E8B24C',
        danger: '#E2685E',
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
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -12px rgba(0,0,0,0.55)',
        elevate: '0 20px 50px -18px rgba(0,0,0,0.65)',
        gold: '0 0 0 1px rgba(212,175,106,0.35), 0 8px 24px -8px rgba(212,175,106,0.35)',
        glow: '0 0 0 1px rgba(63,203,166,0.35), 0 8px 24px -8px rgba(63,203,166,0.35)',
      },
      backgroundImage: {
        'grid-board': 'linear-gradient(rgba(198,169,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(198,169,110,0.06) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(63,203,166,0.14) 0%, rgba(10,15,30,0) 70%)',
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
          '0%': { boxShadow: '0 0 0 0 rgba(63,203,166,0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(63,203,166,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(63,203,166,0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        pulseRing: 'pulseRing 2.2s cubic-bezier(.22,.9,.3,1) infinite',
      },
    },
  },
  plugins: [],
}

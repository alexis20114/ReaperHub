/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        horror: ['Creepster', 'cursive'],
        tech: ['Orbitron', 'sans-serif'],
        body: ['Chakra Petch', 'sans-serif'],
      },
      colors: {
        blood: {
          50: '#ff4444',
          100: '#cc0000',
          200: '#8a0000',
          300: '#4a0000',
          400: '#200000',
          500: '#0a0000',
        },
        void: '#000000',
        reaper: {
          purple: '#3c003c',
          purpleMid: '#5a0060',
          purpleLight: '#8a0090',
        },
      },
      boxShadow: {
        blood: '0 0 20px #8a000088, 0 0 40px #8a000044',
        'blood-intense': '0 0 10px #c0002a, 0 0 30px #8a0000aa, 0 0 60px #8a000066',
        'blood-sm': '0 0 8px #8a000066',
        reaper: '0 0 20px #5a006066, 0 0 40px #3c003c44',
      },
      animation: {
        'blood-pulse': 'bloodPulse 2s ease-in-out infinite',
        'drip': 'drip 3s ease-in infinite',
        'float-blood': 'floatBlood 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'flicker': 'flicker 4s linear infinite',
      },
      keyframes: {
        bloodPulse: {
          '0%,100%': { boxShadow: '0 0 20px #8a000088, 0 0 40px #8a000044' },
          '50%': { boxShadow: '0 0 30px #c0002a, 0 0 60px #8a0000aa, 0 0 90px #8a000066' },
        },
        drip: {
          '0%': { transform: 'scaleY(0)', opacity: 0, top: '-4px' },
          '20%': { opacity: 1 },
          '100%': { transform: 'scaleY(1)', opacity: 0.7, top: '100%' },
        },
        floatBlood: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        glowPulse: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%,19%,21%,23%,25%,54%,56%,100%': { opacity: 1 },
          '20%,24%,55%': { opacity: 0.4 },
        },
      },
      backgroundImage: {
        'blood-gradient': 'linear-gradient(180deg, #000000 0%, #0a0000 40%, #200000 80%, #000000 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(138,0,0,0.1) 0%, rgba(60,0,60,0.05) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at center top, #400000 0%, #200000 30%, #0a0000 60%, #000000 100%)',
      },
    },
  },
  plugins: [],
}

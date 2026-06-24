import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        bg: {
          base: '#06101c',
          elevated: '#0b1727',
          glass: 'rgba(10, 20, 34, 0.68)',
        },
        panel: '#0f1d2f',
        line: 'rgba(148, 163, 184, 0.16)',
        accent: {
          50: '#eff7ff',
          100: '#dff0ff',
          200: '#b8e2ff',
          300: '#84ccff',
          400: '#45b2ff',
          500: '#1996ff',
          600: '#106fd0',
          700: '#0f5aa8',
          800: '#104f8c',
          900: '#114374',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(94, 234, 212, 0.14), 0 24px 80px rgba(8, 15, 26, 0.55)',
        glass: '0 24px 80px rgba(2, 6, 23, 0.52)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(99, 102, 241, 0.22), transparent 26%), radial-gradient(circle at 70% 90%, rgba(16, 185, 129, 0.12), transparent 22%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        sheen: 'sheen 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
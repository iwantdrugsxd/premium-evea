import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-flow': 'textFlow 4s linear infinite',
        'gradient-shift': 'gradientShift 20s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        textFlow: {
          to: { backgroundPosition: '200% center' }
        },
        gradientShift: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            transform: 'translate(-20px, -20px) rotate(90deg) scale(1.1)',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            transform: 'translate(20px, -10px) rotate(180deg) scale(0.9)',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            transform: 'translate(-10px, 20px) rotate(270deg) scale(1.05)',
            filter: 'hue-rotate(270deg)'
          }
        }
      },
      backdropBlur: {
        '20px': '20px',
      }
    },
  },
  plugins: [],
};

export default config;

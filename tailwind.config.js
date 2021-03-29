/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: { 50: '#f3f4f5', ...colors.gray, 950: '#0e0e10' },
      blue: { ...colors.blue, 950: '#101831' },
      red: { ...colors.red, 950: '#330b0b' },
    },
    fontFamily: {
      sans: ['Rubik', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      animation: {
        'fade-in': 'fade-in 1s ease-in-out',
        'fade-in-slow': 'fade-in-slow 4s ease-in-out',
        shift: 'shift 30s ease-in-out infinite',
        shake: 'shift 30s ease-in-out infinite, 0.8s shake',
        shine: 'shine 1.4s ease-in-out infinite ',
      },
      backgroundSize: {
        '125%': '125%',
        skeleton: '200px 100%',
      },
      fontSize: {
        proportional: 'min(4vw, 1em)',
      },
      inset: {
        7.5: '1.875rem',
        '1/2-1px': 'calc(50% - 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-slow': {
          '0%, 50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shift: {
          '0%': { backgroundPosition: '0 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0 50%' },
        },
        shake: {
          '0%': { transform: 'skewX(-30deg)' },
          '5%': { transform: 'skewX(30deg)' },
          '10%': { transform: 'skewX(-30deg)' },
          '15%': { transform: 'skewX(30deg)' },
          '20%': { transform: 'skewX(0deg)' },
          '100%': { transform: 'skewX(0deg)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200px 0' },
          '40%, 100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      lineHeight: {
        2: '0.5rem',
      },
      maxWidth: {
        '19/40': '47.5%',
      },
      spacing: {
        30: '7.5rem',
        38: '9.5rem',
        112: '28rem',
      },
    },
  },
  variants: {
    extend: {
      animation: ['responsive', 'hover'],
      backgroundColor: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
        'disabled',
      ],
      borderRadius: ['responsive', 'first', 'last'],
      borderWidth: ['responsive', 'first', 'last'],
      cursor: ['disabled'],
      justifyContent: ['responsive', 'first', 'last'],
      margin: ['first', 'last'],
      opacity: ['disabled'],
      ringOpacity: ['responsive', 'dark', 'focus-within', 'focus'],
      textColor: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
        'disabled',
      ],
    },
  },
  plugins: [],
}

/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: { 50: '#f3f4f5', ...colors.zinc, 950: '#0e0e10' },
      blue: { ...colors.blue, 950: '#101831' },
      red: { ...colors.red, 950: '#330b0b' },
      yellow: { DEFAULT: '#ca8200', dark: '#ffd401' },
      taupe: { DEFAULT: '#655d63', dark: '#AEA4B9' },
    },
    fontFamily: {
      sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      mono: ["'Space Mono'", ...defaultTheme.fontFamily.mono],
      narrow: ["'Noto Sans Display'", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      animation: {
        bounce: 'bounce 1s ease-in-out 1',
        'bounce-5': 'bounce 1s ease-in-out 5',
        'fade-in': 'fade-in 1s ease-in-out',
        'fade-in-slow': 'fade-in-slow 4s ease-in-out',
        pulse: 'pulse 1s ease-in-out 5',
        shift: 'shift 30s ease-in-out infinite',
        shake: 'shift 30s ease-in-out infinite, 0.8s shake',
        shine: 'shine 1.4s ease-in-out infinite ',
      },
      backgroundSize: {
        skeleton: '200px 100%',
      },
      keyframes: {
        bounce: {
          'from, 20%, 53%, to': {
            animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0)',
          },

          '40%, 43%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -15px, 0) scaleY(1.1)',
          },

          '70%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -7.5px, 0) scaleY(1.05)',
          },

          '80%': {
            animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0) scaleY(0.95)',
          },

          '90%': {
            transform: 'translate3d(0, -3px, 0) scaleY(1.02)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-slow': {
          '0%, 50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          from: {
            transform: 'scale3d(1, 1, 1)',
          },
          '50%': {
            transform: 'scale3d(1.05, 1.05, 1.05)',
          },
          to: {
            transform: 'scale3d(1, 1, 1)',
          },
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
    },
  },
  plugins: [],
}

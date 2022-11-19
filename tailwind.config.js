/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*-color-classes.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // ...colors,
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      gray: { 50: '#f3f4f5', ...colors.zinc, 950: '#0e0e10' },
      red: { ...colors.red, 950: '#330b0b' },
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      phosphorus: {
        100: '#3ae73a',
        200: '#3ae73a',
        400: '#3ae73a',
        500: '#3ae73a',
        600: '#27c827',
        700: '#289223',
        800: '#235f1c',
        900: '#183114',
        925: '#121811',
        950: '#021608',
        975: '#011206',
      },
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: { ...colors.cyan, 925: '#133b4b', 950: '#0d2832', 975: '#061419' },
      blue: { ...colors.blue, 950: '#101831' },
      violet: colors.violet,
      purple: { ...colors.purple, 950: '#1b1028' },
      fuchsia: colors.fuchsia,
      rose: colors.rose,
      taupe: { DEFAULT: '#655d63', dark: '#AEA4B9' },
    },
    fontFamily: {
      sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      mono: ["'Space Mono'", ...defaultTheme.fontFamily.mono],
      narrow: ["'Noto Sans Display'", ...defaultTheme.fontFamily.sans],
    },
    screens: {
      xs: '384px',
      ...defaultTheme.screens,
    },
    extend: {
      animation: {
        bounce: 'bounce 1s ease-in-out 1',
        'bounce-5': 'bounce 1s ease-in-out 5',
        'fade-in': 'fade-in 1s ease-in-out',
        'fade-in-slow': 'fade-in-slow 4s ease-in-out',
        pulse: 'pulse 1s ease-in-out 5',
        'pulse-infinite': 'pulse 4s ease-in-out infinite',
        shift: 'shift 30s ease-in-out infinite',
        shake: 'shift 30s ease-in-out infinite, 0.8s shake',
        shine: 'shine 1.4s ease-in-out infinite ',
        shockwave: 'shockwave 1s .65s ease-out 1',
        'shockwave-short': 'shockwave 1s .5s ease-out 1',
        'shockwave-jump': 'shockwave-jump 1s ease-out 1',
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
        shockwave: {
          '0%': {
            transform: 'scale(1)',
            boxShadow:
              '0 0 2px rgb(6 182 212 / 50%), inset 0 0 1px rgb(6 182 212 / 50%)',
          },
          '95%': {
            boxShadow:
              '0 0 50px rgba(0 0 0 / 0%), inset 0 0 30px rgba(0 0 0 / 0%)',
          },
          '100%': {
            transform: 'scale(2.25)',
          },
        },
        'shockwave-jump': {
          '0%': {
            transform: 'scale(1)',
          },
          '40%': {
            transform: 'scale(1.08)',
          },
          '50%': {
            transform: 'scale(0.98)',
          },
          '55%': {
            transform: 'scale(1.02)',
          },
          '60%': {
            transform: 'scale(0.98)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}

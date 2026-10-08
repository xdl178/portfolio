import {
  colors,
  fontFamily,
  fontSize,
  boxShadow,
  backgroundImage,
  keyframes,
  animation,
} from './src/design/tokens.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '24px',
        sm: '24px',
        lg: '32px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1280px',
      },
    },
    extend: {
      colors,
      fontFamily,
      fontSize,
      boxShadow,
      backgroundImage,
      keyframes,
      animation,
      maxWidth: {
        'content': '1120px',
        'prose-narrow': '720px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '42': '10.5rem',
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '28px',
        'pill': '999px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

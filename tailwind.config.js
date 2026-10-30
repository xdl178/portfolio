import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* HSL neutrals, RGB accent/material channels, complete HEX muted; see COLOR-SYSTEM.md. */
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        'bg-elev': 'hsl(var(--bg-elev) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'text-primary': 'hsl(var(--text) / <alpha-value>)',
        muted: 'var(--muted)',
        secondary: 'var(--secondary)',
        stroke: 'hsl(var(--stroke) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--accent-strong) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft-rgb) / <alpha-value>)',
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'inverse-text': 'rgb(var(--on-light-rgb) / <alpha-value>)',
        'surface-light': 'rgb(var(--surface-light-rgb) / <alpha-value>)',
        /* 品牌主色 #2686ED（全局变量来自 --brand-rgb） */
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
      },

      /* ---------- 字体（系统栈，见 design.md §3） ---------- */
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      /* ---------- 圆角体系（见 design.md §5） ---------- */
      borderRadius: {
        DEFAULT: 'var(--radius-rect)',
        sm: 'var(--radius-rect)',
        md: 'var(--radius-rect)',
        lg: 'var(--radius-rect)',
        xl: 'var(--radius-rect)',
        '2xl': 'var(--radius-rect)',
        '3xl': 'var(--radius-rect)',
        card: 'var(--radius-rect)',
        panel: 'var(--radius-rect)',
        field: 'var(--radius-rect)',
      },

      transitionDuration: { DEFAULT: 'var(--d-quick)', 200: 'var(--d-hover)', 300: 'var(--d-ui)', 500: 'var(--d-very-slow)', 700: 'var(--d-image-hover)' },
      transitionTimingFunction: { DEFAULT: 'var(--e-standard)', out: 'var(--e-decelerate)', 'in-out': 'var(--e-standard)', linear: 'var(--e-linear)' },

      /* ---------- 关键帧 ---------- */
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'translateY(-110%)' },
          '100%': { transform: 'translateY(210%)' },
        },
        'role-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-26px,0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '64px 64px' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.7', transform: 'scale(1.35)' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue var(--loop-scroll) var(--e-smooth) infinite',
        'role-fade-in': 'role-fade-in var(--d-role) var(--e-smooth) both',
        'float-slow': 'float-slow var(--loop-float) var(--e-io) infinite',
        shimmer: 'shimmer var(--loop-shimmer) var(--e-linear) infinite',
        'grid-pan': 'grid-pan var(--loop-grid) var(--e-linear) infinite',
        'pulse-soft': 'pulse-soft var(--loop-pulse) var(--e-io) infinite',
      },
    },
  },
  plugins: [animate],
}

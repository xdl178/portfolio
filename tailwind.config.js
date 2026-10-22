import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* ---------- 配色（HSL 分量 + alpha 通道，见 design.md §2） ---------- */
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        'bg-elev': 'hsl(var(--bg-elev) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'text-primary': 'hsl(var(--text) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        stroke: 'hsl(var(--stroke) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-strong': 'hsl(var(--accent-strong) / <alpha-value>)',
        'accent-2': 'hsl(var(--accent-2) / <alpha-value>)',
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
        card: '20px',
        panel: '24px',
        field: '12px',
      },

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
        'scroll-cue': 'scroll-cue 1.6s cubic-bezier(.22,1,.36,1) infinite',
        'role-fade-in': 'role-fade-in .45s cubic-bezier(.22,1,.36,1) both',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'grid-pan': 'grid-pan 24s linear infinite',
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

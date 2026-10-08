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
      colors: {
        ...colors,
        /* ===== 主题兼容层 =====
           参考实现里的组件大量使用 ink / paper / blood 这类记号，
           这里把它们重定向到本站的蓝白科技色，组件无需逐行改类名即可融入主题。 */
        'void': '#0B1220',
        'void-10': '#0F1728',
        'void-20': '#141F33',
        'void-30': '#1B2740',
        'ink-0': '#0B1220',
        'ink-line': '#E2E8F0',
        'ash': '#475569',
        'fog': '#64748B',
        'concrete': '#94A3B8',
        'paper': '#0B1220',        /* 浅底上的“主前景”= 墨蓝黑 */
        'paper-2': '#1B2740',
        'paper-3': '#475569',
        'bone': '#64748B',
        'cream': '#0B1220',
        'cream-soft': '#1B2740',
        'cream-muted': '#64748B',
        'mist-dim': '#94A3B8',
        'blood': '#4D6BFE',        /* 强调色 → 品牌蓝 */
        'blood-deep': '#2440CC',
        'rust': '#3A55E8',
        'marigold': '#00C2FF',     /* 次强调 → 科技青 */
        'ochre': '#7C4DFF',        /* 次强调 → 科技紫 */
        'mustard': '#10B981',
        'signal-blue': '#4D6BFE',
      },
      fontFamily,
      fontSize: {
        ...fontSize,
        /* ===== 主题兼容层：字号与字距 ===== */
        'brut-hero': ['clamp(64px, 14vw, 260px)', { lineHeight: '0.84', letterSpacing: '-0.045em', fontWeight: '800' }],
        'brut-display': ['clamp(52px, 11vw, 180px)', { lineHeight: '0.88', letterSpacing: '-0.04em', fontWeight: '800' }],
        'brut-title': ['clamp(40px, 7vw, 120px)', { lineHeight: '0.92', letterSpacing: '-0.035em', fontWeight: '750' }],
        'brut-sub': ['clamp(26px, 4vw, 64px)', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'brut-headline': ['clamp(22px, 2.6vw, 40px)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'brut-label': ['clamp(11px, 1vw, 13px)', { lineHeight: '1.2', letterSpacing: '0.18em', fontWeight: '600' }],
      },
      letterSpacing: {
        'brut-tight': '-0.045em',
        'brut-kerned': '-0.035em',
        'expo-track': '0.18em',
      },
      fontWeight: {
        'black': '900',
      },
      boxShadow: {
        ...boxShadow,
      },
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

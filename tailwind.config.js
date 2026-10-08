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
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        /* ===== 主色：黑白灰 95% ===== */
        'ink': '#0A0A0A',        /* 主黑 */
        'ink-2': '#141414',
        'ink-3': '#1C1C1C',
        'ink-4': '#262626',
        'concrete': '#3A3A3A',   /* 水泥灰 */
        'ash': '#5A5A5A',
        'fog': '#8A8A8A',
        'paper': '#F2EEE5',      /* 牛皮纸米白 · 主前景文字 */
        'paper-2': '#E8E2D3',
        'paper-3': '#D9CFB8',
        'bone': '#C8C2B6',       /* 骨色 */

        /* ===== 撞色：暗红 / 橙 / 芥末黄 5% ===== */
        'blood': '#C8281C',
        'blood-deep': '#8E1A12',
        'rust': '#B23A1E',
        'marigold': '#E85D2F',
        'ochre': '#D4B896',
        'mustard': '#C9952F',

        /* 兼容别名，避免旧写法报错 */
        'cream': '#F2EEE5',
        'mist': '#F2EEE5',
        'void': '#0A0A0A',
        'ink-line': '#3A3A3A',
      },
      maxWidth: {
        'content': '1200px',
        'wide': '1440px',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"PingFang SC"', '"HarmonyOS Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
        sans: ['"Satoshi"', '"PingFang SC"', '"HarmonyOS Sans SC"', '"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        scrawl: ['"Caveat"', '"Permanent Marker"', '"Bangers"', 'cursive'],
      },
      fontSize: {
        /* 海报式巨字排版 */
        'brut-hero': ['clamp(96px, 22vw, 360px)', { lineHeight: '0.82', letterSpacing: '-0.055em', fontWeight: '900' }],
        'brut-display': ['clamp(72px, 16vw, 280px)', { lineHeight: '0.84', letterSpacing: '-0.05em', fontWeight: '900' }],
        'brut-title': ['clamp(56px, 10vw, 200px)', { lineHeight: '0.88', letterSpacing: '-0.045em', fontWeight: '900' }],
        'brut-sub': ['clamp(36px, 6vw, 120px)', { lineHeight: '0.92', letterSpacing: '-0.035em', fontWeight: '900' }],
        'brut-headline': ['clamp(28px, 4vw, 72px)', { lineHeight: '0.95', letterSpacing: '-0.025em', fontWeight: '900' }],
        'brut-label': ['clamp(14px, 1.4vw, 20px)', { lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '700' }],
        /* 正文与元信息 */
        'peach-lead': ['19px', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        'peach-body': ['16px', { lineHeight: '1.72', letterSpacing: '0.02em' }],
        'expo-eyebrow': ['11px', { lineHeight: '1', letterSpacing: '0.32em', fontWeight: '700' }],
        'expo-meta': ['12px', { lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      letterSpacing: {
        'brut-tight': '-0.055em',
        'brut-kerned': '-0.04em',
        'expo-track': '0.32em',
      },
      borderRadius: {
        'card-lg': '16px',
        'card-md': '12px',
        'card-sm': '8px',
        'tag': '4px',
      },
      boxShadow: {
        /* 粗野 offset 阴影（硬阴影，无模糊） */
        'brut-press': '8px 8px 0 0 rgba(242,238,229,1)',
        'brut-press-blood': '8px 8px 0 0 rgba(200,40,28,1)',
        'brut-press-marigold': '8px 8px 0 0 rgba(232,93,47,1)',
        'brut-press-ink': '10px 10px 0 0 rgba(10,10,10,0.9)',
        'frame-outline': '0 0 0 1px rgba(242,238,229,0.2)',
        'halation': '0 30px 90px -20px rgba(200,40,28,0.22)',
      },
      backgroundImage: {
        /* 做旧噪点 / 半调网点 / 扫描线，全部内联 SVG，无需图片文件 */
        'grain':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'halftone':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(242,238,229,0.06)'/%3E%3Ccircle cx='10' cy='6' r='0.7' fill='rgba(242,238,229,0.05)'/%3E%3Ccircle cx='6' cy='12' r='0.9' fill='rgba(242,238,229,0.07)'/%3E%3C/svg%3E\")",
        'scanlines':
          'repeating-linear-gradient(0deg, rgba(242,238,229,0.03) 0px, rgba(242,238,229,0.03) 1px, transparent 1px, transparent 3px)',
        'paper-texture':
          'radial-gradient(ellipse at 30% 20%, rgba(216,200,160,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(180,150,100,0.12) 0%, transparent 50%)',
      },
      animation: {
        'pop-marquee': 'pop-marquee 40s linear infinite',
        'ticker-slow': 'ticker-slow 70s linear infinite',
        'pop-flicker': 'pop-flicker 3.2s ease-in-out infinite',
        'scan-vertical': 'scan-vertical 9s linear infinite',
        'brut-shake': 'brut-shake 0.4s ease-in-out infinite',
        'brut-float': 'brut-float 7s ease-in-out infinite',
        'stamp-hit': 'stamp-hit 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'pop-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'ticker-slow': {
          '0%': { transform: 'translateX(3%)' },
          '100%': { transform: 'translateX(-53%)' },
        },
        'pop-flicker': {
          '0%,100%': { opacity: '1' },
          '48%': { opacity: '0.3' },
          '49%': { opacity: '1' },
          '74%': { opacity: '0.6' },
          '75%': { opacity: '1' },
        },
        'scan-vertical': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'brut-shake': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-1px, 1px) rotate(-0.5deg)' },
          '50%': { transform: 'translate(1px, -1px) rotate(0.5deg)' },
          '75%': { transform: 'translate(-1px, -1px) rotate(-0.3deg)' },
        },
        'brut-float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translate(0, -10px) rotate(calc(var(--rot, 0deg) + 4deg))' },
        },
        'stamp-hit': {
          '0%': { transform: 'scale(2) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(-3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-3deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

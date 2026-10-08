/**
 * 设计令牌（Design Tokens）
 * ------------------------------------------------------------
 * 全部色值 / 字阶 / 动画集中在这里，tailwind.config.js 直接 import。
 * 想换整站配色，只改这一个文件即可，不用去翻组件。
 *
 * 风格：现代科技蓝白（DeepSeek 官网调性）
 *   - 底色：白 / 极浅冷灰
 *   - 文字：深墨蓝黑 + 中灰层次
 *   - 主色：科技蓝（品牌蓝），用于按钮、链接、强调数字
 *   - 质感：冷光渐变、玻璃拟态、柔和阴影、极细描边
 */

export const colors = {
  /* ===== 品牌蓝 ===== */
  'brand': '#4D6BFE',        /* 主色 · DeepSeek 蓝 */
  'brand-strong': '#3A55E8', /* hover / 按下 */
  'brand-deep': '#2440CC',   /* 深蓝 · 渐变端点 */
  'brand-soft': '#EEF2FF',   /* 极浅蓝底 · 卡片底 */
  'brand-line': '#DCE4FF',   /* 蓝色描边 */

  /* ===== 冷调中性色 ===== */
  'ink': '#0B1220',          /* 主文字 · 墨蓝黑 */
  'ink-2': '#1B2740',        /* 次标题 */
  'slate-ink': '#475569',    /* 正文辅助 */
  'slate-soft': '#64748B',   /* 说明文字 */
  'slate-faint': '#94A3B8',  /* 元信息 / 占位 */
  'line': '#E2E8F0',         /* 分隔线 */
  'line-soft': '#EEF2F7',    /* 更浅的分隔线 */
  'wash': '#F6F8FC',         /* 页面浅色区块底 */
  'mist': '#F1F5F9',         /* 标签底 / 骨架 */

  /* ===== 功能色 ===== */
  'cyan-tech': '#00C2FF',    /* 青色点缀 · 渐变副色 */
  'violet-tech': '#7C4DFF',  /* 紫色点缀 · 渐变副色 */
  'mint': '#10B981',         /* 成功 / 在线状态点 */
}

export const fontFamily = {
  /* Inter Tight 做主字体（含中文回退），JetBrains Mono 做编号与代码 */
  sans: ['"Inter Tight"', '"Inter"', '"PingFang SC"', '"HarmonyOS Sans SC"', '"Noto Sans SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
  display: ['"Inter Tight"', '"Inter"', '"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
}

export const fontSize = {
  /* 首屏巨字：随视口缩放，最小 44px 最大 96px */
  'hero': ['clamp(44px, 8.5vw, 96px)', { lineHeight: '1.04', letterSpacing: '-0.035em', fontWeight: '700' }],
  'hero-sub': ['clamp(28px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
  'section': ['clamp(26px, 3.6vw, 44px)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '650' }],
  'card-title': ['clamp(19px, 2vw, 24px)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
  /* 正文 */
  'lead': ['clamp(16px, 1.5vw, 19px)', { lineHeight: '1.8', letterSpacing: '0.005em', fontWeight: '400' }],
  'body': ['16px', { lineHeight: '1.75', fontWeight: '400' }],
  'body-sm': ['14px', { lineHeight: '1.7', fontWeight: '400' }],
  'meta': ['13px', { lineHeight: '1.5', fontWeight: '500' }],
  /* 小标签 / 眉标 */
  'eyebrow': ['12px', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '600' }],
  'tag': ['12px', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '500' }],
}

export const boxShadow = {
  'soft': '0 1px 2px rgba(11,18,32,0.04)',
  'card': '0 12px 32px -16px rgba(11,18,32,0.16)',
  'card-hover': '0 24px 56px -20px rgba(77,107,254,0.32)',
  'brand': '0 16px 40px -14px rgba(77,107,254,0.45)',
  'brand-soft': '0 8px 24px -12px rgba(77,107,254,0.35)',
  'nav': '0 8px 32px -18px rgba(11,18,32,0.28)',
}

export const backgroundImage = {
  /* 冷光径向：科技感的底光 */
  'glow-cool': 'radial-gradient(60% 60% at 50% 0%, rgba(77,107,254,0.16) 0%, rgba(77,107,254,0) 70%)',
  'glow-soft': 'radial-gradient(50% 50% at 80% 20%, rgba(0,194,255,0.14) 0%, rgba(0,194,255,0) 70%)',
  /* 品牌渐变：按钮 / 高亮文字 */
  'brand-gradient': 'linear-gradient(120deg, #4D6BFE 0%, #2440CC 55%, #00C2FF 120%)',
  'brand-soft-gradient': 'linear-gradient(135deg, #EEF2FF 0%, #F6F8FC 100%)',
  /* 极细网格，铺在浅色区块上当技术底纹 */
  'grid-tech':
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0v32' fill='none' stroke='rgba(11,18,32,0.05)' stroke-width='1'/%3E%3C/svg%3E\")",
  /* 右上角冷色渐隐，用于卡片 */
  'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(246,248,252,0.6) 100%)',
}

export const keyframes = {
  'marquee': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' },
  },
  'float-slow': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  'pulse-ring': {
    '0%': { transform: 'scale(0.9)', opacity: '0.7' },
    '70%': { transform: 'scale(1.6)', opacity: '0' },
    '100%': { transform: 'scale(1.6)', opacity: '0' },
  },
  'sheen': {
    '0%': { transform: 'translateX(-120%)' },
    '100%': { transform: 'translateX(220%)' },
  },
  'cursor-in': {
    '0%': { transform: 'scale(0.6)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}

export const animation = {
  'marquee': 'marquee 38s linear infinite',
  'float-slow': 'float-slow 6s ease-in-out infinite',
  'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
  'sheen': 'sheen 2.8s ease-in-out infinite',
}

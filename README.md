# ［工作室名称］ - 作品集

独立工作室单页作品集。**深空蓝黑 · 磨砂玻璃** 暗色科技风格。
React 19 + Vite 7 + TypeScript + Tailwind CSS 3 + GSAP + Framer Motion。

> 全站设计规则的单一事实来源是 [`design.md`](./design.md)。改样式前先读它。

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 http://localhost:5180
npm run build    # 类型检查 + 生产构建 → dist/
npm run preview  # 预览构建产物
npm run lint     # 仅类型检查（tsc --noEmit）
```

## 设计系统速览

### 配色（`src/index.css` `:root`，HSL 分量 + Tailwind alpha 通道）

| Token | HSL | 用途 |
|---|---|---|
| `--bg` | `222 47% 4%` | 页面底色（近黑深蓝） |
| `--bg-elev` | `222 40% 7%` | 抬升底色 |
| `--surface` | `220 36% 10%` | 玻璃基底 |
| `--text` | `210 40% 98%` | 主文字 |
| `--muted` | `215 22% 64%` | 次级文字 |
| `--stroke` | `213 28% 20%` | 描边 / 分隔线 |
| `--accent` | `190 92% 58%` | 主强调（电光青） |
| `--accent-2` | `288 88% 68%` | 点缀（仅光晕） |

品牌渐变 `--grad-accent`：`linear-gradient(120deg, #3CC6FF, #2ED9F5 45%, #C86BFF)`，只用于 1px 描边 / 光带 / 进度条。

### 字体

全站**系统字体栈**，不依赖任何外部 Web Font（可在无外网环境正常渲染）。
中文走 `--font-sans`，英文小标签 / 序号 / 数字走 `--font-mono`（大写 + 宽字距）。

### 材质与组件类

- 玻璃三档：`.glass-sm` / `.glass` / `.glass-lg`，配套 `.glass-hover`（hover 仅提亮边框 + 内高光，不加外发光）
- 按钮：`.btn` + `.btn-primary` / `.btn-ghost` / `.btn-outline`
- 排版基元：`.type-display` / `.type-h2` / `.type-h3` / `.type-body` / `.type-label` / `.type-num`
- 装饰层：`.bg-grid` / `.mask-radial` / `.noise` / `.glow-cyan` / `.glow-magenta` / `.hairline`
- 图片容器：`.media-crop`（裁掉生成图右下角水印）

### 圆角体系

交互件 `9999px` 全圆 / 卡片 `20px` / 输入 `12px`。不允许混用。

### 动效

- token：`--d-*`（时长，进慢出快）、`--e-*`（缓动，含 spring 过冲）
- 编排归属：GSAP 管首屏入场 / 视差 / 跑马灯；Framer Motion 管进入视口 / 微交互 / 灯箱；纯 CSS 管常驻循环
- 全部动画尊重 `prefers-reduced-motion`；`prefers-reduced-transparency` 时玻璃降级为不透明

## 页面结构

**路由式漫游（HashRouter）**：加载屏（仅首载）→ 全局导航 → 路由页 → 全局页脚；路由切换有页面转场（blur + 位移）并强制回顶。

**加载策略**：加载屏只等首屏大图（`fetch` 流式读字节 → 真实百分比，解码完成后才放行）；作品 / 影像图全部 `loading="lazy"` + `fetchPriority="low"`，进入页面后再异步拉取。

| 路由 | 页面 | 组成 |
|---|---|---|
| `/` | `HomePage` | Hero 巨字取景窗（SVG 蒙版透字 + 鼠标视差）→ `SelectedWorks` 精选作品 Bento（跳详情）→ `Explorations` 影像实验室 → `Clients` 客户墙 |
| `/works` | `WorksPage` | 巨字刊头 + 统计卡 + 分类筛选 + 不对称大卡（封面 7 列 / 信息 5 列奇偶交替） |
| `/works/:id` | `WorkDetailPage` | 面包屑 → 头牌（元数据 4 卡）→ 设计理念 → 页面陈列 → 原稿灯箱 → 相关作品 |
| `/about` | `AboutPage` | 巨字刊头 → `AboutCapabilities`（创作理念 + 能力网格）→ 经历时间线 |

全局：`Backdrop` 固定装饰层、`Navbar` 路由胶囊导航、`ContactFooter`（跑马灯 + 联系 CTA + 快捷链接）。
作品数据统一在 `src/data/works.ts`。

## 占位符约定

所有真实姓名 / 头衔 / 简介 / 作品 / 能力 / 客户数据已移除，统一使用 `［ ］` 包裹的占位符。回填真实内容时只改文案，不动结构。

## 无障碍与降级

- 全部动画尊重 `prefers-reduced-motion`（入场直呈终态、无限循环暂停、视差关闭）
- `prefers-reduced-transparency: reduce` 时玻璃面板降为不透明
- 焦点环全站可见（`#2ED9F5`）
- 390px 宽度无横向滚动，Bento / 能力网格降为单列
- 装饰元素一律 `aria-hidden` + `pointer-events: none`

## 目录

```
├── design.md                   # 全站设计规则（单一事实来源）
├── index.html
├── tailwind.config.js
└── src/
    ├── App.tsx                 # 外壳：加载屏 → Routes + 页面转场 → 全局页脚
    ├── main.tsx                # 入口（HashRouter + StrictMode）
    ├── index.css               # Token → 基础 → 玻璃材质 → 组件类 → 动效 → 降级
    ├── data/
    │   └── works.ts            # 作品数据源（works / categories / getWorkById / getRelatedWorks）
    ├── pages/
    │   ├── HomePage.tsx        # / 首页漫游
    │   ├── WorksPage.tsx       # /works 作品档案馆
    │   ├── WorkDetailPage.tsx  # /works/:id 详情（原稿灯箱）
    │   └── AboutPage.tsx       # /about 关于（能力 + 经历时间线）
    └── components/
        ├── Backdrop.tsx        # 全站固定装饰层
        ├── LoadingScreen.tsx
        ├── Navbar.tsx          # 路由链接导航（active 由 pathname 判定）
        ├── Hero.tsx            # 巨字取景窗（active 触发入场）
        ├── SelectedWorks.tsx   # 数据驱动，跳 /works/:id
        ├── AboutCapabilities.tsx
        ├── Explorations.tsx
        ├── Clients.tsx
        ├── ContactFooter.tsx   # 含快捷路由链接
        └── SectionHeader.tsx   # 统一章节头（eyebrow 可选，全站 ≤ 2 处）
```

## 图片素材

`public/images/` 下共 7 张占位素材：首屏背景 `hero-desk.jpg`（1672×941，238KB），其余为 AI 生成的占位图（`hero-tunnel` + `work-01..04` + `study-01`）。
换成真实作品图时保持同名同比例即可，`.media-crop` 会自动按 4:3 / 1:1 裁切。

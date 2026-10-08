# portfolio

xdl178 的个人作品集。技术栈与参考站（[zhuhongyu618/portfolio](https://github.com/zhuhongyu618/portfolio)）保持一致。

- 线上地址：https://xdl178.github.io/portfolio/
- 本地开发：`npm run dev` → http://localhost:5174

## 技术栈

| 类别 | 选型 | 用途 |
| --- | --- | --- |
| 构建 | Vite 8 | 开发服务器 + 打包 |
| 框架 | React 19 | UI |
| 路由 | react-router-dom 7（**HashRouter**） | 静态托管无需服务端回退 |
| 样式 | Tailwind CSS 3.4 + PostCSS + autoprefixer | 原子化样式 |
| 动画 | framer-motion 12 | 组件级过渡/手势 |
| 动画 | GSAP 3 | 时间轴、滚动驱动动画 |
| 滚动 | @studio-freight/lenis | 平滑滚动 |
| 导出 | html2canvas + jsPDF | 页面/作品导出 PDF |
| 检查 | oxlint | 静态检查 |

## 常用命令

```powershell
npm run dev        # 开发服务器，热更新，端口 5174
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览生产构建，端口 4173
npm run lint       # oxlint 检查
```

> 在这个环境里如果 `npm` 报「禁止运行脚本」，用 `npm.cmd` 代替 `npm`，
> 或者执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 放行。

## 目录结构

```
├─ index.html              # Vite 入口 HTML（字体、meta 在这里）
├─ index.legacy.html       # 最早的纯静态版页面，留作备份
├─ vite.config.js          # base 路径、dev server、分包策略
├─ tailwind.config.js      # 设计令牌：颜色/字阶/阴影/动画
├─ postcss.config.js
├─ .oxlintrc.json
├─ .github/workflows/deploy.yml   # 推 main 自动构建发布到 Pages
├─ public/                 # 原样拷贝的静态资源（图片、PDF 等）
└─ src/
   ├─ main.jsx             # 挂载 + HashRouter
   ├─ App.jsx              # 路由表
   └─ index.css            # Tailwind 入口 + 全局基础样式
```

## 部署（GitHub Pages）

推送 `main` 后，`.github/workflows/deploy.yml` 会自动 `npm ci → npm run build`，并把 `dist/` 发布到 Pages。

**仓库 Settings → Pages → Source 必须选 "GitHub Actions"**（不是 "Deploy from a branch"）。
这样 `dist/` 不需要提交进仓库，也不需要 gh-pages 分支。

### base 路径很重要

项目部署在 `https://xdl178.github.io/portfolio/`，属于**子路径**，
所以 `vite.config.js` 里必须是 `base: '/portfolio/'`。
如果改成根路径（自定义域名），构建时覆盖：

```powershell
$env:VITE_BASE='/'; npm run build
```

### 为什么用 HashRouter

GitHub Pages 是纯静态托管，无法把 `/works` 这类深链接回退到 `index.html`。
HashRouter 把路由放在 `#` 后面（`/portfolio/#/works`），刷新和直接访问都不会 404，
省掉了 `404.html` 重定向那套 hack。如果你坚持用 BrowserRouter，
需要额外复制 `dist/index.html` 为 `dist/404.html`。

## 设计令牌速查

`tailwind.config.js` 里已按参考站的视觉语言配好：

- **颜色**：`ink` / `ink-2` / `concrete` / `ash` / `fog`（黑灰）、`paper` / `paper-2` / `bone`（米白）、`blood` / `rust` / `marigold` / `ochre` / `mustard`（撞色）
- **字阶**：`text-brut-hero` / `brut-display` / `brut-title` / `brut-sub` / `brut-headline` / `brut-label`，`text-peach-lead` / `peach-body`（正文），`text-expo-eyebrow` / `expo-meta`（元信息）
- **字体**：`font-display`（Cabinet Grotesk）、`font-sans`（Satoshi）、`font-mono`（JetBrains Mono）、`font-scrawl`（Caveat）
- **阴影**：`shadow-brut-press` / `brut-press-blood` / `brut-press-marigold`（硬 offset，无模糊）
- **背景**：`bg-grain`（噪点）、`bg-halftone`（半调网点）、`bg-scanlines`（扫描线）、`bg-paper-texture`
- **动画**：`animate-pop-marquee` / `ticker-slow` / `pop-flicker` / `scan-vertical` / `brut-shake` / `brut-float` / `stamp-hit`

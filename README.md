# portfolio

xdl178 的个人作品集 —— 展厅式布局 + 现代科技蓝白风（参考 DeepSeek 官网调性）。

- 线上地址：https://xdl178.github.io/portfolio/
- 本地开发：`npm run dev` → http://localhost:5174

## 技术栈

| 类别 | 选型 | 用途 |
| --- | --- | --- |
| 构建 | Vite 8 | 开发服务器 + 打包 |
| 框架 | React 19 | UI |
| 路由 | react-router-dom 7（**HashRouter**） | 静态托管无需服务端回退 |
| 样式 | Tailwind CSS 3.4 + PostCSS + autoprefixer | 原子化样式 |
| 动画 | framer-motion 12 | 入场动画、路由过渡、悬停反馈 |
| 动画 | GSAP 3 | 自定义光标跟随（`quickTo` / `quickSetter`） |
| 滚动 | @studio-freight/lenis | 全站平滑滚动 + 锚点滚动 |
| 导出 | html2canvas + jsPDF | 页面/作品导出 PDF（已装好，尚未接入 UI） |
| 检查 | oxlint | 静态检查 |

## 常用命令

```powershell
npm run dev        # 开发服务器，热更新，http://localhost:5174
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览生产构建（注意：需用 http://localhost:4173/portfolio/）
npm run lint       # oxlint 检查
```

> 这个环境里如果 `npm` 报「禁止运行脚本」，改用 `npm.cmd`，
> 或执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 放行。

## 目录结构

```
├─ index.html                     # Vite 入口 HTML（字体、meta）
├─ index.legacy.html              # 最早的纯静态版页面，留作备份
├─ vite.config.js                 # base 路径、dev server、分包策略
├─ tailwind.config.js             # 引用 design/tokens.js，只做 Tailwind 装配
├─ .github/workflows/deploy.yml   # 推 main 自动构建发布到 Pages
├─ public/favicon.svg
└─ src/
   ├─ main.jsx                    # 挂载 + HashRouter + SmoothScrollProvider
   ├─ App.jsx                     # 路由表、页面过渡、光标挂载
   ├─ index.css                   # Tailwind 入口 + 按钮/卡片/文字等组件类
   ├─ design/tokens.js            # ★ 设计令牌：配色、字阶、阴影、渐变、动画
   ├─ data/content.js             # ★ 全站内容：个人信息、作品、技能、经历
   ├─ hooks/
   │  ├─ useSmoothScroll.jsx      # Lenis 平滑滚动 Provider + useLenis()
   │  └─ useCursorHalo.jsx        # GSAP 光标跟随 hook + <CursorHalo/>
   ├─ components/
   │  ├─ Navbar.jsx               # 固定顶部导航 + 移动端下拉菜单
   │  ├─ sections/                # 页面区块
   │  │  ├─ Hero.jsx              # 首屏：大标题 + 简介 + 头像卡 + 数据条
   │  │  ├─ Works.jsx             # 精选作品（首页取前 4 个）
   │  │  ├─ Services.jsx          # 能力/协作方式
   │  │  ├─ About.jsx             # 关于：简介 + 技能 + 经历时间线
   │  │  ├─ Contact.jsx           # 联系 CTA
   │  │  └─ Footer.jsx
   │  └─ ui/
   │     ├─ Avatar.jsx            # 头像（无图时自动生成首字母头像）
   │     ├─ Marquee.jsx           # 无缝跑马灯
   │     ├─ Reveal.jsx            # 入场动画包装器（Reveal/RevealGroup/RevealItem）
   │     └─ WorkCard.jsx          # 作品卡片
   └─ pages/
      ├─ Home.jsx                 # /            首页
      ├─ Works.jsx                # /works       作品列表（带分类筛选）
      └─ WorkDetail.jsx           # /works/:slug 作品详情（含下一个项目）
```

## 改内容 / 改风格

- **换文案和作品**：只改 `src/data/content.js`。所有 `占位` 字样都是待替换的示例内容。
- **换整站配色**：只改 `src/design/tokens.js` 的 `colors`。
- **换头像**：图片放进 `public/`，然后在 `content.js` 里设置 `profile.avatarImage = '/portfolio/avatar.jpg'`。
- **换作品封面**：给对应作品设置 `cover: '/portfolio/xxx.jpg'`；不设则显示自动生成的渐变封面。
- **加/删页面区块**：改 `src/pages/Home.jsx` 的组件顺序即可。

## 部署（GitHub Pages）

推送 `main` 后，`.github/workflows/deploy.yml` 自动 `npm ci → npm run build`，把 `dist/` 发布到 Pages。

**仓库 Settings → Pages → Source 必须是 "GitHub Actions"**（不是 "Deploy from a branch"）。
这样 `dist/` 不需要提交进仓库，也不需要 gh-pages 分支。

### base 路径（已处理好，改仓库名时注意）

`vite.config.js` 按命令区分：

- `build`：`base = '/portfolio/'`（子路径部署必需，否则资源 404）
- `dev`：`base = '/'`（所以本地是 `http://localhost:5174/`，不带前缀）

换仓库名或绑自定义域名时，构建时覆盖：

```powershell
$env:VITE_BASE='/'; npm run build
```

### 为什么用 HashRouter

GitHub Pages 是纯静态托管，无法把 `/works` 这类深链接回退到 `index.html`。
HashRouter 把路由放在 `#` 后面（`/portfolio/#/works`），刷新和直接访问都不会 404，
省掉了 `404.html` 重定向那套 hack。也正因为如此，锚点滚动不能用原生
`scrollIntoView`，必须交给 Lenis（见 `useSmoothScroll.jsx` 里的 hash 监听）。

## 已知的 lint 提示

`npm run lint` 会报 **3 条 warning、0 条 error**，都是有意的写法：

1. `useSmoothScroll.jsx` —— 在 effect 里 `setLenis(instance)`：外部实例必须等挂载后才能建，
   建完要暴露给 context，这是 Provider 的标准写法。
2. `useSmoothScroll.jsx` / `useCursorHalo.jsx` —— `only-export-components`：
   hook 和它的组件（Provider / CursorHalo）放在同一文件，是刻意的内聚设计。

## 组件与依赖对应关系（你要求的清单）

| 要求 | 实现位置 |
| --- | --- |
| 固定顶部 Navbar（Logo + 导航链接） | `src/components/Navbar.jsx` |
| Home 页（大标题 + 简介 + 头像） | `src/pages/Home.jsx` → `sections/Hero.jsx` + `ui/Avatar.jsx` |
| Lenis 全站平滑滚动 | `src/hooks/useSmoothScroll.jsx`，在 `main.jsx` 包住整个 App |
| Framer Motion 入场动画 | `ui/Reveal.jsx`（滚动入场）、`Hero.jsx`（首屏级联）、`App.jsx`（路由过渡） |
| GSAP 自定义光标 CursorHalo | `src/hooks/useCursorHalo.jsx`（`quickTo` 缓动跟随 + 悬停放大） |
| Tailwind CSS 样式 | `tailwind.config.js` + `src/design/tokens.js` + `src/index.css` |

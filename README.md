# portfolio

xdl178 的个人作品集 —— 展厅式布局 + 现代科技蓝白风。

- 线上地址：https://xdl178.github.io/portfolio/
- 本地开发：`npm run dev` → http://localhost:5174

## 技术栈

| 类别 | 选型 | 用途 |
| --- | --- | --- |
| 构建 | Vite 8 | 开发服务器 + 打包 |
| 框架 | React 19 | UI |
| 路由 | react-router-dom 7（**HashRouter**） | 静态托管无需服务端回退 |
| 样式 | Tailwind CSS 3.4 + PostCSS + autoprefixer | 原子化样式 + 设计令牌 |
| 动画 | framer-motion 12 | 入场动画、路由过渡、弹簧计数 |
| 动画 | GSAP 3 | 时间轴编排、手风琴画廊、光标跟随 |
| 滚动 | @studio-freight/lenis | 全站平滑滚动 + 锚点滚动 |
| 导出 | html2canvas + jsPDF | 已安装，尚未接入 UI |
| 检查 | oxlint | 静态检查 |

**没有引入任何 UI 组件库**：全部交互组件都是项目内的自研实现，只依赖上面这些包。

## 常用命令

```powershell
npm run dev        # 开发服务器，http://localhost:5174
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览生产构建
npm run lint       # oxlint 检查
```

> 本机 PowerShell 禁止运行 `npm.ps1`，若报「禁止运行脚本」就改用 `npm.cmd`，
> 或执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 放行。

## 页面

| 路由 | 页面 | 内容 |
| --- | --- | --- |
| `/` | 首页 | 首屏巨字 + 景深名片、数据条、能力卡、关于、项目经历、工作经历、精选作品、技术墙、工作原则、联系 |
| `/works` | 作品列表 | 分类筛选 + 作品网格 |
| `/works/:slug` | 作品详情 | 封面、正文、项目信息侧栏、下一个项目 |
| `/about` | 关于 | 名片、自述、数据、能力自评条、技能清单、工作经历、时间线 |

## 交互组件（`src/components/ui/`）

| 组件 | 能力 | 用在哪 |
| --- | --- | --- |
| `AccordionGallery` | GSAP 时间轴驱动的手风琴画廊：透视旋转、视差、标签淡入、方向键切换 | 首页精选作品 |
| `SkewedCarousel` | 倾斜 3D 轮播：拖拽、滚轮、指示点、自动播放、边缘缩放 | 首页工作原则 |
| `CardSpread` | 卡片扇形展开：交错动画、点击置前、方向键导航 | 首页项目经历 |
| `DriftWall` | 缓慢飘移的卡片墙：列速差异、指针排斥、悬停暂停 | 首页技术栈 |
| `FlowingMenu` | 悬停展开的菜单行：跟随鼠标方向的流动色带 | 页脚大菜单 |
| `TextLoop` | SVG 路径文字循环：缎带底、无缝衔接、悬停暂停 | 首屏与页脚收尾 |
| `BlurHighlight` | 逐词从模糊到清晰的揭示，关键词按主题色高亮 | 关于正文 |
| `BorderGlow` | 指针位置驱动的渐变边框光晕 | 能力卡、关于名片 |
| `DepthCard` | 3D 倾斜 + 内部分层视差 | 首屏名片 |
| `DepthText` | 文字分层纵深 + 轻微环绕 | 关于标题 |
| `CountUp` | 弹簧动画数字滚动 | 数据条、能力自评 |
| `ScrollReveal` | 子项依次滚入（渐进增强，默认可见） | 各区块 |
| `ScrollToTop` | 回到顶部按钮 | 全站 |
| `Ripple` | 点击波纹反馈 | 联系按钮 |
| `Reveal` / `Marquee` / `Avatar` / `WorkCard` | 基础入场、跑马灯、首字母头像、作品卡 | 多处 |

外壳组件（`src/components/`）：`Preloader`（进度加载页，含 4 秒硬兜底）、
`ScrollProgress`（顶部进度条）、`SideNav`（右侧章节指示器）、`Navbar`、`Footer`。

## 目录结构

```
├─ index.html                     # Vite 入口（字体、meta）
├─ index.legacy.html              # 最早的纯静态版页面，留作备份
├─ vite.config.js                 # base 路径、dev server、分包策略
├─ tailwind.config.js             # 装配 design/tokens.js + 主题兼容层
├─ .github/workflows/deploy.yml   # 推 main 自动构建发布到 Pages
├─ public/favicon.svg
└─ src/
   ├─ main.jsx                    # 挂载 + HashRouter + SmoothScrollProvider
   ├─ App.jsx                     # 路由表、页面过渡、光标/进度/侧边导航挂载
   ├─ index.css                   # Tailwind 入口 + 组件类 + 兼容工具类
   ├─ design/tokens.js            # ★ 设计令牌：配色、字阶、阴影、渐变、动画
   ├─ data/content.js             # ★ 全站内容：个人信息、作品、技能、经历、原则
   ├─ hooks/
   │  ├─ useSmoothScroll.jsx      # Lenis Provider（同时驱动锚点滚动）+ useLenis()
   │  └─ useCursorHalo.jsx        # GSAP 光标光晕 hook + <CursorHalo/>
   ├─ components/                 # 见上表
   └─ pages/                      # Home / Works / WorkDetail / About
```

## 改内容 / 改风格

- **换文案和作品**：只改 `src/data/content.js`。所有 `占位` 字样都是待替换的示例内容。
- **换整站配色**：只改 `src/design/tokens.js` 的 `colors`。
- **换头像**：图片放进 `public/`，然后在 `content.js` 里设置 `profile.avatarImage = '/portfolio/avatar.jpg'`。
- **换作品封面**：给对应作品设置 `cover: '/portfolio/xxx.jpg'`；不设则显示自动生成的渐变封面。

### 主题兼容层说明

早期移植过来的组件内部沿用了 `ink` / `void` / `cream` / `paper` / `blood` 这类语义记号，
`tailwind.config.js` 里的 **主题兼容层** 把它们重定向到本站的蓝白科技色
（例如 `blood` → 品牌蓝 `#4D6BFE`，`void` → 墨蓝黑 `#0B1220`）。
所以换配色时改 `tokens.js` 即可，不必去逐个组件改类名。

## 部署（GitHub Pages）

推送 `main` 后，`.github/workflows/deploy.yml` 自动 `npm ci → npm run build`，把 `dist/` 发布到 Pages。
**仓库 Settings → Pages → Source 必须是 "GitHub Actions"**。

### base 路径（已处理好）

`vite.config.js` 按命令区分：`build` 用 `/portfolio/`（子路径部署必需），`dev` 用 `/`。
换仓库名或绑自定义域名时，构建时覆盖：

```powershell
$env:VITE_BASE='/'; npm run build
```

### 为什么用 HashRouter

GitHub Pages 是纯静态托管，无法把 `/works` 这类深链接回退到 `index.html`。
HashRouter 把路由放在 `#` 后面（`/portfolio/#/works`），刷新和直接访问都不会 404。
代价是锚点滚动不能用原生 `scrollIntoView`，必须交给 Lenis（见 `useSmoothScroll.jsx`）。

## 已验证事项

用 Chrome DevTools Protocol 对**生产构建**和**线上站点**逐路由验证过：

- 所有路由正常渲染，15 个交互组件全部出现在 DOM 中
- 无横向溢出、无运行时错误、无加载页残留
- 资源路径带正确的 `/portfolio/` 前缀

开发中修掉的三个真实缺陷：

1. **Grid 塌陷**：CSS Grid/Flex 子项默认 `min-width: auto`，导致首屏 `1.25fr` 列被撑到 3134px、
   名片卡被挤出视口。现已在 `index.css` 里统一加 `min-width: 0` 兜住。
2. **滚动揭示隐形**：`ScrollReveal` 原本默认把子项设为 `opacity: 0`，
   若观察器未触发内容会永久不可见。改成「观察器挂上后才收起」的渐进增强写法。
3. **加载页兜底**：加了 4 秒硬兜底，避免分数计数异常时访问者被困在加载页。

## 已知的 lint 提示

`npm run lint` 报 **7 条 warning、0 条 error**，均为有意写法（在 effect 里初始化外部实例、
hook 与其组件同文件导出等），不阻塞构建。

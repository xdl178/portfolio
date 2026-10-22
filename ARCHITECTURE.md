# ARCHITECTURE.md — 项目架构说明

> 独立工作室作品集（蓝黑科技磨砂玻璃 · 巨字首屏 · 路由式漫游）
> 版本基线：`31a6a71`（main）
> 配套文档：`design.md`（视觉规则，唯一事实来源）、`README.md`（速览）、`HANDOVER.md`（交接与运维）

本文只讲**代码怎么组织、数据怎么流、为什么这么建**。视觉细节一律以 `design.md` 为准，不在这里重复。

---

## 1. 技术栈

| 层 | 选型 | 版本 | 作用 |
|---|---|---|---|
| 框架 | React | 19.1.1 | 函数组件 + Hooks，`StrictMode` 开启 |
| 语言 | TypeScript | 5.9.3 | `tsc -b` 严格模式（`strict` + `noUnusedLocals`） |
| 构建 | Vite | 7.1.9 | `@vitejs/plugin-react`，`base: './'` |
| 样式 | Tailwind CSS | 3.4.18 | + `tailwindcss-animate`，design token 挂在 `theme.extend` |
| 动画 A | framer-motion | 12.23.12 | 滚动驱动、`whileInView` 入场、路由转场、`layoutId` |
| 动画 B | GSAP | 3.13.0 | 时间线编排、`quickTo` 鼠标视差、`ScrollTrigger`、跑马灯 |
| 路由 | react-router-dom | 7.18.4 | `HashRouter`（4 条路由） |
| 字体 | 本地 woff2 分片 | — | 思源黑体 SC VF，481 片，`unicode-range` 按需加载 |

**没有的东西**（刻意保持轻量）：状态管理库（Redux/Zustand）、CSS-in-JS、UI 组件库、请求库、测试框架、ESLint/Prettier 配置、Lenis 平滑滚动（早期引入过，当前已移除）。

---

## 2. 目录结构

```
portfolio-landing/
├── index.html                  # 单页入口，lang=zh-CN，class="dark"，favicon 用 %BASE_URL%
├── design.md                   # ★ 视觉规则单一事实来源（改视觉前必读）
├── ARCHITECTURE.md             # 本文
├── HANDOVER.md                 # 交接与运维
├── vite.config.ts              # base './'、手动分包（4 个 vendor chunk）
├── tailwind.config.js          # token → Tailwind 主题映射、keyframes/animation
├── postcss.config.js           # tailwind + autoprefixer
├── tsconfig{,.app,.node}.json  # 三份：根引用、app（src）、node（配置文件）
├── public/
│   ├── favicon.svg
│   └── images/                 # 7 张位图素材（hero-desk.jpg + 6 张占位 PNG）
├── src/
│   ├── main.tsx                # 入口：字体 CSS → index.css → StrictMode + HashRouter + App
│   ├── App.tsx                 # ★ 外壳：真实预加载 → 加载屏 → 路由 + 转场 → 全局页脚
│   ├── index.css               # ★ 样式总入口（token → base → 玻璃 → 组件类 → 动效 → 降级）
│   ├── vite-env.d.ts
│   ├── assets/fonts/source-han-sans/
│   │   ├── fonts.css           # 481 条 @font-face，族名统一 "Source Han Sans CN"
│   │   └── *.woff2             # 481 片，24 MB
│   ├── data/
│   │   └── works.ts            # ★ 唯一作品数据源 + 派生查询函数
│   ├── pages/                  # 路由级页面（只做布局编排，不含区块内部实现）
│   │   ├── HomePage.tsx        # /
│   │   ├── WorksPage.tsx       # /works
│   │   ├── WorkDetailPage.tsx  # /works/:id
│   │   └── AboutPage.tsx       # /about
│   └── components/             # 可复用区块 / 全局层
│       ├── Backdrop.tsx        # 全站 fixed 装饰层（网格 + 光晕 + 噪点）
│       ├── LoadingScreen.tsx   # 加载屏（真实百分比 + 品牌环）
│       ├── Navbar.tsx          # 悬浮玻璃胶囊导航（fixed z-50）
│       ├── Hero.tsx            # 首屏（三层：背景 / 暗幕 / 内容）
│       ├── SectionHeader.tsx   # 统一章节头 + 共享入场常量
│       ├── SelectedWorks.tsx   # 首页精选作品 Bento 网格
│       ├── Explorations.tsx    # 影像实验室（GSAP ScrollTrigger 视差 + 灯箱）
│       ├── Clients.tsx         # 客户标记墙
│       ├── AboutCapabilities.tsx
│       └── ContactFooter.tsx   # 联系 CTA + GSAP 跑马灯 + 快捷路由
├── .github/workflows/deploy.yml # 推送 main → 构建 → GitHub Pages
├── .shots/                     # 本地验证脚本与截图（git 忽略）
└── .token                      # GitHub PAT（git 忽略，禁止提交）
```

**分层约定**：`pages/` 只负责"这一页由哪几块组成 + 数据怎么传"；区块实现全部在 `components/`；跨页共享的常量（如 `HEADER_VIEWPORT` / `HEADER_TRANSITION`）从 `SectionHeader.tsx` 导出。

---

## 3. 启动与渲染链路

```
main.tsx
  ├─ import fonts.css          → Vite 把 481 条 @font-face 收进产物 CSS
  ├─ import index.css          → token + 组件类
  └─ createRoot(#root)
       └─ StrictMode > HashRouter > App
            │
            ├─ useEffect ①：真实预加载首屏图
            │     fetch(hero-desk.jpg) → ReadableStream 读字节 → progress
            │     → img.decode() → blob objectURL → heroBg
            │     → 最短停留 1000ms → assetsReady=true
            │     → 兜底 watchdog 12s / 失败也放行
            │
            ├─ useEffect ②：isLoading ? body.overflow=hidden : ''   （只写，不存旧值）
            ├─ useEffect ③：history.scrollRestoration='manual'
            ├─ useEffect ④：路由变化 → scrollTo(0)
            │
            ├─ <AnimatePresence> LoadingScreen（仅首载）
            └─ motion.div 淡入
                 ├─ Backdrop            z-0   fixed
                 ├─ div.z-10 flex-col
                 │    ├─ Navbar         z-50  fixed
                 │    └─ main#main-content
                 │         └─ AnimatePresence mode="wait"（blur+位移 0.55s）
                 │              └─ Routes
                 └─ ContactFooter       全站页脚（在路由之外）
```

**关键设计**：`App` 是唯一持有"加载状态"的地方。`Hero` 不自己加载图，只接收 `bgSrc`（object URL）和 `active`（是否放行入场）。这样图只请求一次，加载屏撤掉的时刻 = 入场动画的起点，两者天然同步。

---

## 4. 数据流与状态边界

全站只有三处状态源，没有全局 store：

| 状态 | 位置 | 生命周期 | 去向 |
|---|---|---|---|
| `isLoading / progress / assetsReady / heroBg` | `App.tsx` | 首载一次 | `LoadingScreen`（progress/ready）、`HomePage → Hero`（active/bgSrc） |
| `filter`（分类筛选） | `WorksPage` | 页面内 | 过滤 `works` |
| `lightbox`（灯箱） | `WorkDetailPage` / `Explorations` | 选中期间 | 锁滚动 + Esc 关闭 |
| `scrolled`（导航态） | `Navbar` | 滚动 > 80px | `data-scrolled` 属性驱动 CSS |

**作品数据**：`src/data/works.ts` 导出 `works`、`categories`、`getWorkById`、`getRelatedWorks`。字段与参考项目 `portfolio-test` 的 `works.js` 对齐：

| 字段 | 类型 | 用途 |
|---|---|---|
| `id / serial` | string | 路由参数、序号 |
| `title / titleEn / categoryLabel / year / period / role` | string | 头牌与元数据卡 |
| `cover` | string | 列表封面 |
| `pageImages` | string[] | 详情页纵向页面陈列 |
| `originalImages` | `{src,label}[]` | 详情页原稿网格 + 灯箱 |
| `tags / shortDesc / concept / description / details` | string / string[] | 卡片标签、详情正文 |

数据是**静态模块**，构建期就被打进 `index.js`（52.9 KB 未压缩）。加作品只需往数组里追加对象，索引与统计自动派生（`WorksPage` 的统计卡是 `reduce` 出来的，不写死）。

---

## 5. 样式体系（三层 token）

```
第 1 层  src/index.css :root          —— 原始值（HSL 分量，便于 alpha 组合）
第 2 层  tailwind.config.js theme.extend —— 语义映射（bg / text-primary / accent / brand …）
第 3 层  src/index.css @layer components —— 组合类（.glass / .btn / .chip / .type-* …）
```

### 5.1 核心变量

```css
--bg: 222 47% 4%;            /* 页面底色 #05070D */
--text: 210 40% 98%;
--muted: 215 22% 64%;
--accent: 211 85% 54%;       /* = 品牌蓝 #2686ED */
--accent-strong / --accent-2 /* 同色相明暗派生，不得引入新色相 */
--brand-rgb: 38 134 237;     /* Tailwind `brand-*` 读这一条，rgb 分量形式才能用 bg-brand/40 */
--font-sans: 'Source Han Sans CN', …;
--font-mono: ui-monospace, …;
--grad-accent: linear-gradient(120deg, #6FB6FF, #2686ED 48%, #1B52C9);
```

**为什么 `--brand*` 用 rgb 分量、其余用 HSL 分量**：Tailwind 的 `<alpha-value>` 占位需要"裸分量"。HSL 分量配 `hsl(var(--x) / <alpha>)`，rgb 分量配 `rgb(var(--x) / <alpha>)`。写成完整色值（`#2686ed`）会让 `bg-brand/40` 这类透明度修饰失效。

### 5.2 组件类清单（`@layer components`）

- 玻璃三档：`.glass`（主面板）、`.glass-sm`（小卡/chip）、`.glass-lg`（大面板）+ `.glass-hover`
- 按钮：`.btn` 基类 + `.btn-primary` / `.btn-ghost` / `.btn-outline`
- 排版：`.type-display` / `.type-h2` / `.type-body` / `.type-label` / `.type-num`
- 装饰：`.text-gradient` / `.glow` / `.glow-brand` / `.glow-indigo` / `.bg-grid` / `.mask-radial` / `.noise` / `.hairline` / `.accent-ring`
- 媒体：`.media-crop`（绝对定位铺满 + 裁掉生成图水印）、`.media-crop-auto`（clip-path 适配置）
- 动效：`.pulse-dot` / `.scroll-cue-bar` / `.grad-accent` / `.glass-nav`

### 5.3 降级

`@media (prefers-reduced-motion: reduce)` 一刀切停掉动画；`@media (prefers-reduced-transparency: reduce)` 把玻璃降为不透明。JS 侧凡是 GSAP/Motion 编排都会先 `matchMedia` 判断再决定是否执行——**降级是双份的，CSS 与 JS 各管一半**，新增动画时两边都要照顾。

---

## 6. 字体方案

- 来源：`source-han-sans-sc-vf`（思源黑体 SC 可变字体 250–900，`cn-font-split` 切片产物）。
- 形态：481 片 woff2（24 MB）+ `fonts.css`（481 条 `@font-face`，每条带 `unicode-range` 与 `font-weight: 250 900`）。
- 接入：`main.tsx` 直接 `import './assets/fonts/source-han-sans/fonts.css'`，交给 Vite 做 hash 与产物输出，**不装 npm 依赖**（避免动 `package-lock.json` 触发跨平台 optional deps 问题）。
- 族名：统一声明为 `"Source Han Sans CN"`，并**删掉了 `local()` 回退**，保证一定命中项目内文件，不会被系统里的同名/近名字体顶替。
- 运行期：浏览器按页面实际用字只下载命中的分片（实测首屏 22 片）。代价是产物 CSS 变大（325.7 KB / gzip 127 KB，其中绝大部分是 `@font-face` 声明而非样式规则）。
- 连带影响：思源黑体的拉丁字母比系统字体宽，`PORTFOLIO` 在 240px 时会撑到 1418px 超出版心，因此字距固定为 `-0.01em`（收到 1374px）。**改字号或换字体都要重新量这一行。**

---

## 7. 动效编排归属（硬性分工）

两套动画库并存，靠"元素所有权"隔离，禁止交叉操作同一个 DOM：

| 工具 | 负责 | 具体位置 |
|---|---|---|
| **GSAP** | 时间线编排、命令式动画 | `Hero` 入场时间线（`.hero-bg-in / .hero-veil / .hero-line / .hero-anno / .hero-ui`）、鼠标视差 `quickTo`、`Explorations` 的 `ScrollTrigger` pin + 两列视差、`ContactFooter` 跑马灯 |
| **Motion** | 声明式、滚动绑定、进出场 | `Hero` 滚动离场（`useScroll` + `useTransform` → 背景 `scale` / 内容 `y+opacity`）、路由转场、`whileInView` 入场、`Navbar` 的 `layoutId` 药丸 |

隔离方式：滚动缩放包在 `motion.div`，GSAP 只管里层的 `.hero-p-bg`；两层是父子嵌套而非同级抢写 transform。

**不要用 `window.addEventListener('scroll')`**，滚动一律走 Motion 的 `useScroll` 或 ScrollTrigger。

---

## 8. 构建产物

`vite.config.ts` 按 vendor 手动分包（`manualChunks`），`base: './'` 让产物可丢到任意静态托管或直接本地打开：

| 产物 | 未压缩 | gzip |
|---|---|---|
| `react-vendor` | 216.7 KB | 67 KB |
| `motion-vendor` | 134.8 KB | 44 KB |
| `gsap-vendor` | 111.4 KB | 44 KB |
| `index`（业务代码 + 数据） | 52.9 KB | 13 KB |
| `router-vendor` | 37.2 KB | 13 KB |
| `index.css` | 325.7 KB | 127 KB |
| `dist/assets/`（含 481 片字体） | 24 MB | — |
| `dist/` 总计 | 35 MB | — |

字体占了产物 99% 的体积，但**是按需拉取**，不是首屏成本。首屏实际下载 ≈ JS gzip 181 KB + CSS gzip 127 KB + 首屏图 243 KB + 命中字体分片。

---

## 9. 部署链路

```
本地 main 分支
   │
   ├─ 方式 A（标准）：git push origin main
   │     └─ GitHub Actions: npm ci → npm run build → upload-pages-artifact → deploy-pages
   │
   └─ 方式 B（当前沙箱受限时）：node .workbuddy/tools/deploy-github-incremental.mjs <projectDir>
         └─ Git Data API：差异 blob → 40 条一块的 base_tree 链 → 单个 commit → PATCH refs/heads/main
            （绕过被封的 github.com，只依赖 api.github.com）
```

**为什么是「增量版」**：本项目 532 个文件（481 片字体），一次性 `POST /git/trees` 会触发 GitHub 422 "input too large"。增量版先用本地 git blob sha 比对远端 tree 只传差异，再按 40 条一块链式建树，最终仍只产出一个 commit。老的 `deploy-github.mjs` 只适用于小项目。

线上：`https://xdl178.github.io/portfolio/`，Pages 的 `build_type` 为 `workflow`（不需要 `gh-pages` 分支，也不提交 `dist`）。

**注意**：本地仓库**没有配置 git remote**（`git remote -v` 为空），历史上推送都走方式 B。如果要在本地用 `git push`，需先 `git remote add origin https://github.com/xdl178/portfolio.git` 并解决 github.com 的网络可达性。另：远端 HEAD 是 API 快照提交，与本地细粒度提交**树相同、sha 不同**，直接 `git push` 会 non-fast-forward。

---

## 10. 关键架构决策（ADR 摘要）

| # | 决策 | 原因 | 代价 |
|---|---|---|---|
| 1 | 用 `HashRouter` 而非 `BrowserRouter` | Pages 子路径托管 + 静态托管刷新 404，hash 路由不用服务端 rewrite | URL 带 `#` |
| 2 | 加载屏只等首屏图，作品图懒加载 | 真实百分比需要可测的字节流；把 24 MB 素材塞进首屏是灾难 | 作品页首次进入有二次加载 |
| 3 | 预加载结果以 object URL 传给 Hero | 避免加载屏刚拉完、Hero 又请求一次的重复流量 | URL 需 `revokeObjectURL` 管理 |
| 4 | 巨字全部用 HTML + `clamp()`，禁止写进 SVG | SVG `viewBox` 固定 16:9，非 16:9 视口会横向裁切贴边巨字（已踩） | 少了一点 SVG 排版能力 |
| 5 | 首屏所有文字收进 `max-w-[1400px]` 版心 | 宽屏下文字贴视口边会被拉散，失去版心感 | 2000px+ 视口两侧留白较大 |
| 6 | 背景 = 原图 + 一层 `bg-brand/40` | 用户明确要求保留原色，只轻薄罩色；`mix-blend-luminosity` 单色化会吃掉台灯暖光 | 图与主题色的统一性靠叠层，不能改图本身 |
| 7 | 单强调色（`#2686ED`），禁止第二色相 | 视觉统一；此前电光青 + 品红双色相被判"杂" | 渐变层次需靠同色相明度拉开 |
| 8 | 导航保持黑白中性，只有渐变环带色 | 用户明确要求"只把原本彩色的改蓝，其余保持中色" | 导航与首屏色感略脱节，靠 monogram 渐变环呼应 |
| 9 | 字体文件直接入库，不走 npm 依赖 | 避免 `package-lock.json` 变动引发跨平台 optional deps 构建失败（已踩一次） | 仓库 37 MB |
| 10 | 文案全部用 `［ ］` 占位符 | 交付前需替换为真实内容，占位符让"哪些是假数据"一眼可辨 | 上线前必须全量回填 |

---

## 11. 硬性约束清单

改代码前请确认不违反（违反过的都已写进 `design.md`）：

1. **锁滚动禁止"存旧值再恢复"**。只写 `hidden` / `''`。StrictMode 二次执行会把 `hidden` 存成旧值，导致鼠标滚轮永久失效。
2. **GSAP 与 Motion 不操作同一元素**，用嵌套隔离。
3. **首屏文字不在 SVG 里**，用 HTML + `clamp()`。
4. **`PORTFOLIO` 全站只出现一次**，240px 描边，字距 `-0.01em`。
5. **暗幕中间节点保持 `0`**（36% 处），否则背景中段被压暗、画面发闷。
6. **背景必须铺满**（`inset-0 + object-cover`），禁止"小图 + 模糊底衬"的画中画，否则 40% 蓝色层会露出未覆盖的边。
7. **不引入第二个强调色相**，新元素一律 `accent / brand` 派生。
8. **所有动画必须有 `prefers-reduced-motion` 降级**。
9. **新文案的中文自动命中字体分片**，无需额外处理；但不要把中文塞进 `font-mono` 标签。
10. **不提交 `.token`**（`.gitignore` 已覆盖 `.token` / `*.token` / `*cred*`；部署脚本还会做内容级明文扫描）。

---

## 12. 扩展指引

| 想做的事 | 改哪里 |
|---|---|
| 加一件作品 | `src/data/works.ts` 追加对象（`id` 唯一，`category` 需在 `categories` 里） |
| 加一个页面 | `src/pages/` 建组件 → `App.tsx` 加 `<Route>` → `Navbar` 的 `NAV_LINKS` 加条目 |
| 改主题色 | 只改 `index.css` 的 `--brand-rgb` 与 `--accent*`，再全量搜一遍硬编码色值 |
| 改首屏布局 | 先读 `design.md §7.0`，只动 `Hero.tsx`，别碰 `App.tsx` 的加载链 |
| 改视觉规范 | 先改 `design.md`，再改代码。文档先行是这项目的既定流程 |
| 换首屏图 | 替换 `public/images/hero-desk.jpg`（`App.tsx` 的 `HERO_IMAGE` 引用它），保持约 16:9、≤300 KB |
| 接真实作品图 | 保持同名同比例放进 `public/images/`，`.media-crop` 会自动裁切 |

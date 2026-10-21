# design.md — 全站设计规则

> 「深空蓝黑 · 磨砂玻璃」独立工作室作品集
> 单一事实来源（single source of truth）。任何新增区块、组件、动效都必须先在此文档找到对应规则再实现；规则冲突时以本文档为准。

---

## 0. 设计读取（Design Read）

**Reading this as: 独立工作室 / 个人作品集单页，面向品牌方与产品决策人，采用「深空蓝黑 + 磨砂玻璃 + 电光青」的暗色科技语言，落到 原生 CSS + Tailwind v3 token 体系 + GSAP/Motion 编排（该美学没有官方设计系统，属自建风格层）。**

| 转盘 | 取值 | 理由 |
|---|---|---|
| `DESIGN_VARIANCE` | **8** | 不对称栅格、超大留白、错位构图，拒绝居中对称 |
| `MOTION_INTENSITY` | **8** | 首屏必须惊艳：入场编排 + 滚动视差 + 玻璃高光跟随 |
| `VISUAL_DENSITY` | **4** | 画廊感，区块间距慷慨，信息克制 |

**主题锁定：全站暗色（Dark only）。** 页面任何区块不得反转成亮色。亮色模式不在本版范围内。

**模式判定：Redesign - Overhaul（视觉语言重做，保留信息架构与跳转逻辑）。** 保留：锚点 id 体系、`scrollToSection` 跳转逻辑、区块顺序、加载屏 → 主内容 → 页脚的外壳流程。重做：配色、字体、材质、圆角、动效、全部文案。

---

## 1. 视觉概念

参考意象：一条向下延伸的几何隧道。远处有一个发光的消失点，冷青色光线沿棱线流动，空气中悬浮着微光尘粒，品红激光偶尔斜切画面。前景是几块**磨砂玻璃面板**，反射着环境光，边缘有一道 1px 的冷光描边。

由此推导三条不可动摇的视觉法则：

1. **光来自深处** —— 页面亮度由「中心/远端的径向光晕」提供，不是靠把背景调亮。背景永远接近纯黑（`--bg`），发光靠 `radial-gradient` + 高光描边 + `blur` 光斑。
2. **一切表面都是玻璃** —— 卡片、导航、按钮、弹窗统一使用 §4 的玻璃配方；没有纯色实心卡片。层级靠「模糊深度 + 边框亮度」表达，不靠重投影。
3. **青色是唯一的「活」色** —— 电光青代表可交互/在线/强调；品红只在**光晕和渐变尖端**出现，用量 < 5%，永不用于文字或按钮底色。

---

## 2. 色彩 Token

定义在 `src/index.css` 的 `:root`（HSL 分量，无 `hsl()` 包裹，Tailwind 自动补）。Tailwind 侧同时暴露 `bg / surface / text-primary / muted / stroke / accent / accent-2`。

| Token | HSL | 近似 HEX | 用途 |
|---|---|---|---|
| `--bg` | `222 47% 4%` | `#05070D` | 页面底色（近黑深蓝） |
| `--bg-elev` | `222 40% 7%` | `#0A0F19` | 抬升底色 / 区块交替 |
| `--surface` | `220 36% 10%` | `#101827` | 玻璃面板基底 |
| `--text` | `210 40% 98%` | `#F7FAFF` | 主文字（近白，非纯白） |
| `--muted` | `215 22% 64%` | `#93A2B8` | 次级文字 / 元信息 |
| `--stroke` | `213 28% 20%` | `#26303F` | 描边 / 分隔线 |
| `--accent` | `190 92% 58%` | `#2ED9F5` | 主强调（电光青） |
| `--accent-strong` | `199 95% 62%` | `#3CC6FF` | 强调色深端 / hover |
| `--accent-2` | `288 88% 68%` | `#C86BFF` | 点缀（品红/紫，仅光晕与渐变尖端） |

**品牌渐变（仅用于 1px 描边、进度条、光带，不用于大面积填充）：**

```css
linear-gradient(120deg, #3CC6FF 0%, #2ED9F5 45%, #C86BFF 100%)
```

**色彩纪律（强制）**

- 青色 `--accent` 是全站**唯一**的交互强调色，所有区块一致，不得出现第二个功能色（不出现绿/橙/红按钮）。
- 品红 `--accent-2` 仅出现在光晕、渐变收尾、极小的焦点光斑，单屏可见面积 < 5%。
- 禁止纯黑 `#000` 与纯白 `#fff`：一律用 `--bg` / `--text`。
- 禁止「AI 紫渐变铺底」「霓虹外发光糊满全屏」。光晕要有中心、有衰减、有节制。
- **证券/涨跌语义不在本项目范围**；若未来接入数据，遵循中国市场「红涨绿跌」。

---

## 3. 字体与字阶

**不引入任何外部 Web Font（含 Google Fonts）。** 原因：目标用户网络环境不可控，外链字体是渲染阻塞 + 失效风险。全站使用系统字体栈，中文优先，靠字重/字距/大小写营造科技感。

```css
--font-sans : "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Microsoft YaHei",
              "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono : ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Mono",
              Consolas, "Liberation Mono", monospace;
```

- **中文**走 `--font-sans`，是文案主体。
- **英文点缀**（小标签、序号、元信息、按钮副标）走 `--font-mono` 大写 + 宽字距，是「科技感」的主要来源。
- 禁止在同一行混排衬线体；标题内强调用**同族加粗**或青色调，不用斜体衬线。本项目**不使用斜体衬线体**（旧的 Instrument Serif 已废弃）。

| 语义 | 类 | 尺寸 | 备注 |
|---|---|---|---|
| 首屏巨字「未来」 | 内联 clamp（HTML，非 SVG） | 桌面 `clamp(7rem,15.2vw,14.5rem)` / 移动 `clamp(2.6rem,40vw,9.75rem)` | 字重 700，行高 0.86（§7.0） |
| 首屏主标题 | `.type-display` | `clamp(2.6rem, 7vw, 6rem)` | 字重 700，行高 1.02，字距 -0.02em |
| 区块标题 H2 | `.type-h2` | `clamp(1.9rem, 3.6vw, 3.1rem)` | 字重 650，行高 1.1 |
| 卡片标题 H3 | `.type-h3` | `1.25rem` | 字重 600 |
| 正文 | `.type-body` | `1rem` / 1.75 | `--muted`，`max-width: 62ch` |
| 小标签 / 序号 | `.type-label` | `0.6875rem` | `--font-mono`，`uppercase`，`letter-spacing .28em` |
| 数字 | `.type-num` | 视场景 | `--font-mono`，`font-variant-numeric: tabular-nums` |

**占位符约定（文案层）** —— 所有真实姓名/头衔/简介/作品/技能/经历数据已移除，统一替换为半角方括号包裹的占位符，**中文为主、英文点缀**：

| 语义 | 占位符 |
|---|---|
| 品牌 / 工作室 | `［工作室名称］` |
| 姓名 | `［姓名］` |
| 头衔 | `［角色 · 头衔］` |
| 一句话简介 | `［一句话简介］` |
| 作品 | `［作品标题 01］` … `［作品标题 04］` |
| 能力 | `［能力名称］` |
| 客户 | `［客户 A］` … |
| 联系方式 | `hello@studio.example` |
| 年份 / 版权 | `© 2026 ［工作室名称］` |

占位符字体与正文一致，不用特殊色（避免被误认为强调）。真实内容回填时**只改文案，不动结构**。

---

## 4. 玻璃材质（核心配方）

全站唯一的表面语言。三档，禁止自创第四档。

| 档位 | 类 | 用途 |
|---|---|---|
| `glass-1` | `.glass-sm` | 小控件：标签、序号徽章、社交胶囊 |
| `glass-2` | `.glass` | 默认：导航、按钮、作品卡、能力卡 |
| `glass-3` | `.glass-lg` | 大面板：区块容器、弹窗、灯箱 |

配方要点（`index.css` `@layer components`）：

```css
.glass {
  background: linear-gradient(135deg, rgb(255 255 255 / .06), rgb(255 255 255 / .02));
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgb(255 255 255 / .10);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .12), 0 24px 60px -24px rgb(0 0 0 / .75);
}
```

- **边缘冷光**：hover / 聚焦时边框由 `rgb(255 255 255 / .10)` 过渡到 `rgb(46 217 245 / .45)`，同时 inset 高光变亮。这是玻璃「活过来」的唯一方式，不要加外发光阴影。
- **降级**：`@media (prefers-reduced-transparency: reduce)` 时背景改为不透明 `--surface`，`backdrop-filter: none`。
- **性能**：`backdrop-filter` 只用在**静态定位**的卡片/面板上；不要在滚动容器或大面积随滚动重绘的元素上叠 blur。

**光晕层（`.glow-*`）**：由 `radial-gradient` 生成的固定/绝对定位光斑，`pointer-events-none`、`aria-hidden`。首屏 1 个主光晕 + 1 个品红副光晕；其余区块最多 1 个弱光晕。禁止每个区块都摆光晕。

---

## 5. 圆角、描边、间距

- **圆角体系（Shape Lock，唯一规则）**
  - 交互件（按钮、标签、胶囊）：`9999px` 全圆
  - 卡片、面板、图片容器：`20px`（`rounded-[20px]`）
  - 输入 / 小徽章：`12px`
  - 不允许在同一个组件里混用两套圆角。
- **描边**：优先 1px 半透明白（`rgb(255 255 255 / .10)`）；分隔线用 `--stroke`。禁止给每个列表行都加 `border-y`；长列表用分组或卡片化。
- **间距标尺**：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`（px）。区块垂直间距 `py-24 md:py-32`，大屏 `py-40`。
- **容器**：`max-w-[1240px] mx-auto px-6 md:px-10 lg:px-16`。宽画廊可用 `max-w-[1440px]`。
- **首屏**：`min-h-[100svh]`（禁止 `h-screen`，避免移动端地址栏跳动）；采用「巨字取景窗」构图（见 §7.0），信息锚定**底部信息栏**，不做居中堆叠。
- 高变差（variance ≥ 8）的栅格在 `< 768px` **必须**塌陷为单列（`grid-cols-1` + `w-full`）。

---

## 6. 动效规范

统一采用 transitions.dev 的语义 token（时长/缓动） + beUI 的 spring 曲线（过冲）。**禁止魔法数字**。

### 6.1 时长

| Token | 值 | 用途 |
|---|---|---|
| `--d-stagger` | 40ms | 列表项错开 |
| `--d-micro` | 80ms | 抖动、tooltip 延迟 |
| `--d-quick` | 150ms | 关闭类、文字切换 |
| `--d-fast` | 250ms | 打开类、图标切换、hover |
| `--d-medium` | 350ms | 面板关闭 |
| `--d-slow` | 400ms | 面板打开、内容揭示 |
| `--d-very-slow` | 500ms | 强调时刻（徽章出现、文本揭示） |

**铁律：进慢出快**（打开 250ms、关闭 150ms）。

### 6.2 缓动

| Token | 值 | 用途 |
|---|---|---|
| `--e-smooth` | `cubic-bezier(.22,1,.36,1)` | 万金油位移/滑页 |
| `--e-io` | `ease-in-out` | 原位切换（文字/图标） |
| `--e-out` | `ease-out` | tooltip |
| `--e-linear` | `linear` | 循环（shimmer / pulse / 走光） |
| `--e-spring` | `cubic-bezier(.34,1.56,.64,1)` | 按压回弹、药丸滑动 |
| `--e-morph` | `cubic-bezier(.32,1.25,.4,1)` | 高度/壳体 morph |

### 6.3 编排归属（禁止混用）

| 场景 | 工具 |
|---|---|
| 首屏入场、滚动视差、跑马灯、加载屏计数 | **GSAP**（`gsap.context` + `ScrollTrigger`） |
| 元素进入视口、hover 微交互、状态切换、灯箱开合 | **Motion**（`framer-motion`） |
| 常驻循环（走光、脉冲） | **纯 CSS keyframes** |

**禁止**：`window.addEventListener('scroll')`；用 React state 跟踪鼠标/滚动连续值（用 Motion `useMotionValue`）；GSAP 与 Motion 操作同一个元素。

### 6.4 硬性要求

- **每个动画都要有一句理由**（层级引导 / 叙事揭示 / 操作反馈 / 状态过渡）；说不出理由就删掉。
- **`prefers-reduced-motion: reduce` 全量降级**：入场直呈终态、无限循环暂停、视差关闭、跑马灯静止、`scroll-behavior: auto`。
- ScrollTrigger 用规范骨架：`start: 'top top'` + `pin: true` + 正确 `scrub`；`useEffect` 必须有 cleanup（`ctx.revert()`）。
- 只动 `transform` 与 `opacity`。
- **跑马灯全站最多 1 处**（本版放在页脚）。

---

## 7. 组件规范

### 7.0 首屏 `Hero`（巨字取景窗）
- **背景素材**：`public/images/hero-desk.jpg`（1672×941，约 238KB）。工作台场景 = 显示器居中、左侧暖色台灯、右下桌面色块。
- **概念**：暗幕罩住整张工作台照片，巨型汉字「创造」以 SVG luminance mask 镂空（黑字 = 挖洞），且**正好落在显示器屏幕范围内**——屏幕里的光从字形透出来；实心巨字「未来」压在左下方暗带上。
- **对位纪律（硬性）**：照片与暗幕必须处在**同一个变换容器**（`.hero-zoom`）里，缩放 / 视差统一施加；禁止背景与蒙版反向视差、禁止只缩放照片。否则镂空窗会漂离屏幕，"字里透光"立刻穿帮。
- **巨字「未来」用 HTML 排版，禁止写进 SVG**：`viewBox` 固定 16:9，在非 16:9 视口（1440×900、900×800…）会横向裁切，贴边的 SVG 字会被切掉。改用 `clamp(7rem,15.2vw,14.5rem)`（桌面）/ `clamp(2.6rem,40vw,9.75rem)`（移动）+ `bottom-[27%]` 定位，任何视口都完整。
- **对比纪律**：暗幕不透明度 0.54–0.95（用 `#060A12`，禁止纯黑）；字洞内叠径向青色辉光 ≤ 0.42；并叠一道 `1.2px` 青色发丝描边（`#8FEEFF`，不透明度 0.32）界定窗口——屏幕本身很亮，没有描边时镂空形状读不出来。
- **双构图**：桌面 / 移动两套 SVG viewBox（`1440×810` / `390×844`），`preserveAspectRatio="xMidYMid slice"`，`md` 断点切换；mask / gradient 的 id 必须按 D/M 区分，禁止重复。移动端可见区只有照片中间约 26% 宽（正好是屏幕），所以移动端镂空窗要落在纵向 260–400 之间。
- **动感来源（静态图方案，0 积分）**：整层呼吸缩放（`1.005 → 1.028`，30s alternate）+ 斜向光带扫过（11s）+ 悬浮微尘（CSS `particle-rise`）+ 鼠标整层视差（-14 / -9px，GSAP `quickTo`）。**缩放幅度必须 ≤ 3%**，否则巨字会显得在膨胀。
- **入场**：由 App 传入的 `active` prop（首屏图加载完成 + 加载屏结束）触发，只播一次：背景模糊落定 → 暗幕浮现（字洞显现）→ 巨字升起 → 注记 / UI 错落进场。`prefers-reduced-motion` 直呈终态。
- **信息栏**：底部左 = 一句话简介占位 + 双 CTA；右 = 状态 chip + GMT+8 时钟（`sm` 起）；居中滚动指示 `lg` 起。品牌占位在**右上**（左上留给 SVG 注记 `01 / CREATE`）。
- **滚动离场**：内容层上移淡出（Motion `useScroll`），背景微放大；GSAP 与 Motion 不操作同一元素（分层嵌套隔离）。

### 7.0.1 加载屏 `LoadingScreen`（真实预加载）
- **进度必须是真的**：由 `App` 用 `fetch` + `ReadableStream` 读 `content-length` 计算字节比，禁止用定时器伪造百分比。无 `content-length` 时退回渐近曲线，且上限锁 `0.99`，绝不虚报 100。
- **预加载范围只有首屏图**：作品 / 影像图一律 `loading="lazy"` + `fetchPriority="low"`，进入页面后再按需拉取。禁止把全部图片塞进加载屏。
- **放行条件**：图片 `img.decode()` 成功（真正可绘制）后才回调；加载屏最短停留 `1000ms` 防"闪一下"；`12s` 超时看门狗兜底，网络卡死也不锁住用户。
- **非首页直达**（`/works`、`/about`）不预加载首屏图，避免为用不到的图等带宽。
- 计数器做"追赶"缓动（每帧补 15% 差值，只增不减，到点即停），避免字节抖动造成数字乱跳。

### 7.1 导航 `Navbar`（透明悬浮玻璃胶囊）
- 顶部居中悬浮，`fixed`，高度 ≤ 72px，桌面**单行**。
- 玻璃胶囊（`glass`）+ 滚动 > 80px 时提升边框亮度与模糊（不是加阴影）。
- 左侧 logo：渐变环 + 内嵌字母组合，点击 `Link` 回首页；hover 环旋转 180°。
- 中部链接：`首页 / 作品 / 关于`，**路由链接**（`Link`），激活项由 `pathname` 判定并用 Motion `layoutId` 药丸指示器滑动。
- 右侧 CTA：「联系我们」（mailto），hover 浮现渐变描边。

### 7.2 按钮
- 主按钮：青色实底 + 深色文字（保证 4.5:1 对比），hover 微放大 + 亮度提升。
- 次按钮：玻璃 + 1px 描边，hover 边框变青。
- 文字按钮：`--muted` → `--accent`。
- **标签不超过 4 个汉字（或 2 个英文词）**，桌面禁止换行；同页同义 CTA 只保留一种措辞（全站统一「联系我们」）。

### 7.3 作品卡 `WorkCard`
- 玻璃容器 + 20px 圆角 + 图片铺满（`.media-crop` 裁掉生成图右下角水印）。
- hover：图片 `scale(1.05)`、青色描边亮起、底部信息条上浮、光标跟随高光（CSS 变量 `--mx/--my` 驱动的 radial highlight）。
- 结构：序号（mono） / 标题（中文） / 类别（英文 mono 小字）。
- 禁止在图上叠彩色标签 pill。

### 7.4 能力卡 `CapabilityCard`
- 玻璃卡 + 图标（线性图标，统一 `stroke-width: 1.5`）+ 中文能力名 + 英文副标 + 一行说明。
- 图标若无法用图标库获取，用**极简几何符号**（一个圆/方/角），不手绘复杂插画。

### 7.5 客户墙 `ClientWall`
- **只放标记，不放分类文字**。虚构品牌用字母组合 monogram（内联 SVG，单色 `currentColor`），hover 由 `--muted` 变 `--text`。
- 栅格排列（非跑马灯）；`< 640px` 降为 2 列。

### 7.6 章节头 `SectionHeader`
- 可选 `eyebrow`（英文 mono 小标签，**全站最多 2 处**）+ 中文标题 + 可选副标。
- **禁止**「左侧大标题 + 右侧小段落」的分栏式章节头；标题与副标一律纵向堆叠。
- 不做编号式 eyebrow（`01 / INDEX`）、不做 `border-y` 分隔。

### 7.7 灯箱 / 弹窗
- `glass-lg` 面板 + 背景 `bg-black/80 backdrop-blur`；打开锁滚动、`Esc` 关闭、点击遮罩关闭。

---

## 8. 文案规范

- 中文为骨架，英文为点缀（小标签/序号/类别）。
- **占位符**用 `［ ］` 包裹（见 §3）。
- 禁止 em-dash（`—`）与 en-dash（`–`）作分隔或装饰，一律用普通连字符 `-`。
- 禁止填充词：「赋能 / 无缝 / 颠覆 / 引领 / 极致」等空词。
- 每条首屏副文案 ≤ 20 字；区块副标 ≤ 30 字。
- 禁止编造精确数据（`99.99%`、`4.1×`）。数据位一律占位符（`［ ］`）或删除。

---

## 9. 无障碍与降级（强制）

- 正文对比度 ≥ 4.5:1，大标题 ≥ 3:1；玻璃面上的文字必须叠在不低于 `rgb(5 7 13 / .55)` 的暗底上。
- 全部装饰元素 `aria-hidden` + `pointer-events: none`。
- 焦点可见：`:focus-visible` 2px `#2ED9F5` + `offset 2px`。
- 图片必须有 `alt`（装饰图 `alt=""`）。
- 语义标签：`header / nav / main / section / footer`，每区块有可读锚点 id。
- 移动端 390px 无横向滚动。
- 装饰噪点/网格只允许作为 `fixed`、`pointer-events-none` 的伪元素层。

---

## 10. 目录与路由

**路由式漫游（HashRouter，参考 portfolio-test 跳转逻辑）。** 外壳：加载屏（仅首载）→ 全局导航 → 路由页 → 全局页脚；路由切换伴随页面转场（Motion `AnimatePresence mode="wait"`，blur + 位移，0.55s）并强制回顶。

| 路由 | 页面组件 | 内容 |
|---|---|---|
| `/` | `HomePage` | Hero 巨字取景窗 → 精选作品（Bento，跳详情）→ 影像实验室（视差画廊）→ 客户墙 |
| `/works` | `WorksPage` | 作品档案馆：巨字刊头 + 统计卡 + 分类筛选 + 不对称大卡（封面 7 列 / 信息 5 列奇偶交替） |
| `/works/:id` | `WorkDetailPage` | 面包屑 → 头牌（分类章 + 巨字 + 元数据 4 卡）→ 设计理念 → 页面陈列 → 原稿（灯箱）→ 相关作品 |
| `/about` | `AboutPage` | 巨字刊头 → 创作理念 + 能力网格 → 经历时间线 |

**数据层**：`src/data/works.ts` 是唯一作品数据源（`works / categories / getWorkById / getRelatedWorks`），字段与 portfolio-test 对齐（`serial / pageImages / originalImages / concept / details`）。

**跳转逻辑**：导航与页脚快捷链接均为 `Link` 路由跳转（`首页 / 作品 / 关于`），active 由 `useLocation().pathname` 判定（`/` 精确，其余 `startsWith`）；作品卡 → `/works/:id`；CTA「联系我们」全站统一 mailto。

**滚动纪律（防 StrictMode 坑）**：锁滚动只写 `hidden`，解锁只写 `''`，**禁止"保存旧值再恢复"**（StrictMode 二次执行会把 `hidden` 存为旧值，页面永久锁死、鼠标滚轮失效）。

---

## 11. 交付前自检（Pre-Flight）

- [ ] 全站零 em-dash（`—` / `–`）
- [ ] 主题锁定暗色，无区块反转
- [ ] 单一强调色（青），品红仅光晕
- [ ] 圆角体系一致（按钮全圆 / 卡片 20px）
- [ ] 字阶与字体栈统一，无外部字体依赖
- [ ] 所有真实数据已替换为 `［ ］` 占位符
- [ ] 章节 eyebrow ≤ 2 处，无分栏式章节头
- [ ] 首屏视口内完整可见（标题 ≤ 2 行、副文案 ≤ 20 字、CTA 无需滚动）
- [ ] 导航桌面单行、高度 ≤ 72px
- [ ] 跑马灯全站 1 处
- [ ] 每个动画都有理由，`prefers-reduced-motion` 全量降级
- [ ] 无 `window.addEventListener('scroll')`，GSAP/Motion 不操作同一元素
- [ ] 玻璃材质三档内，`reduced-transparency` 有降级
- [ ] 390px 无横向溢出，栅格塌陷单列
- [ ] 图片有 `alt`，装饰层 `aria-hidden`
- [ ] `tsc -b` 与 `vite build` 通过

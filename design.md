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

参考意象：一条向下延伸的几何隧道。远处有一个发光的消失点，冷蓝色光线沿棱线流动，空气中悬浮着微光尘粒，深蓝激光偶尔斜切画面。前景是几块**磨砂玻璃面板**，反射着环境光，边缘有一道 1px 的冷光描边。

由此推导三条不可动摇的视觉法则：

1. **光来自深处** —— 页面亮度由「中心/远端的径向光晕」提供，不是靠把背景调亮。背景永远接近纯黑（`--bg`），发光靠 `radial-gradient` + 高光描边 + `blur` 光斑。
2. **一切表面都是玻璃** —— 卡片、导航、按钮、弹窗统一使用 §4 的玻璃配方；没有纯色实心卡片。层级靠「模糊深度 + 边框亮度」表达，不靠重投影。
3. **品牌蓝是唯一的「活」色** —— `#2686ED` 代表可交互/在线/强调；深蓝只在**光晕和渐变尖端**出现，用量 < 5%，永不单独作为第二种功能色。

---

## 2. 色彩 Token

完整变量表、写法、审计结果及开发检查见 [COLOR-SYSTEM.md](<COLOR-SYSTEM.md>)。原始值只定义在 [index.css](<src/index.css>) 的 `:root`，Tailwind 只做语义映射。

| 用途 | Token / 格式 | 使用 |
|---|---|---|
| 页面/面板/主文字/普通描边 | `--bg` / `--bg-elev` / `--surface` / `--text` / `--stroke`，保留 HSL 分量 | `hsl(var(--token))`，对应 Tailwind 语义类 |
| **所有副文本** | **`--muted: #BBC9DB`，完整 HEX** | **`text-muted` 或 `color:var(--muted)`，禁止再叠色彩 alpha** |
| 品牌蓝 | `--brand-rgb: 38 134 237`；`--accent` 引用它，RGB 分量 | `rgb(var(--accent) / .5)`；`brand` / `accent` 共享精确 `#2686ED` |
| 明/深/蓝白光效 | `--accent-strong-rgb` / `--accent-deep-rgb` / `--accent-soft-rgb` | RGB 包裹；不作为私有副文本颜色 |
| 中性材质 | `--paper-rgb` / `--ink-rgb` | 透明玻璃/阴影；普通文字仍用主文字或 muted |
| 浅底反色 | `--on-light-rgb` / `--surface-light-rgb` | `text-inverse-text` / `bg-surface-light`，保证占位内容反差 |

**品牌渐变（蓝色调，仅用于 1px 描边、进度条、光带、导航镀层，不用于大面积填充）：**

```css
var(--grad-accent) /* :root 集中定义，勿在组件重复色号 */
```

**单色纪律**：全站只允许一种强调色相（`#2686ED` 及其明度派生）。禁止再出现电光青 `#2ED9F5` / `#8FEEFF` / `#5FE3FF`、品红 `#C86BFF` 等第二种色相的强调元素。

**色彩纪律（强制）**

- 品牌蓝 `--accent`（= `#2686ED`）是全站**唯一**的交互强调色，所有区块一致，不得出现第二个功能色（不出现青/绿/橙/红按钮）。
- 深蓝 `--accent-2` 仅出现在光晕、渐变收尾、极小的焦点光斑，单屏可见面积 < 5%。
- 普通底色/文字不直接用纯黑纯白，使用 `--bg` / `--text`。半透明材质和遮罩可引用全局 `--ink-rgb` / `--paper-rgb`，不能散写数值。
- 禁止「AI 紫渐变铺底」「霓虹外发光糊满全屏」。光晕要有中心、有衰减、有节制。
- **证券/涨跌语义不在本项目范围**；若未来接入数据，遵循中国市场「红涨绿跌」。

---

## 3. 字体与字阶

**中文统一用思源黑体 Source Han Sans CN，且字体文件内嵌进项目。** 不引外链（Google Fonts 这类），字体随构建产物一起发布，离线也能正确渲染。

- 字体源：`Source Han Sans SC VF`（思源黑体 SC 可变字体，weight 250–900），由 `cn-font-split` 切成 **481 片 woff2**，按 `unicode-range` 由浏览器按实际用字按需下载；首屏实测只拉 22 片。
- 存放：`src/assets/fonts/source-han-sans/`（woff2 + `fonts.css`），由 `src/main.tsx` 直接 `import`，Vite 负责 hash 与产物输出。
- 族名统一声明为 `"Source Han Sans CN"`，`local()` 回退已移除，确保一定走内嵌文件。
- **新增中文文案不需要额外操作**：分片按 `unicode-range` 自动命中。

```css
--font-sans : "Source Han Sans CN", "Source Han Sans SC", "Noto Sans SC",
              "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif;
--font-mono : ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Mono",
              Consolas, "Liberation Mono", monospace;
```

- **中文**走 `--font-sans`（思源黑体），是文案主体。
- **英文点缀**（小标签、序号、元信息、按钮副标）走 `--font-mono` 大写 + 宽字距，是「科技感」的主要来源。
- 禁止在同一行混排衬线体；标题内强调用**同族加粗**或品牌蓝渐变，不用斜体衬线。本项目**不使用斜体衬线体**（旧的 Instrument Serif 已废弃）。

| 语义 | 类 | 尺寸 | 备注 |
|---|---|---|---|
| 首屏 PORTFOLIO | 内联（HTML，非 SVG） | 桌面 `min(16.7vw,15rem)`（240px）/ 移动 `13.5vw` | 字重 800，描边非填充（§7.0） |
| 首屏 设计 / 未来 | 内联 clamp（HTML，非 SVG） | `clamp(3.2rem,12vw,11.5rem)` | 字重 800，行高 0.9（§7.0） |
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
  background: linear-gradient(135deg, rgb(var(--paper-rgb) / .06), rgb(var(--paper-rgb) / .02));
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgb(var(--paper-rgb) / .10);
  box-shadow: inset 0 1px 0 rgb(var(--paper-rgb) / .12), 0 24px 60px -24px rgb(var(--ink-rgb) / .75);
}
```

- **边缘冷光**：hover / 聚焦时边框由 `rgb(var(--paper-rgb) / .10)` 过渡到 `rgb(var(--brand-rgb) / .45)`，同时 inset 高光变亮。这是玻璃「活过来」的唯一方式，不要加外发光阴影。
- **降级**：`@media (prefers-reduced-transparency: reduce)` 时背景改为不透明 `--surface`，`backdrop-filter: none`。
- **性能**：`backdrop-filter` 只用在**静态定位**的卡片/面板上；不要在滚动容器或大面积随滚动重绘的元素上叠 blur。

**光晕层（`.glow-*`）**：由 `radial-gradient` 生成的固定/绝对定位光斑，`pointer-events-none`、`aria-hidden`。首屏 1 个主光晕 + 1 个深蓝副光晕；其余区块最多 1 个弱光晕。禁止每个区块都摆光晕。

---

## 5. 圆角、描边、间距

- **圆角体系（Shape Lock，唯一规则）**
  - 交互件（按钮、标签、胶囊）：`9999px` 全圆
  - 非圆形、非胶囊的矩形（卡片、面板、图片容器、输入框）：默认统一 `12px`，由全局 `--radius-rect` 驱动；使用 `rounded-card` / `rounded-panel` / `rounded-field`。
  - 输入 / 小徽章：`12px`
  - 唯一明确的局部例外：首页精选作品标签为 `4px`，只在该组件 CSS 覆盖，不改全局 token；其余组件不得自创圆角。
- **描边**：基础玻璃边框优先 1px 半透明白（`rgb(255 255 255 / .10)`）；PointerGlow 指针局部高光为 `2px` 挖空描边（见 §7.3）；分隔线用 `--stroke`。禁止给每个列表行都加 `border-y`；长列表用分组或卡片化。
- **间距标尺**：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`（px）。区块垂直间距 `py-24 md:py-32`，大屏 `py-40`。
- **容器**：`max-w-[1240px] mx-auto px-6 md:px-10 lg:px-16`。宽画廊可用 `max-w-[1440px]`。
- **首屏**：`min-h-[100svh]`（禁止 `h-screen`，避免移动端地址栏跳动）；采用「巨字 + 品牌字」构图（见 §7.0），信息锚定**底部信息栏**，不做居中堆叠。
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

### 7.0 首屏 `Hero`（巨字 + 品牌字）
- **背景素材**：`public/images/hero-desk.jpg`（1672×941，约 238KB）。工作台场景 = 显示器居中、左侧暖色台灯、右下桌面色块。
- **概念**：工作台照片**保留原色**，只压一层 40% 透明的品牌蓝；一行 240px 的描边 `PORTFOLIO` 横贯版心正中作肌理，纯白「设计」压左上、蓝渐变「未来」压右下，三块文字形成一条对角张力线。
- **版心纪律（硬性）**：首屏**所有文字**（三块巨字 + 左上引文 + 右上标签 + 左下 BASE/STATUS + 居中 SCROLL）都收进 `max-w-[1400px]` 版心；「设计」「未来」在版心内左右各缩进 `12%`（桌面 `left-[12%] / right-[12%]`），纵向分别从上下边缘内收 `30%`（`top-[30%] / bottom-[30%]`），两块字关于中线对称。禁止用 `vw` 从视口边缘起排。
- **字号纪律**：`PORTFOLIO` 桌面固定 `min(16.7vw, 15rem)`（= 1440 下 240px），思源黑体下实测宽 1374px，落在 1400 版心内；移动端 `13.5vw`。字距 `-0.01em`（换思源黑体后拉丁更宽，需负字距收回到版心）。
- **只出现一次**：`PORTFOLIO` 全站仅此一处。禁止重复多行描边（曾用 `.repeat(3)` 三行，视觉噪音过大，已废弃）。
- **字重**：三块统一 `font-weight: 800`（`font-extrabold`；思源可变字体支持 250–900，800 为真字重）。
- **背景调色（保留原色，只染一层）**：图片原样铺底，其上叠 `<div class="absolute inset-0 bg-brand/40" />`。**禁止**整图 `mix-blend-luminosity` 单色化、禁止 `hue-rotate`——那会把台灯暖光一起吃掉。
- **背景尺寸（强制铺满）**：图片 `absolute inset-0 h-full w-full object-cover`，**必须铺满整屏**，禁止留边、禁止做「小尺寸主图 + 模糊底衬」的画中画——那会让 40% 蓝色色层看起来没盖住图（图外露出的底衬与图内色差肉眼可见）。
- **运镜收敛（唯一允许的“缩小”手段）**：呼吸缩放 `1 → 1.014`、滚动放大 `1 → 1.04`、入场起始 `scale 1.06`；**禁止**再给 `.hero-zoom` 加 `-inset` 之类的外扩。
- **排版纪律**：三块文字一律 HTML，禁止写进 SVG —— `viewBox` 固定 16:9，非 16:9 视口会横向裁切（§7.0 旧版踩过）。
- **暗幕（2026-10 修订）**：纵向渐变 `0.58 → 0（36% 处）→ 0.76 → 0.94`，**中段完全放空**，让背景图中间不被压暗；必须保留首尾两端的压暗，否则顶栏文字与底栏信息失去对比。禁止把 36% 节点改回非 0。
- **对比纪律**：描边用 `1.4px rgba(255,255,255,0.42)`，太淡会被显示器亮区吃掉。
- **动感来源（静态图方案，0 积分）**：整层呼吸缩放（`1 → 1.014`，30s alternate）+ 斜向光带扫过（11s）+ 悬浮微尘（CSS `particle-rise`）+ 鼠标整层视差（-14 / -9px，GSAP `quickTo`）。**缩放幅度必须 ≤ 3%**，否则巨字会显得在膨胀。
- **入场**：由 App 传入的 `active` prop（首屏图加载完成 + 加载屏结束）触发，只播一次：背景模糊落定 → 暗幕浮现 → 三块文字依次升起（`stagger 0.11`）→ 注记 / UI 错落进场。`prefers-reduced-motion` 直呈终态。
- **四角内容（全部在版心内，已删掉 CTA / 时钟 / `01 / CREATE` 注记）**：
  - 左上：引文 `/ 每个音符都带着一种固执的确信：自己绝不会是跑调的那一个。 /`（移动端 `<br className="md:hidden">` 断成两行，避免溢出）。
  - 右上：标签 chip `Visual UI Design 2026`，圆点用品牌色 `bg-brand`（`#2686ED`）。
  - 左下：`BASE` ［城市 · 中国］ / `STATUS` 2026 · 接受新项目委托，两列并排。
  - 底部居中：`SCROLL`（`lg` 起）。
- **滚动离场**：内容层上移淡出（Motion `useScroll`），背景微放大；GSAP 与 Motion 不操作同一元素（分层嵌套隔离）。

### 7.0.1 加载屏 `LoadingScreen`（真实预加载）
- **进度必须是真的**：由 `App` 用 `fetch` + `ReadableStream` 读 `content-length` 计算字节比，禁止用定时器伪造百分比。无 `content-length` 时退回渐近曲线，且上限锁 `0.99`，绝不虚报 100。
- **预加载范围只有首屏图**：作品 / 影像图一律 `loading="lazy"` + `fetchPriority="low"`，进入页面后再按需拉取。禁止把全部图片塞进加载屏。
- **放行条件**：`App` 报告首屏关键资源就绪、显示进度到 100%，且视觉开场至少 `1800ms`；`12s` 资源超时看门狗保留。自动淡出进入，无需用户输入；临时点击拦截已移除。加载画面不显示按钮、进入文案或预览标记，见 [LOADING-HANDOVER.md](<LOADING-HANDOVER.md>)。
- **非首页直达**（`/works`、`/about`）不预加载首屏图，避免为用不到的图等带宽。
- 计数器做"追赶"缓动（每帧补 6.5% 差值，只增不减，到点即停），避免字节抖动造成数字乱跳。布局改为中央紧凑文字、细进度条与百分比，背景使用随显示进度渐显的稀疏星点与分批光斑、中心蓝光及柔边径向扩散光晕，不再使用轮播词、巨型角落数字和全屏网格。`prefers-reduced-motion` 下圆环静止，不强制等待视觉开场。

### 7.1 导航 `Navbar`（透明悬浮玻璃胶囊）
- 顶部居中悬浮，`fixed`，高度 ≤ 72px，桌面**单行**。
- 玻璃胶囊（`glass`）+ 滚动 > 80px 时提升边框亮度与模糊（不是加阴影）。
- **配色纪律（2026-10 修订）**：导航整体保持黑白中色调——玻璃底、分隔线、激活药丸（`bg-white/10`）、CTA 描边一律中性灰白，**禁止**给胶囊加品牌色镀层或蓝色渐变底。唯一允许带色的只有「渐变环」这类原本就是彩色渐变的元素，色相统一为品牌蓝（`--grad-accent`）。
- 左侧 logo：渐变环 + 内嵌字母组合，点击 `Link` 回首页；hover 环旋转 180°。
- 中部链接：`首页 / 作品 / 关于`，**路由链接**（`Link`），激活项由 `pathname` 判定并用 Motion `layoutId` 药丸指示器滑动。
- 右侧 CTA：「联系我们」（mailto），hover 浮现渐变描边。

### 7.2 按钮
- 主按钮：品牌蓝实底 + 深色文字（保证 4.5:1 对比），hover 微放大 + 亮度提升。
- 次按钮：玻璃 + 1px 描边，hover 边框变品牌蓝。
- 文字按钮：`--muted` → `--accent`。
- **标签不超过 4 个汉字（或 2 个英文词）**，桌面禁止换行；同页同义 CTA 只保留一种措辞（全站统一「联系我们」）。

### 7.2.1 首页关于我 `HomeAbout`
- 新第二屏，位于 Hero 后。沿用01 / 关于我 ABOUT章节头；1920px时左侧420×552竖向浅色照片占位、右侧基本信息与专业技能，900px及以下上下排列。
- 七项资料从 [profile.ts](<src/data/profile.ts>) 回填；照片和未提供资料保留占位，不照抄参考图中的个人信息。技能分界面/视觉/动效三组，软件标识为本地原色图像，来源见[说明](<public/images/tools/SOURCES.md>)。
- 默认照片圆角12px；小软件标识框4px为商标展示局部例外。副文本读muted，不新增私有灰色。
- “基本信息”“专业技能”和首屏“Visual UI Design 2026”统一使用全局 [Badge](<src/components/Badge.tsx>)：11px无衬线文字、0.08em字距、6px品牌蓝圆点、全圆角、白色10%背景、20%边框、上下0.35rem/左右0.85rem内边距。默认span，分组标题使用 `as="h3"` 保留语义；调用方只提供定位类，不再维护局部胶囊尺寸或发光圆点。

### 7.3 首页精选作品 `SelectedWorks`
- 第三屏采用参考图布局：`02 / 精选作品` 紧凑标题与 EXHIBIT 装饰水印；768px 起两列，第三张通栏，手机改为三张单列。
- 上排卡片比例约 1.6:1，下排约 2.6:1；1408px 内容宽度对应 1920px 桌面，保留现有作品原图和整卡详情链接。
- 图片铺满 12px 圆角容器；顶部叠序号/英文方向、细分隔线和作品标题，底部叠前三个中性玻璃标签及右上箭头。不再把摘要与年份统计排到图片下方。
- 样式在 [SelectedWorks.css](<src/components/SelectedWorks.css>)，不改共用 SectionHeader 或其他屏。方向/标签使用 muted，标题和展示序号使用主文字。
- 标签在所有断点保持 `14px` 字号、`4px` 圆角（全局 `12px` 的明确局部例外）；每个标签与箭头由局部共享 CSS 变量统一为 `32px` 高；标签左右 padding 与标签间 gap 均为 `16px`，所有断点一致。窄屏标签允许换行，箭头与标签区底部对齐。
- hover 轻微放大到 1.025，沿用 PointerGlow 精确局部描边：鼠标实际坐标、`280px` 径向范围、`2px` 挖空遮罩，边缘阈值/除数 `28 / 48`，衰减在 `72%` 处为 `.4`，不用中心角度近似。触控不依赖指针高光，减少动态效果时禁用位移与微缩放。

### 7.3.1 第四屏经历光线树 `Practice`
- 标题与精选作品屏共用章节头样式：左对齐 `03 / 工作经验`（经验为品牌蓝），背后叠 `EXPERIENCE`。首页五屏外层只保留底部128px padding，顶部和左右为0；内层版心不变，首屏保持100svh画布再加底部留白。
- 参考 [Redoyanul Haque](<https://www.redoyanulhaque.me/>) 的 Career & Experience：中轴3px渐变光线与10px发光末端随滚动增长/回退，桌面双侧信息，900px及以下左轴堆叠；不 pin、不使用嵌套滚动。
- 继续使用三个现有项目，不虚构任职/年份。光色来自全局品牌蓝，副文本为 `--muted`；减少动态效果时完整静态呈现。
- 全局增加独立的左上/右下固定视口光晕，body portal、pointer-events:none；不替代鼠标光晕，不影响前两屏布局。实现与验证见 [CAREER-HANDOVER.md](<CAREER-HANDOVER.md>)。

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
- 焦点可见：`:focus-visible` 2px `#2686ED` + `offset 2px`。
- 图片必须有 `alt`（装饰图 `alt=""`）。
- 语义标签：`header / nav / main / section / footer`，每区块有可读锚点 id。
- 移动端 390px 无横向滚动。
- 装饰噪点/网格只允许作为 `fixed`、`pointer-events-none` 的伪元素层。

---

## 10. 目录与路由

**路由式漫游（HashRouter，参考 portfolio-test 跳转逻辑）。** 外壳：加载屏（仅首载）→ 全局导航 → 路由页 → 全局页脚；路由切换伴随页面转场（Motion `AnimatePresence mode="wait"`，blur + 位移，0.55s）并强制回顶。

**全局鼠标光晕**：[App.tsx](<src/App.tsx>) 在加载结束后、动画路由之外唯一挂载 [WorkCursorHalo](<src/components/WorkCursorHalo.tsx>)，portal 到 `document.body`，跨首页、作品、详情、关于及 404 保持；各路由不再局部挂载。直径 `260px`，品牌蓝渐变强度 `.18 / .075`，链接/作品卡缩放 `1.4 / 1.9`；保留原生光标，触控、粗指针及减少动态效果时禁用。

| 路由 | 页面组件 | 内容 |
|---|---|---|
| `/` | `HomePage` | Hero 巨字 → 精选作品（上二下一铺图卡片，跳详情）→ 项目经验 → 影像实验室 |
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
- [ ] 单一强调色（品牌蓝），深蓝仅光晕
- [ ] 圆角体系一致（圆形与胶囊保留全圆 / 默认矩形 12px / 首页精选作品标签局部 4px）
- [ ] 字阶与字体栈统一（思源黑体内嵌），无外链字体依赖
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

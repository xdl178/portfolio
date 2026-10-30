# 全局色彩规范

> 本项目色彩开发入口。原始值唯一来源：[design-system.css](<public/design-system.css>) 的 `:root`（可由[独立管理器](<design-manager.html>)直接保存）；Tailwind 语义映射：[tailwind.config.js](<tailwind.config.js>)。整体视觉约束见 [design.md](<design.md>)。禁止在组件内再维护一套色板。

## 1. 核心规则

1. **普通副文本统一为 `--muted: #BBC9DB`**。首页资料信息项标题及采用同一层级的专业技能英文标签为用户指定的语义例外，使用全局 `--secondary: #8692A3`，不影响其余muted。包括说明、英文副标题、眉题、元数据标签与值、序号、图注、面包屑、页脚、未激活导航、加载状态及百分比。HTML 用 `text-muted`，CSS/SVG 用 `var(--muted)`。
2. 不再用 `text-white/35`、`text-text-primary/80`、`text-muted/55`、私有灰蓝色模拟层级。副文本不额外叠颜色透明度；层级用字号、字重、间距表达。
3. 标题、主要统计值、重要正文/定义值、主要操作使用 `text-text-primary`；交互反馈、状态点、装饰箭头使用 `accent` 系列。不能把所有内容机械地改为 muted。
4. 品牌唯一源是 `--brand-rgb: 38 134 237`（`#2686ED`）。`--brand`、`--accent`、Tailwind `brand` / `accent` 均从它引用；禁止在别处重复写蓝色色号。
5. 原始 HEX、数值 RGB/HSL 只允许定义在 `:root`。组件 CSS、TSX、SVG、任意 Tailwind 渐变/阴影都读取变量；SVG 可用 `currentColor`。
6. 玻璃边框、暗幕、阴影、光斑允许 alpha；那是材质透明度，不是副文本色。原作图片/视频及字体文件不属于 UI 调色范围。本地下载的软件品牌标识（[来源说明](<public/images/tools/SOURCES.md>)）作为图像资产保留原始商标色，不能将这些颜色挪作 UI 配色。

## 2. 语义色表

| 用途 | Token 原始值 / 来源 | 写法 | 注意 |
|---|---|---|---|
| 页面底色 | `--bg: 222 47% 4%` | `bg-bg` / `hsl(var(--bg))` | 深蓝近黑，不写 `bg-black` |
| 抬升底色 | `--bg-elev: 222 40% 7%` | `bg-bg-elev` | 分层基底 |
| 面板底色 | `--surface: 220 36% 10%` | `bg-surface` | 卡片/图片占位 |
| 主文字 | `--text: 210 40% 98%` | `text-text-primary` | 浏览器实际约 `#F8FAFC`；不再另写 `#F7FAFF` |
| **统一副文本** | **`--muted: #BBC9DB`** | **`text-muted` / `var(--muted)`** | 完整色值，无 HSL/RGB 包裹，无 `/80` 等色彩 alpha |
| 资料项标题 | `--secondary: #8692A3` | `text-secondary` / `var(--secondary)` | 首页姓名、所在地等dt及专业技能英文标签，14px，不叠alpha；定义内容/技能中文名称为16px主文字 |
| 普通分隔线 | `--stroke: 213 28% 20%` | `border-stroke` | 玻璃高光边另用 paper alpha |
| 品牌 / 交互 | `--brand-rgb: 38 134 237`；`--accent` 为其别名 | `text-accent` / `bg-brand/40` | 主色为精确 `#2686ED` |
| 蓝白高光 | `--accent-soft-rgb: 209 232 255` | `text-accent-soft` / `rgb(var(--accent-soft-rgb))` | 光斑核心、描边峰值，不用于副标题 |
| 明亮蓝端 | `--accent-strong-rgb: 111 182 255`；`--accent-strong` 为别名 | `hover:text-accent-strong` | 悬停与渐变明端 |
| 深蓝端 | `--accent-deep-rgb: 27 82 201`；`--accent-2` 为别名 | `bg-accent-2/10` | 光效与渐变尾部，不是第二功能色 |
| 中性高光 / 阴影 | `--paper-rgb: 255 255 255` / `--ink-rgb: 0 0 0` | `border-paper/15` / `bg-ink/50` | 只作半透明材质；普通文字仍用主文字/副文本语义 |
| 反色文字 | `--on-light-rgb: 48 61 80` | `text-inverse-text` | 浅色照片占位区专用，不在深底副文本中使用 |
| 浅色占位面 | `--surface-light-rgb: 209 213 220` | `bg-surface-light` | 与 inverse-text 成对使用 |

### 色值格式不能混用

```css
/* HSL 通道：表面和主文字 */
background: hsl(var(--surface));
color: hsl(var(--text));

/* RGB 通道：品牌、accent 别名、材质高光 */
border-color: rgb(var(--accent) / .45);
box-shadow: 0 16px 40px rgb(var(--ink-rgb) / .4);

/* 完整色值：muted、secondary 和 brand */
color: var(--muted);
background: var(--brand);
```

**错误：** `hsl(var(--muted))`、`rgb(var(--muted))`、`hsl(var(--accent))`。目前 `muted` 的 Tailwind 映射直接使用完整色值，不提供副文本 alpha 变体。

## 3. 特殊材质色（仍由全局变量管理）

这些为保留现有视觉的精确材质色，不可当作新一组副文本颜色：

| Token | RGB 分量 | 已有用途 |
|---|---|---|
| `--bg-loading-rgb` | `3 6 11` | Loading 深色背景 |
| `--surface-card-rgb` | `11 20 34` | 能力/经历/实验室卡片 |
| `--surface-card-hover-rgb` | `16 30 49` | 卡片悬停背景 |
| `--gallery-overlay-rgb` | `5 7 13` | 两类图片灯箱暗幕 |
| `--nav-glass-rgb` | `10 15 25` | 导航玻璃底 |
| `--hero-veil-rgb` | `6 10 18` | Hero SVG 渐变暗幕 |
| `--hero-highlight-rgb` | `140 196 255` | Hero 主展示字蓝色渐变亮端 |
| `--hero-mid-rgb` | `78 155 245` | 同上渐变中段 |
| `--scrollbar-thumb` / `--scrollbar-hover` | HSL `213 28% 22%` / `213 28% 30%` | 滚动条 |

品牌通用渐变直接用 `.grad-accent` / `var(--grad-accent)`。不要为每张卡片复制渐变色号。

## 4. 正确例子

```tsx
<p className="text-sm leading-7 text-muted">副标题和说明</p>
<dt className="text-xs text-muted">角色</dt>
<dd className="text-sm text-text-primary">主视觉 / UI 设计</dd>
<a className="text-muted transition-colors hover:text-accent-strong">了解更多</a>
<div className="border border-paper/15 bg-paper/[0.02]">玻璃表面</div>
```

图片上的主展示序号可用 `text-paper/75 mix-blend-difference` 保持反差；巨大 ABOUT 水印可用 `text-paper/[0.045]`。这是图像展示/装饰例外，不是普通副文本。浅背景占位标记必须用 `inverse-text`，不能用浅灰蓝 muted 降低反差。

入场/滚动/悬停揭示的整体 opacity 动画保留，它们表达状态，不是独立的色板。检查静态色时应等待动画结束并移开鼠标；悬停、聚焦、当前导航状态可临时使用主文字或强调色。

## 5. 本次审计结果

- 已覆盖运行时 UI 的 TSX、CSS、Tailwind 映射；包含未挂载的备用个人介绍/联系方式组件。
- 已统一首页引文/底栏信息、章节眉题/序号、作品标签与元信息、详情面包屑/标签、关于页说明、Loading 副文本；取消私有灰蓝和副文本 alpha。
- 已将散落的品牌字面量、主文字近白、卡片/灯箱底色、SVG 暗幕、阴影/玻璃中性 RGB、描边与加载光效收敛到全局变量。
- 普通主文字、主要定义值、CTA、图片混合模式、浅底反色、渐变展示字保留各自语义；未改图片素材本身。
- 底色 HSL 与品牌 RGB/完整 HEX 是有意区分的格式，不再用一套 `hsl()` 包所有变量。

## 6. 开发与验收

```bash
npm run build
# 保持本地 preview 在 5180 运行后：
npm run test:colors
npm run test:loading
npm run test:works
```

[colors.spec.mjs](<colors.spec.mjs>) 检查：原始色号只能出现在 `:root`、禁止旧副文本色彩 alpha、各路由静态副文本实际为 `rgb(187, 201, 219)`，以及修改 `--muted` 后消费者会同步变化。图片、字体资产不参与文本 token 扫描。用户新增的资料标题secondary由 [profile-contact回归](<profile-contact.spec.mjs>) 检查精确值及实时变量联动。新增特殊颜色必须先确认已有语义无法表达，再集中定义并补本文档，不得通过削弱测试放过散落色号。

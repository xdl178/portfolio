# 作品页动效与交互交接

> 范围：`/#/works` 作品档案、`/#/works/:id` 作品详情，以及全站共享的鼠标光晕与卡片描边。沿用 [design.md](<design.md>) 的深蓝黑、玻璃卡和唯一蓝色 `#2686ED`；复现参考项目的行为，不复制粗野主义撞色和贴纸。已有三件作品及图片保持不变（它们在此前已从参考项目同步，本次没有再次替换内容）。

## 直接体验

1. 在项目根运行 `npm install`、`npm run dev`，打开 `http://localhost:5180/#/works`（Vite 实际端口以终端显示为准）。点「原创 IP」「品牌 & 网页」「AI 产品官网」筛选，再点卡片进入详情。筛选 `aria-pressed` 会随状态变化，统计取自作品数据。
2. 桌面鼠标经过作品封面、信息卡、详情元数据、设计说明、原稿卡和其他作品卡：轻量光晕跟随光标（仅移动鼠标时才持续更新）；靠近边缘时局部冷蓝描边变亮，离开即暗下。鼠标未移至卡片边缘时无持续外发光。原生光标保留。
3. 详情页下滑查看「设计理念」「页面陈列」「回到原稿」「继续探索」。原稿卡分批入场，悬停显示查看提示；点预览打开灯箱，`←` / `→` 切图，`Esc` 或遮罩关闭，Tab 焦点留在灯箱内，关闭后回到触发按钮。卡片下方「新标签页打开高清原稿」保留原生链接行为，可 Ctrl/中键打开。相关作品卡有轻微弹簧倾斜、按下反馈与箭头移动，离开复位，点击进入另一详情。
4. 手机或触控设备：没有鼠标跟踪光晕、光晕描边仍有基本玻璃边框，筛选和灯箱点击可用。开启系统「减少动态效果」后显示静态内容，跟随效果停止。

## 结构与维护入口

| 文件 | 负责什么 | 常见修改 |
|---|---|---|
| `src/pages/WorksPage.tsx` | 作品档案刊头、自动统计、筛选、奇偶交错卡片、入场动画 | 调整筛选文案或卡片信息；`data-works-reveal` 是浏览器测试钩子 |
| `src/pages/WorkDetailPage.tsx` | 公共详情布局、页面顺序、原稿灯箱/键盘导航/返回焦点、关联作品 | 调整分节内容和图片呈现；`PointerGlow` 只包可交互或信息面板 |
| `src/components/PointerGlow.tsx` | 将鼠标相对卡片的坐标写入 `--pointer-x/y`，中心距离映射为 `--edge-proximity`；每帧最多更新一次 | 调整响应算法；不得用 React state 在 pointermove 中频繁渲染 |
| `src/components/PointerGlow.css` | 遮罩局部描边和柔和内光，色值来自 `--brand-rgb` / `--accent` / `--surface` | 描边开始阈值 `28`、除数 `48`；阈值调高会更难触发 |
| [App.tsx](<src/App.tsx>) / [WorkCursorHalo.tsx](<src/components/WorkCursorHalo.tsx>) / [WorkCursorHalo.css](<src/components/WorkCursorHalo.css>) | 加载结束后由 App 在动画路由之外唯一挂载，跨首页/作品/详情/关于/404 保持；触控、粗指针、减少动效时禁用 | `260px` 是光晕直径；改变强度优先降低渐变 alpha，不要叠第二色 |
| `src/data/works.ts` | 作品、封面、分类、原稿和相关作品数据唯一来源 | 新作品加 `works` 对象，类别要与 `categories` 一致；确认图片路径可访问 |
| `works-interactions.spec.mjs` | 自动浏览器测试：筛选、光晕变化、导航、灯箱、手机触控、减少动态效果 | 新交互先添加失败断言，再实现和回归 |

**动效分工**：Framer Motion 控制章节/原稿入场、筛选布局、灯箱淡入淡出与相关卡片弹簧；原生 `requestAnimationFrame` 驱动鼠标位置和描边 CSS 变量。当前页面没有新的 GSAP pin/scrub，避免与现有首页动画争抢 transform。`PointerGlow` 不修改原作品图片。光晕不再由作品路由局部挂载；加载结束后 App 唯一实例跨路由保持，不能在各页面重复挂载。光晕与灯箱使用 `createPortal(..., document.body)`，不能移回路由转场容器中，否则该容器的 transform/filter 会让 fixed 定位随长页偏移。CSS 已按 `hover:none`、`pointer:coarse`、`prefers-reduced-motion:reduce` 降级；减少动态效果时，作品路由也禁用位移、模糊和筛选 layout 动画（首页转场配置不变）。键盘可见焦点沿用全局规范。

新增相关卡片弹簧在 [WorkTilt.tsx](<src/components/WorkTilt.tsx>)，旋转范围 ±7°，`stiffness:220 / damping:20 / mass:0.5`；作品路由专用悬停/原稿提示样式在 [WorksMotion.css](<src/components/WorksMotion.css>)，不会作用到首页。光晕在普通链接上放大 1.4 倍，作品卡上放大 1.9 倍，仅缩放内层装饰，不移动点击目标。

## 视觉微调参数

- 全局矩形圆角：在 [index.css](<src/index.css>) 修改 `--radius-rect`（当前 `12px`）；Tailwind 的 card/panel/field 与标准矩形圆角均读此值。圆形、胶囊与圆点保留全圆角。唯一局部例外：首页精选作品标签为 `4px`，不改全局 token；标签各断点均为 `14px` 字号，与箭头通过局部共享 CSS 变量统一为 `32px` 高，标签左右 padding 与相邻标签 gap 均为 `16px`，窄屏标签可换行、箭头底对齐。
- 鼠标光晕：[WorkCursorHalo.css](<src/components/WorkCursorHalo.css>) 的渐变中心透明度调整为 `.18`、中段 `.075`，保持品牌蓝不变。
- 局部描边：[PointerGlow.css](<src/components/PointerGlow.css>) 使用鼠标实际坐标的 `280px` 径向渐变，叠加 `mask-composite: exclude` 挖空为 `2px` 边框；衰减在 `72%` 处为 `.4`，边缘响应阈值/除数为 `28 / 48`。不要再用中心角度的 conic-gradient 近似，否则不同长宽比的矩形会发生亮点错位。
- Enter 现为真正的 SVG 长箭头；文本与箭头一起属于作品整卡链接。
- 对齐回归：[works-polish.spec.mjs](<works-polish.spec.mjs>) 截取卡片边框真实像素，检查亮度峰值是否跟随鼠标（上边与右边），并检查默认矩形 `12px`、胶囊与 Enter 箭头。最新全站光晕、`2px` 描边及首页标签局部例外需另行回归，不能沿用旧测试结果。

## 验证与故障排查

```bash
npm run build                   # TypeScript + Vite
npm run preview -- --port 5180  # 保持进程运行
npm run test:works              # 需要本机 Chrome 与 preview；PORTFOLIO_URL 可改 URL
```

测试默认 `http://127.0.0.1:5180/`，Chrome 默认路径 `C:/Program Files/Google/Chrome/Application/chrome.exe`；Windows 若 Chrome 安装位置不同，修改测试脚本中的 `executablePath`。测试同时验证 1440px 和 390px；截图可用 `node works-visual.mjs` 生成到 `.shots/`（脚本不会自动启动服务）。若改 `works.ts` 后图片 404，先检查 `public/images/works/<folder>/Frame-N.jpg` 与原稿文件编码。若鼠标无光晕，检查浏览器是否报告 `(hover:hover) and (pointer:fine)`、是否开启减少动效；触控模拟器默认关闭是预期行为。若构建出现 Tailwind `duration-[900ms]` 的 ambiguous 警告，属于既有任意类名冲突，与本次作品交互无关，可单独按 design token 清理。

## 当前验证记录

生产构建及 `test:loading`、`test:colors`、`test:works`、`test:home-works`、`test:effects` 均已通过。新测试验证同一光晕 DOM 节点跨首页/档案/详情/关于/404 保持、真实视口鼠标坐标、触控和减少动态效果禁用、2px/280px 描边，以及 1920/1440/768/390px 下标签14px、4px圆角、箭头与单标签等高且无重叠。新旧首页断言已同步为全局单实例。

- 此前 `tsc -b` 与 Vite 生产构建通过；构建保留既有 Tailwind 任意类名歧义警告，不影响退出码。
- 此前自动浏览器测试覆盖 1440px 桌面、390px 触控模拟、减少动态效果：筛选、滚动入场、光晕跟随与边缘亮度、长页滚动后的灯箱位置、自动聚焦/焦点循环/恢复、图片切换、关联卡倾斜/复位、跨详情回顶。旧的「首页不挂载光晕」断言已不符合当前全站行为，不能作为验收标准。
- 三个案例的 45 张页面与 15 张原稿共 60 个独立图片 URL 均验证为成功的图片响应；未对素材做二次改写。桌面/手机灯箱截图已检查；触控验证是浏览器模拟，不替代真机验收。
- 新增开发依赖 `playwright-core`，不打入生产包；npm 与 pnpm 锁文件均包含该依赖。此项目原以 npm 为主，交接继续用 `npm install` / `npm ci` 即可，不要在同一 node_modules 上反复混用包管理器。

**部署说明**：本次只修改当前项目，未触碰只读参考目录，也未发布站点。上线前按 [HANDOVER.md](<HANDOVER.md>) 核对作品素材授权和占位资料。历史五屏文档不是本次作品页交接依据。

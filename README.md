# 设计未来 · 独立作品集

深空蓝黑 · 磨砂玻璃 · 巨字首屏的单页作品集。React 19 + Vite 7 + TypeScript + Tailwind CSS 3 + GSAP + Framer Motion，HashRouter 路由式漫游。

> 文档分工：
> - [`design.md`](./design.md) — 全站视觉规则，**唯一事实来源**，改样式前先读
> - [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 代码架构、数据流、动效分工、关键决策
> - [`HANDOVER.md`](./HANDOVER.md) — 交接：状态、部署、占位符回填、故障排查
> - [`WORKS-HANDOVER.md`](./WORKS-HANDOVER.md) — 作品档案与详情页动效、光晕描边、使用和测试交接
> - [`COLOR-SYSTEM.md`](./COLOR-SYSTEM.md) — 全局色彩规范、统一副文本、材质例外与颜色回归
> - [`LOADING-HANDOVER.md`](./LOADING-HANDOVER.md) — 星空加载页、自动进入与失败兜底
> - [`CAREER-HANDOVER.md`](./CAREER-HANDOVER.md) — 双角视口光晕与第四屏经历滚动树
> - [`docs/superpowers/`](./docs/superpowers/) — 五屏改版的设计说明与实施计划（历史参考，当前首页未采用该结构）

## 运行

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # tsc -b && vite build → dist/
npm run preview
npm run lint     # tsc --noEmit
npm run test:works  # 先启动 preview -- --port 5180；本机需 Chrome
npm run test:loading  # 无输入自动进入与进度星空回归
npm run test:home-works  # 作品屏上二下一布局、移动端单列与详情跳转
npm run test:colors   # 全局颜色来源、副文本精确色值与变量联动
npm run test:effects  # 全站光晕单实例、跨路由持久与2px描边
npm run test:career   # 双角固定光晕、经历树滚动增长/回退和手机降级
npm run test:home-spacing  # 五屏外层仅底padding128px、作品与经历同款标题
npm run test:home-about  # 新增第二屏排版、资料和8个本地软件图标
npm run test:badge  # 全局Badge三处同款样式、标题语义及10%背景
```

当前生产构建与以上浏览器回归均已通过：全站光晕、2px 描边、首页标签尺寸/换行、自动进入和既有作品交互。触控与减少动态效果保持降级。

## 首页结构（当前线上形态）

| 顺序 | 区块 | 组件 | 说明 |
|---|---|---|---|
| 1 | 首屏 | `Hero` | 巨字描边 PORTFOLIO + 设计 / 未来 + 1400 版心，原图叠 40% 品牌蓝 |
| 2 | 关于我 | `HomeAbout` | 左侧竖向照片占位，右侧七项基本信息、三组专业技能及本地软件标识 |
| 3 | 精选作品 | `SelectedWorks` | 上方两张并排、第三张通栏的铺图卡片；标题/方向/标签叠图，保留真实作品与详情跳转 |
| 4 | 工作经验 | `Practice` | 参考 Career & Experience 的蓝色光线滚动树，桌面中轴双栏、手机左轴堆叠；保留三个真实项目，无 pin |
| 5 | 影像实验室 | `Explorations` | 横向视觉叙事 + 灯箱 |

全局：`ViewportGlows` 视口左上/右下双角品牌蓝光晕（固定 body portal、不拦截点击）、`Backdrop` 网格/噪点装饰层、`Navbar` 悬浮胶囊导航、`ContactFooter` 页脚；加载结束后由 [App.tsx](<src/App.tsx>) 在动画路由外唯一挂载 `WorkCursorHalo`，portal 到 body，跨首页/作品/详情/关于/404 保持。触控、粗指针及减少动态效果时禁用。

首页作品标签各断点均为 `14px` 字号、局部 `4px` 圆角；标签与箭头同为 `32px` 高；标签左右 padding 和标签间 gap 均为 `16px`，窄屏标签可换行、箭头底对齐。默认矩形仍为全局 `12px`，详见 [design.md](<design.md>)。

路由：`/` 首页、`/works` 作品档案、`/works/:id` 作品详情、`/about` 关于、`*` 404。

首页五屏统一由 [HomePage.css](<src/pages/HomePage.css>) 设置外层 `padding: 0 0 128px`；内层保留响应式版心。关于我、精选作品、工作经验分别使用01/02/03同款章节头。新增第二屏的照片、姓名、联系方式等资料保留占位，从 [profile.ts](<src/data/profile.ts>) 回填；软件图标[来源说明](<public/images/tools/SOURCES.md>)随项目本地保存。

## 数据与素材

- 作品数据：`src/data/works.ts`（三件作品，`pageImages` 页面陈列 + `originalImages` 原稿灯箱）
- 作品图片：`public/images/works/{original-ip,mivox,art-studio}/`，共 61 张 JPG / 25 MB
- 首屏背景：`public/images/hero-desk.jpg`（1672×941）
- 个人资料占位：`src/data/profile.ts`（姓名 / 学校 / 邮箱等均为「待补充」）

## 未挂载的备用章节

`ProfileIntro.tsx`（`01 关于我`）与 `ProfileContact.tsx`（联系信息）是五屏改版的产物，当前首页**未挂载**，与 `docs/superpowers` 里的方案一起保留待用。首页因此只有四段结构；导航「联系我」直达 `mailto:`。

## 约定

- 主色唯一来源 `--brand-rgb`（`#2686ED`），全站不出现第二种强调色相
- 中文统一思源黑体 `Source Han Sans CN`，481 片 woff2 内嵌，不依赖外链
- 所有动画尊重 `prefers-reduced-motion`；装饰元素 `aria-hidden` + `pointer-events: none`
- 390px / 1440px 均无横向滚动

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
npm run lint     # tsc -b：实际检查 app/node 引用项目
npm run test:works  # 先启动 preview -- --port 5180；本机需 Chrome
npm run test:loading  # 无输入自动进入与进度星空回归
npm run test:home-works  # 作品屏上二下一布局、移动端单列与详情跳转
npm run test:colors   # 全局颜色来源、副文本精确色值与变量联动
npm run test:effects  # 全站光晕单实例、跨路由持久与2px描边
npm run test:career   # 双角固定光晕、经历树滚动增长/回退和手机降级
npm run test:home-spacing  # 四个主区块外层仅底padding128px、作品与经历同款标题
npm run test:home-about  # 新增第二屏排版、资料和8个本地软件图标
npm run test:badge  # 全局14px/6×16/gap8胶囊、描边淡出/背景透明度恢复、触屏与减少动态效果
npm run test:ui-consistency # 关于我显式规格、内页共享胶囊/原生筛选和明亮封面/选中态对比度
npm run test:footer  # 五层无卡片页脚、三列/单列、隐私、联系聚焦、跨路由与回顶
npm run test:buttons # 共用按钮填色/图标换位/逆向恢复、禁用、触控与减少动态效果
npm run test:audit-fixes # 灯箱窄屏/横屏、标题关联、首屏减少动态效果、900ms封面、真实类型错误
npm run test:tokens # CSS→Motion、全局版心/间距/时长联动、统一按钮变体与原生导航
npm run test:profile-contact # 资料secondary/字号/间距、纯文本联系网格和500px悬浮回顶
npm run test:footer-nav # 页脚主文字色、反向滚动文字/箭头、焦点、触控和路由
```

当前生产构建与以上浏览器回归均已通过：全站光晕、2px 描边、首页标签尺寸/换行、自动进入和既有作品交互。触控与减少动态效果保持降级。

## 首页结构（当前线上形态）

| 顺序 | 区块 | 组件 | 说明 |
|---|---|---|---|
| 1 | 首屏 | `Hero` | 巨字描边 PORTFOLIO + 设计 / 未来 + 1400 版心，原图叠 40% 品牌蓝 |
| 2 | 关于我 | `HomeAbout` | 左侧含圆形头像及七项资料的卡片，右侧简介与八项Design Tools网格，保留项目字体/颜色/圆角 |
| 3 | 精选作品 | `SelectedWorks` | 上方两张并排、第三张通栏的铺图卡片；标题/方向/标签叠图，保留真实作品与详情跳转 |
| 4 | 工作经验 | `Practice` | 参考 Career & Experience 的蓝色光线滚动树，桌面中轴双栏、手机左轴堆叠；保留三组项目占位，无 pin |
| 5 | 全局页脚 | `ContactFooter` | 居中方向胶囊/英文标题/说明、四个滚动箭头导航、三项联系网格，无外层圆角卡片，保留版权/回顶；[交接](<FOOTER-HANDOVER.md>) |

全局：`ViewportGlows` 视口左上/右下双角品牌蓝光晕（固定 body portal、不拦截点击）、`Backdrop` 网格/噪点装饰层、`Navbar` 悬浮胶囊导航、`ContactFooter` 页脚；加载结束后由 [App.tsx](<src/App.tsx>) 在动画路由外唯一挂载 `WorkCursorHalo`，portal 到 body，跨首页/作品/详情/关于/404 保持。触控、粗指针及减少动态效果时禁用。

首页作品标签各断点均为 `14px` 字号、局部 `4px` 圆角；标签与箭头同为 `32px` 高；标签左右 padding 和标签间 gap 均为 `16px`，窄屏标签可换行、箭头底对齐。默认矩形仍为全局 `12px`，详见 [design.md](<design.md>)。

路由：`/` 首页、`/works` 作品档案、`/works/:id` 作品详情、`/about` 关于、`*` 404。

首页四个主区块统一由 [HomePage.css](<src/pages/HomePage.css>) 设置外层 `padding: 0 0 128px`；全局页脚上下均保留128px留白；内层保留响应式版心。关于我、精选作品、工作经验分别使用01/02/03同款章节头。新增第二屏的照片、姓名、联系方式等资料保留占位，从 [profile.ts](<src/data/profile.ts>) 回填；软件图标[来源说明](<public/images/tools/SOURCES.md>)随项目本地保存。

## 全局变量与审计修复

- [design-system.css](<public/design-system.css>) 是颜色、版心、侧边距、章节留白、共享时长和缓动的唯一原始值入口，由独立stylesheet加载；[index.css](<src/index.css>) 保留基础及语义样式。首页/页脚使用1536px版心，Hero1400px、内页1380px是有意变体；侧边距64/40/20px由同一响应式变量驱动，首页底留白和页脚上下留白共用 --section-space（默认128px）。
- [useMotionTokens](<src/hooks/useMotionTokens.ts>) 将CSS时长转换为Motion秒数，将共享曲线转换为数组；监听root样式/类更新并在卸载时清理。Tailwind的200/300/500/700ms常用类和循环也映射到root。独特Hero分镜和物理spring参数仍由各自编排维护，不机械合并。
- 最新资料排版：全局--secondary为#8692A3，资料dt为14px、dd为16px；全局Badge统一14px/上下6px左右16px/gap8px，取消compact分支，fine-pointer使用200ms背景透明度增强＋描边淡出（不出现品牌蓝描边）。作品/关于/详情页展示胶囊和原生筛选按钮复用组件，图片胶囊使用共享深底变体保证可读；内页返回操作复用ActionButton，fallback版心和中文字体回退统一。关于我为左资料卡/右简介及Design Tools；资料列距24px/组行距32px，无旧40px左缩进，资料卡底padding32px，右侧标题--secondary/正文--text，工具卡圆角8px。八个软件改为36px图标＋16px名称的3/2/1列工具卡，300ms背景/边框反馈，560ms逐项入场；触屏及减少动态效果降级。页脚采用参考式居中五层CTA，Email/Phone/Behance三项通道为桌面三列/窄屏单列的纯文字占位，无链接、禁用状态、顶部线或配置说明；[BackToTop](<src/components/BackToTop.tsx>) 为body portal悬浮圆形按钮，滚动>500px显示。
- 新增全局 [SurfaceCard](<src/components/SurfaceCard.tsx>)，首页工具、作品/关于统计及作品信息卡共用8px圆角、12px内边距、300ms颜色反馈、560ms/60ms逐项入场；metadata在已有入场父级中禁用重复位移。全局 [WorkTag](<src/components/WorkTag.tsx>) 统一首页/档案/详情多标签的14px字、32px高、4px圆角、16px内边距及组间距；状态和筛选仍由Badge保留原生语义。作品档案页面h1保留旧版居中单行巨字（clamp(2.8rem,11vw,8.4rem)/1.04/-.05em）与text-gradient强调、去句号/右上说明；导读heading整块移除，仅保留正文和统计，footer外字号≥12px，统计标记与说明12px；首页Visual UI Design 2026胶囊单独12px。信息卡用SurfaceCard的glow选项保留原鼠标渐变发光描边；WorkTag悬停同chip，背景8%→15%、描边淡出。
- [关于我内页](<src/pages/AboutPage.tsx>) 保留独立居中巨字h1、01导读、个人宣言、02优势（四卡/16条）及03联系；删除整个奖项章节与导读联系按钮。[About数据](<src/data/about.ts>) 的身份、联系方式、介绍、概览与能力说明全部为待补充占位；联系卡只展示，不生成虚假mailto/tel。“浏览我的作品集”与页脚共用[FooterNavLink](<src/components/FooterNavLink.tsx>)及其三行文字/箭头滚动、键盘与触屏/减少动态效果降级。`npm run test:about-page`与`npm run test:privacy`覆盖当前布局、占位、章节连续编号及共享入口；[隐私范围说明](<docs/PRIVACY.md>)。
- 首页资料卡姓名为28px、岗位行上距12px，三项关键词复用WorkTag，整卡保留原材质并添加共享鼠标渐变边光；作品方向筛选组外无背景/描边，保留跟随选中项的品牌蓝底板；结果使用稳定grid gap且不保留退出布局投影，避免筛选回弹，逐帧回归为`npm run test:filter-stability`；手机2×2，原生键盘与减少动态效果照常可用。新增回归：`npm run test:profile-filters`。
- [ActionButton](<src/components/ActionButton.tsx>) 统一原生button、外部a、Router Link；outline/ghost/text为视觉变体，default/compact/regular为尺寸，pill控制胶囊。旧btn样式已删除；图片预览触发器、导航文字、筛选项保留各自控件语义；普通联系网格和参考式圆形回顶不强制套用ActionButton视觉。
- 灯箱使用受视口高度约束的图片区，窄屏两列切换+整行原图入口；保留图片比例、焦点闭环、键盘切换、Esc和关闭后解锁滚动。减少动态效果同时禁用Hero直接MotionValue视差及所有路由模糊位移。
- [useReducedMotion](<src/hooks/useReducedMotion.ts>) 通过共享matchMedia和useSyncExternalStore实时订阅偏好，替代安装版本Motion仅取初始值的hook；无需刷新即可双向切换，并清理Hero鼠标quickTo。备用章节仅同步此hook接口，仍不挂载。
- [SectionHeading](<src/components/SectionHeading.tsx>) 将首页01 ABOUT / 关于我抽为全局标题，仅统一页面章节分界标题：首页三个章节、关于页导读/优势/联系（01..03）。作品/关于页面h1独立保留旧版居中单行巨字与text-gradient强调，不受--heading-*控制；Works无导读heading。卡片标题/Hero/页脚CTA不机械添加章节装饰。
- 根目录[design-manager.html](<design-manager.html>) 可在桌面Chrome/Edge双击运行，无后台、无站内入口。授权项目目录后可预览并直接保存130项实际设计参数，含自动备份、外部修改检测、方案导入导出与已有dist样式同步；[详细说明](<docs/DESIGN-MANAGER.md>)。`npm run test:design-manager`覆盖工具写盘、异常与标题一致性；构建前自动同步离线种子。
- 新增两组回归需在5180预览运行；类型检查负例仅临时建立专用探针，并在finally清理。浏览器模拟不替代触屏真机。

## 数据与素材

- 作品数据：`src/data/works.ts`（三件作品，`pageImages` 页面陈列 + `originalImages` 原稿灯箱）
- 作品图片：`public/images/works/{original-ip,mivox,art-studio}/`，共 61 张 JPG / 25 MB
- 首屏背景：`public/images/hero-desk.jpg`（1672×941）
- 个人资料占位：`src/data/profile.ts`（姓名 / 学校 / 邮箱等均为「待补充」）

## 未挂载的备用章节

`ProfileIntro.tsx`（`01 关于我`）与 `ProfileContact.tsx`（联系信息）是五屏改版的产物，当前首页**未挂载**，与 `docs/superpowers` 里的方案一起保留待用。首页因此只有四段结构；导航「联系我」保持当前路由，滚动并聚焦全局页脚 `#footer-channels`。

## 约定

- 主色唯一来源 `--brand-rgb`（`#2686ED`），全站不出现第二种强调色相
- 中文统一思源黑体 `Source Han Sans CN`，481 片 woff2 内嵌，不依赖外链
- 所有动画尊重 `prefers-reduced-motion`；装饰元素 `aria-hidden` + `pointer-events: none`
- 390px / 1440px 均无横向滚动

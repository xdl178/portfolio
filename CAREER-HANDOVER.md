# 双角光晕与第四屏经历滚动树

## 参考与适配范围

参考 [Redoyanul Haque](<https://www.redoyanulhaque.me/>) 的 My career & experience：居中双行标题、桌面两侧经历信息、中轴渐变光线、随滚动延伸的发光末端；窄屏将轴线移到左侧、信息纵向堆叠。参考实现是连续轴线，不是分叉树。

本项目当前标题采用精选作品屏同款左对齐章节头：`03 / 工作经验`，背后叠 `EXPERIENCE` 英文装饰，不再使用居中双行大标题。首页五屏的外层 padding 统一为 `0 0 128px`，内层响应式版心保持；首屏单独保留完整视口画布，底部留白不挤压原图文。

本项目沿用品牌蓝、`--muted: #BBC9DB`，保留深圳前湾公园、长沙智谷、北京博大公园的既有文案，不凭空添加任职、公司或年份。序号只表示项目顺序。前两屏结构与素材不变。

参考站右侧光晕实际在视口中右位置；本项目按用户明确要求放在**右下**。不引入参考站的 WebGL、平滑滚动、整区块下移或持续旋转。无需外站资源或新增依赖。

## 结构与参数

- [ViewportGlows.tsx](<src/components/ViewportGlows.tsx>) / [ViewportGlows.css](<src/components/ViewportGlows.css>)：App 加载结束后唯一挂载，portal 到 body；固定视口、左上与右下两枚静态渐变光晕。`z-index:30`，不拦截鼠标；导航、鼠标光晕、灯箱保持各自层级。
- [Backdrop.tsx](<src/components/Backdrop.tsx>)：保留网格和噪点，移除旧的重复光球。
- [Practice.tsx](<src/components/Practice.tsx>) / [Practice.css](<src/components/Practice.css>)：继续作为首页第四屏，保留 `id="practice"`。桌面中轴3px、末端10px，900px及以下左轴；正文不嵌套滚动，不 pin，不改变滚轮行为。
- `--career-progress`：真实 GSAP ScrollTrigger 进度，`top 75%` → `bottom 55%`，`scrub:.35`。只缩放光线和移动末端；往回滚动会回退。条目轻微渐显，`useGSAP` 与 `matchMedia` 负责作用域及卸载清理。
- 减少动态效果时，光线静态全长、所有条目可见；双角光晕本身静态。减少透明效果时隐藏双角光晕。
- 文字和光效全部消费全局颜色，无硬编码紫色或私有副文本灰色。

## 验证

保持现有预览端口5180，构建后运行：

```bash
npm run test:career
npm run test:home-works
npm run test:effects
npm run test:colors
npm run test:loading
npm run test:works
```

[career.spec.mjs](<career.spec.mjs>) 验证：双角光晕滚动前后视口坐标不变、跨路由保留且不拦截点击；真实滚动驱动轴线增长与回退；第四屏顺序与真实项目文案；390/768/1440px 减少动态效果下内容完整、无横向溢出。其余套件保护前两屏、全局鼠标光晕、加载自动进入、颜色规范与作品/灯箱交互。

桌面及手机截图为浏览器模拟，不替代真机验收。

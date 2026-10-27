# Loading 页测试与交接

刷新 [首页](<http://127.0.0.1:5180/>) 可重看开场。参考 [sinhaankur.com](<https://www.sinhaankur.com/>) 的星空光斑、中央光点与扩散光晕，用本站文案和品牌蓝重做。

## 当前行为

- **已移除临时鼠标点击拦截**。资源就绪、显示进度达到 100%、最短开场结束后自动淡出，不需要点击、点按或键盘操作。
- 不存在进入按钮、点击提示、预览模式、临时事件监听或 URL 开关。旧 `?loading=auto` / `?loading=click` 参数无效。
- 140 个细星点与 48 个柔光斑分层渐显，亮度和出现批次跟随显示进度；扩散光晕使用宽柔边径向渐变。
- 副文本统一 `var(--muted)`，光色读全局品牌/高光变量，见 [COLOR-SYSTEM.md](<COLOR-SYSTEM.md>)。
- 等待期间正文 `inert` 且禁滚动，结束后恢复；站内路由切换不重播，刷新才重播。

## 实现

- [App.tsx](<src/App.tsx>)：真实首屏资源字节进度、非首页直达、失败与 12 秒兜底。
- [LoadingScreen.tsx](<src/components/LoadingScreen.tsx>)：单调追赶进度、就绪判断、光斑分批呈现、自动结束与单次回调保护。未就绪时不显示 100%。
- [LoadingScreen.css](<src/components/LoadingScreen.css>)：全局颜色消费、星点/光斑、扩散与淡出，无外站资源或 WebGL 依赖。
- [loading.ts](<src/config/loading.ts>)：仅定义最短视觉开场 `1800ms`。减少动态效果时跳过视觉等待/缓动和扩散，仍按真实资源就绪自动进入。

## 验证

```bash
npm run build
npm run preview -- --port 5180
# 另开终端，预览保持运行
npm run test:loading
npm run test:colors
npm run test:works
npm run test:home-works
```

[loading.spec.mjs](<loading.spec.mjs>) 覆盖无输入自动结束、提前点击不能跳过未就绪资源、分段字节加载时光斑增多、手机/减少动态效果自动进入、旧查询参数不会恢复门控、资源失败兜底。

桌面/手机为浏览器验证，未部署；触控模拟不代替真机验收。

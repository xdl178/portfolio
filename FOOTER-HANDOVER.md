# 全局页脚适配

## 当前布局（2026-10-28）

[ContactFooter](<src/components/ContactFooter.tsx>) / [样式](<src/components/ContactFooter.css>) 由 [App](<src/App.tsx>) 在路由外唯一挂载，覆盖首页、作品、详情、关于和404。

本次按用户指定的 [Khanittha首页结尾内容区](<https://portfolio-khanitthahemsamak.vercel.app/>) 重构为居中五层布局，**不使用外层圆角卡片、面板底色、卡片边框或卡片阴影**：

1. 共用 [Badge](<src/components/Badge.tsx>)：“视觉 · 界面 · 动效”，随最新全局要求统一14px、上下6px/左右16px、gap8px；首屏与资料卡同规格，旧compact分支已移除。
2. 主标题：`Let's create something amazing together`，沿用全局 `type-h2`，主文字色。
3. 说明：`Open to full-time roles, freelance projects, and creative collaborations.`，沿用全局 `type-body`/muted。不追加参考站的“Let's talk.”。
4. 原有四个页脚导航：首页、精选作品、关于我、联系，保留原生Link/button和滚动箭头反馈。
5. 用户明确选择的 Email、Phone、Behance，桌面三列同排，700px及以下单列。

旧PORTFOLIO巨字、身份说明和循环文字带已移除。单独的版权尾行和悬浮回顶保留。首页主内容顺序及其他区块不变。

## 联系网格与焦点

- 保留原contact-grid图标＋标签/内容的结构、品牌蓝悬停高亮。当前仅显示选定的三项；小红书数据不删除，但不显示在本页脚。
- 内容来自 [profile.ts](<src/data/profile.ts>)。用户此前明确要求**占位文本，不用链接**：保留可选择的普通文本列表项，不生成mailto/tel/外链、不设置disabled/aria-disabled或禁止光标，即便填写值也只展示。
- 无通道顶部分隔线、配置警告说明或复制参考作者资料。
- 导航CTA、关于页CTA和页脚“联系”调用 [scrollToContact](<src/utils/scrollToContact.ts>)，保持路由，滚动并聚焦 `section#footer-channels`（tabIndex=-1、命名区域）。内部sr-only h3为列表提供名称；减少动态效果时即时跳转。
- [contactChannels](<src/utils/contactChannels.ts>) 旧安全URL校验器仅保留及单测；当前页脚不调用它生成链接。

## 页脚导航滚动反馈

文字默认/悬停均为 `hsl(var(--text))`，不悬停变蓝。保留 [Stefan H参考站](<https://stefanh.co/>) 的三份整行文字上滚两行、三份右上箭头下滚两行；相同spring stiffness500/damping60/mass1负责进出反转，无逐字错开。保留13px字号、44px点击高度、装饰副本aria-hidden及父控件唯一可访问名称。键盘focus-visible同样反馈，减少动态效果或触屏模式静态显示。

## 悬浮回顶与共用规范

[BackToTop](<src/components/BackToTop.tsx>) / [样式](<src/components/BackToTop.css>) 保留右下32px安全区、44px圆形、严格滚动超过500px出现、悬停品牌蓝及上移3px。Motion scroll值仅跨阈值时进入React状态，portal至body避免裁切；隐藏时aria-hidden、tabIndex=-1。正常偏好平滑回顶，减少动态效果即时回顶，不改变路由。

页脚版心/侧边距/上下留白读取 `--container-home` / `--gutter-home` / `--section-space`。局部 `--footer-content-width:1024px` 约束五层内容宽度，使项目type-h2在宽屏保持完整单行。入场读取 [useMotionTokens](<src/hooks/useMotionTokens.ts>)；无新依赖、循环或手写scroll监听。其他页面的 [ActionButton](<src/components/ActionButton.tsx>) 及其填色/换位行为不变。

## 验证

```bash
npm run lint
npm run build
# 既有5180 preview运行时：
npm run test:footer
npm run test:footer-nav
npm run test:profile-contact
npm run test:buttons
npm run test:badge
```

[页脚回归](<footer.spec.mjs>) 覆盖五层DOM/可视顺序、居中/无卡片、精确文案、七屏宽（含701/700边界）、三列/单列、隐私、唯一全局挂载、跨路由焦点与键盘、减少动态效果及无运行时错误。其他回归继续验证500/501阈值、body portal、文字/箭头弹簧恢复、首屏与关于我胶囊尺寸不变。

浏览器模拟不替代触屏真机。不复制参考站的联系方式、个人资料、主题或素材。

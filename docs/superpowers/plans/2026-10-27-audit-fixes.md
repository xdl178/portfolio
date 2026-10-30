# 项目审计修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 修复上一轮已复现的五项缺陷，并收口重复布局、动效与活动路由按钮实现，不做视觉改版。

**Architecture:** 保留现有 React/HashRouter、Motion/GSAP 与全局页脚。CSS `:root` 继续作为设计变量唯一来源；共享 hook 将 CSS 动效值解析成 Motion 使用的秒数和缓动数组。按钮只保留一个实现，通过变体表达描边、玻璃和文字操作。

**Tech Stack:** React19、TypeScript5.9、Vite7、Tailwind3、Framer Motion12、GSAP、Playwright/Chrome。

**Spec:** 本会话上一轮五项已验证问题及三项全局一致性清单；现有 design.md / COLOR-SYSTEM.md；用户“将问题修复”。

## Global Constraints

- 保留品牌蓝 #2686ED、副文本 #BBC9DB、默认矩形12px与已批准4px/圆形例外；不更换素材或个人资料。
- 保留首页四个主区块、128px底留白、全站唯一页脚；不恢复影像实验室或暂停按钮。
- 不自动提交/推送，不覆盖当前未提交工作，不安装新依赖。
- 无关历史备用组件不作为当前故障修复对象。

## Review Focus

- 320/390px窄屏和844×390横屏：灯箱所有操作完整可达，无水平溢出。
- 图片加载完成前后及打开/关闭/方向键切换：焦点、锁滚动与图片比例保持正确。
- 动态切换减少动态效果：Hero视差与路由模糊不继续运动。
- 更新全局布局/动效变量：所有目标消费者跟随，不出现局部旧值。
- 无效作品路由、未配置联系人、键盘/触控：原生导航、禁用及焦点语义不退化。

### Task 1: 五项缺陷的回归与修复

**Files:** 新建 `audit-fixes.spec.mjs`；修改 `src/pages/WorkDetailPage.tsx`、关联灯箱样式、`src/components/Hero.tsx`、`src/App.tsx`、`src/pages/WorksPage.tsx`、`package.json`。

**Interfaces:** 灯箱工具栏提供响应式网格；内部使用可收缩图片区并限制在可用视口，保留关闭、方向键、打开原图与焦点恢复。SectionLead 接受 `id?: string` 并传给 h2。`lint` 改为实际遍历引用项目的 `tsc -b --pretty false`。

- [x] 写失败测试：窄屏/横屏各控件边界在视口内；全部 aria-labelledby 可解析；reduce时滚动400px后Hero缩放/位移不变；封面过渡实际900ms；lint能发现临时隔离探针类型错误并在finally清理探针。
- [x] 对旧构建运行测试，记录每项预期失败，而非只看构建绿灯。
- [x] 修复根因：灯箱限制高度并为图片区预留控制区空间、窄屏工具栏换行；补标题ID；Hero绑定静态值且路由统一遵守reduce；消除有歧义的任意duration类；纠正lint入口。
- [x] 构建并运行上述测试，要求全部通过。

### Task 2: 全局变量与按钮收口

**Files:** 修改 `src/index.css`、`tailwind.config.js`、HomeAbout/Practice/SelectedWorks/ContactFooter相关样式、活动页面与SectionHeader；新建 `src/hooks/useMotionTokens.ts`；扩展 `src/components/ActionButton.tsx/.css`；新增 `global-tokens.spec.mjs`。

**Interfaces:**
- 布局变量 `--container-home:1536px`、`--container-hero:1400px`、`--container-page:1380px`、响应式 `--gutter-home:64/40/20px`、`--section-space:128px`；明确不同版心是有意变体。
- Motion语义时长在root集中定义，保留现有650ms通用揭示、700ms详情揭示、900ms章节揭示、550ms路由、800ms外壳入场、700ms通用封面和900ms档案封面等既有值。`useMotionTokens()` 返回对应 transition；读取全局 `--e-smooth`，监听root样式变化刷新，减少动态效果由各消费者显式处理。
- ActionButton 支持原生 button/a/Router Link；`variant: outline|ghost|text`、`size: default|compact|regular`、pill与自定义icon。将旧btn的活动调用与关于页文字操作迁移为变体；默认页脚/导航效果不变，保持不同按钮用途与圆角。

- [x] 写失败测试：更改布局root变量后目标版心/间距同步；正常900ms过渡及CSS变量变更有效；活动路由不再依赖独立旧btn实现；共享按钮链接/禁用语义正确。
- [x] 验证旧实现失败。
- [x] 在root及共享组件实现上述接口，迁移消费者；独特Hero编排/装饰循环不机械统一成一个时长。
- [x] 运行新测试及既有颜色/按钮/布局回归，保持旧视觉测量基准。

### Task 3: 完整验证与交接

**Files:** 更新 README.md、design.md、相关交接，移除相互冲突或过时规范。

- [x] `npm run lint` 与 `npm run build` 通过。
- [x] 新增两组回归和全部11组既有回归通过；人工检查灯箱窄屏/横屏截图及按钮变体。
- [x] 复核diff、Token来源及事件/observer清理；检查无新颜色、重复全局实例或参考个人资料。
- [x] 汇报实际修复与验证结果；提交/推送留给用户另行授权。

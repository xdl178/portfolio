# HANDOVER.md — 交接文档

> 交接时间：2026-10-22
> 代码基线：`31a6a71`（本地 `main` 分支，**尚未推送到 GitHub**）
> 线上版本：https://xdl178.github.io/portfolio/ （线上仍是更早的 `c11aae0`）
> 视觉规范：`design.md` ｜ 架构说明：`ARCHITECTURE.md`

---

## 1. 三十秒看懂当前状态

**这是什么**：一个独立工作室作品集单页站（React 19 + Vite + TS + Tailwind），HashRouter 四页漫游，蓝黑磨砂玻璃风格，首屏是 240px 描边 `PORTFOLIO` + 白「设计」/蓝「未来」的巨字构图。

**现在能跑吗**：能。`tsc -b` 与 `vite build` 均 0 error；1440 / 1920 / 1280 / 900 / 390 / 360 六视口横向溢出为 0；滚轮与加载屏都正常。

**线上和本地一致吗**：**不一致**。本地有 5 个提交（主题色 `#2686ED`、40% 蓝色层、思源黑体内嵌、header 中性化、文字 30%）还没推。线上还是旧版首屏。

**能直接上线吗**：能，但**内容全是占位符**。所有姓名 / 头衔 / 简介 / 作品 / 客户 / 能力都是 `［ ］` 包起来的假数据，`index.html` 的 `<title>` 也是 `［工作室名称］`。要真上线必须先回填文案（见 §7）。

---

## 2. 本地启动

```bash
cd D:/WorkSpaces/workbuddy/portfolio-landing

npm install            # 首次。已有 node_modules 可跳过
npm run dev            # http://localhost:5180（vite.config.ts 指定）
npm run build          # tsc -b && vite build → dist/
npm run preview        # 预览 dist
npm run lint           # 只有 tsc --noEmit，没有 ESLint
```

环境：Node 22（CI 用 22）、npm 10。项目内可用 managed 运行时：

```
C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2-6/node.exe
```

**已知的 dev server 怪癖**：热更新偶尔会"发旧模块"（改了文件但浏览器里还是旧代码）。判断方法：

```bash
curl -s http://localhost:5180/src/components/Hero.tsx | grep "你刚改的那行"
```

如果 curl 出来的还是旧内容，重启 dev server。验证构建产物时更可靠的做法是 `npm run build && npm run preview` 后再截图。

---

## 3. 截图与自动化校验（`.shots/`）

`.shots/` 是本地验证目录（已 git 忽略），存了一批 CDP 脚本与历史截图。它们依赖一个开了调试端口的无头 Chrome：

```bash
# 1) 起预览服务
npm run build && npx vite preview --port 5190

# 2) 起无头 Chrome（调试端口 9333）
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --hide-scrollbars \
  --remote-debugging-port=9333 \
  --user-data-dir="D:/WorkSpaces/workbuddy/portfolio-landing/.shots/chrome-profile" \
  --window-size=1440,900 about:blank

# 3) 跑脚本
node .shots/hero-check.mjs .shots    # 六视口截图 + 溢出校验 → home.png / home-1920.png / mobile-hero.png …
node .shots/final.mjs .shots         # 滚轮滚动 + SCROLL 按钮落点校验
```

| 脚本 | 作用 |
|---|---|
| `hero-check.mjs` | 1440/1920/1280/900/390/360 六视口截图，输出 `docOverflow` |
| `final.mjs` | 滚轮滚动到 900、点 SCROLL 落 `#work`，验证滚动链路 |
| `shot.mjs` | 多视口截图（`hero-check` 的旧版） |
| `zoom.mjs` / `zoom-screen.png` | 首屏 1:1 裁剪，检查背景图清晰度 |
| `verify-load.mjs` | 加载屏真实百分比验证 |
| `live-check.mjs` | 线上站点回归（域名硬编码在脚本里） |
| `shoot.mjs` | 旧脚本，指向 5180 端口，仅截图 |

⚠️ `chrome-profile/` 目录是 Chrome 用户数据，**不要删**（用户明确要求保留）。

---

## 4. 部署

### 4.1 标准方式（网络正常时）

```bash
git remote add origin https://github.com/xdl178/portfolio.git   # 当前未配置 remote
git push origin main
```

推上去后 GitHub Actions（`.github/workflows/deploy.yml`）自动 `npm ci → npm run build → deploy-pages`。仓库 Settings → Pages → Source 必须是 **GitHub Actions**。

### 4.2 当前环境的方式（github.com 被拦，只能通 api.github.com）

用 Git Data API 脚本，等价于一次提交：

```bash
cd D:/WorkSpaces/workbuddy/portfolio-landing
DEPLOY_MSG="feat: 首屏改版" node D:/WorkSpaces/workbuddy/.workbuddy/tools/deploy-github.mjs . --dry   # 预演
DEPLOY_MSG="feat: 首屏改版" node D:/WorkSpaces/workbuddy/.workbuddy/tools/deploy-github.mjs .           # 真推
```

脚本行为：读 `.token` → 递归收集文件（跳过 `node_modules/dist/.git/.shots/.token`）→ **逐文件做 token 明文内容扫描，命中即中止** → 并发 3 上传 blob（5xx 指数退避）→ 建 tree（全量替换）→ 建 commit → `PATCH refs/heads/main`。

### 4.3 凭据

- `.token`（GitHub PAT）放在项目根，**已在 `.gitignore` 里**（`.token` / `*.token` / `*cred*`）。
- 部署脚本只从 `<projectDir>/.token` 读，不打印、不落产物。
- 交接后**建议轮换这个 token**，然后 `git remote` 用 SSH 或 credential helper，别再把长期 PAT 放在工作目录里。

---

## 5. 上线前必做清单

- [ ] **回填所有占位符**（`［` 全站搜索，见 §7）
- [ ] `index.html` 的 `<title>` 与 `<meta description>` 换成真实工作室名
- [ ] `public/favicon.svg` 换成真实 logo
- [ ] 首屏背景 `public/images/hero-desk.jpg` 换成真图（约 16:9、≤300 KB）
- [ ] `ContactFooter` 的邮箱（`hello@studio.example`）与社交链接（目前全是 `#`）
- [ ] `Navbar` 的 CTA 邮箱
- [ ] 作品图替换（`work-01..04.png` / `study-01.png` 是 AI 占位插画，单张 1.5–2.2 MB，建议压到 300 KB 内并转 WebP）
- [ ] 跑一遍 `design.md §11` 的 Pre-Flight 自检
- [ ] 六视口截图确认无溢出
- [ ] 推送并确认 Actions 绿灯

---

## 6. 已知问题与技术债

| 级别 | 问题 | 说明 / 建议 |
|---|---|---|
| 高 | **全站占位符** | 不能直接对外发布。`grep -rn "［" src` 可列出全部 |
| 高 | **本地 5 个提交未推送** | 线上是旧版首屏；确认视觉后先推 |
| 中 | **作品图未优化** | 6 张 PNG 共 11 MB，单张 1.5–2.2 MB。已 `loading="lazy"`，但移动端 4G 上仍慢。建议 WebP + `srcset` |
| 中 | **CSS 325.7 KB（gzip 127 KB）** | 体积几乎全来自 481 条 `@font-face`。若在意首屏 CSS，可把 `fonts.css` 拆成动态注入，或只保留 300–800 常用字重 |
| 中 | **仓库 37 MB** | 字体 24 MB 直接入库。换来的是构建稳定（不动 lockfile）。可接受，但 clone 偏慢 |
| 中 | **hls.js 与 esbuild 在 dependencies 里但代码没用到** | `grep -rn "hls" src` 为空。可从 `package.json` 移除（注意同步 lock，且要在干净目录重生成以防 rollup 平台包缺失） |
| 低 | **无 ESLint / Prettier** | `npm run lint` 只是 `tsc --noEmit`。多人接手建议补上，统一 CRLF/LF 与 import 顺序 |
| 低 | **无 git remote** | 历史推送走 API 脚本。想用 `git push` 需手动 `remote add` |
| 低 | **无测试** | 纯视觉项目，靠截图回归。若加真实数据层可考虑对 `works.ts` 的派生函数补单测 |
| 低 | **`tailwind.config.js` 注释仍写 `#1F51D6`** | 只是注释，实际值读 `--brand-rgb`（`#2686ED`） |
| 低 | **灯箱不写 URL** | 原稿灯箱是组件内 state，刷新即丢。可接受 |
| 低 | **`design.md` 与实际存在轻微落差** | 文档多轮修订，个别措辞可能与代码不完全同步。以代码为准，顺手修正文档 |

---

## 7. 占位符回填指引

所有假数据都用全角方括号包裹：`［ … ］`。搜索定位：

```bash
grep -rn "［" src index.html
```

回填位置：

| 文件 | 需要改的内容 |
|---|---|
| `index.html` | `<title>`、`<meta name="description">` |
| `src/data/works.ts` | 4 件作品的 `title / titleEn / role / tags / shortDesc / concept / description / details`；想改分类结构就一并改 `categories` |
| `src/pages/AboutPage.tsx` | 顶部 `TIMELINE` 常量（公司 / 角色 / 时间 / 要点） |
| `src/components/AboutCapabilities.tsx` | `CAPABILITIES` 常量（能力名 / 说明）+ 左侧创作理念段落 |
| `src/components/Clients.tsx` | `CLIENTS` 常量（客户名，目前只有 `sr-only` 与 monogram 字母） |
| `src/components/Explorations.tsx` | `COLUMN_LEFT / COLUMN_RIGHT` 的影像标题 |
| `src/components/Hero.tsx` | `<h1 class="sr-only">` 工作室名、左上引文、`BASE ［城市 · 中国］` |
| `src/components/ContactFooter.tsx` | 邮箱 `mailto:`、`SOCIALS` 的 `href` |

**原则**：只改文案，不要动结构与类名。字数是设计过的（标题 ≤ 2 行、副文案 ≤ 20 字），填太长的句子会破坏版式。

---

## 8. 故障排查速查

| 现象 | 原因 | 处理 |
|---|---|---|
| **鼠标滚轮无法滚动** | 锁滚动时"存旧值再恢复"，StrictMode 下把 `hidden` 存成旧值 | 只写 `hidden` / `''`，不存旧值。检查 `App.tsx` 的第二个 `useEffect` 与灯箱的锁滚动 |
| **页面白屏 / 加载屏不走** | 预加载 promise 挂了且无兜底 | 已有 12s watchdog + `catch` 放行。若改加载逻辑，务必保留这两条 |
| **首屏图不显示但进度到 100%** | `revokeObjectURL` 提前执行 | `settle` 里对 `blob:` 的判断要严格 |
| **字体不生效、回退到系统字体** | 族名不匹配 / `fonts.css` 没被 import / `local()` 顶替 | 确认 `main.tsx` 有 `import './assets/fonts/source-han-sans/fonts.css'`；族名必须是 `"Source Han Sans CN"`；浏览器 Network 里应看到 `.woff2` 分片 |
| **`PORTFOLIO` 撑出版心** | 换了字体或字号 | 字距保持 `-0.01em`，240px 时目标宽度 ≤1374px |
| **CI 报 `Cannot find module @rollup/rollup-linux-x64-gnu`** | lockfile 在 Windows 上生成，缺 Linux 平台包 | 在**干净目录**跑 `npm install --package-lock-only`（会补齐 optional deps），再提交 lock |
| **GitHub API 502** | 并发过高 | 脚本已降至并发 3 + 指数退避；手工调用也请降并发 |
| **`git diff` 显示整文件重写** | Windows 下 Python 写文件把 LF 转成 CRLF | 写完后按 `git show HEAD:<file>` 判断上游是 LF 还是 CRLF 再回写；本仓库 `Hero.tsx` 是 CRLF，其余多数是 LF |
| **dev server 发旧模块** | Vite watcher 失效 | `curl` 验证源码后重启 |
| **暗幕中段发灰 / 画面闷** | 36% 节点被改成非 0 | 改回 `stopOpacity="0"`（design.md §7.0） |
| **蓝色层没盖住背景图** | 背景用了"小图 + 模糊底衬"的画中画 | 背景必须 `absolute inset-0 h-full w-full object-cover` |

---

## 9. 改动守则（给接手的人）

1. **先读 `design.md`**。它是这套视觉的唯一事实来源，含配色、字阶、玻璃配方、动效时长、组件规范、Pre-Flight 清单。**改视觉先改文档，再改代码。**
2. **每次改完都跑** `npx tsc -b && npx vite build`，再跑 `hero-check.mjs` 看六视口截图。这个项目没有单元测试，截图就是回归测试。
3. **动首屏之前看 `ARCHITECTURE.md §11`** 的 10 条硬性约束，几乎每条都是踩过的坑换来的。
4. **提交信息保持现状风格**：`feat(hero): …` / `style(hero): …` / `fix: …` + 正文分条列出改动与原因。
5. **别动 `.shots/chrome-profile/`**（用户要求保留）。
6. **别把 `.token` 提交**，也别把它写进任何构建产物、日志、截图。

---

## 10. 交接清单

- [ ] 拿到项目目录后能 `npm install && npm run dev` 起得来
- [ ] 知道线上地址、知道本地领先线上 5 个提交
- [ ] 知道 `.token` 位置、知道要轮换
- [ ] 知道占位符怎么回填（§7）
- [ ] 能复现 §3 的截图流程（这是唯一的回归手段）
- [ ] 读过 `design.md` 与 `ARCHITECTURE.md §11`
- [ ] 知道 5 个提交待推送

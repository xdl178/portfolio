# HANDOVER.md — 交接文档

> 交接时间：2026-10-23（增量同步 `portfolio-landing-next`）
> 代码基线：本地同步后提交（回退点 tag `pre-sync-2026-10-23` = `395201d`）
> 线上版本：https://xdl178.github.io/portfolio/ ，commit `7fee1bb`，Actions run `39746491398` 成功（**尚未包含 10-23 同步的内容**）
> 视觉规范：`design.md` ｜ 架构说明：`ARCHITECTURE.md`

---

## 1. 三十秒看懂当前状态

**这是什么**：一个独立作品集单页站（React 19 + Vite + TS + Tailwind），HashRouter 五路由（含 404），蓝黑磨砂玻璃风格，首屏是 240px 描边 `PORTFOLIO` + 白「设计」/蓝「未来」的巨字构图。首页四段：首屏 → 精选作品 → 项目经验 → 影像实验室。

**现在能跑吗**：能。`tsc -b` 与 `vite build` 均 0 error；1440 / 390 实测横向溢出 0；加载屏 2.3s 撤除、首屏图 1672×941 到位、思源黑体命中、`/works`、`/works/original-ip`、`/about`、404 均正常、无破图。

**线上和本地一致吗**：内容一致，**历史不一致**。2026-10-22 已通过 Git Data API 上线，远端 HEAD 是 `7fee1bb`（一个快照提交，父提交 `c11aae0`）；本地 `main` 是 6 个细粒度提交，二者**树哈希相同**（`56729b6`）但 commit sha 不同。所以后续 `git push` 会被判 non-fast-forward——继续用 §4.2 的脚本推送即可，或用 `git push --force-with-lease` 覆盖为本地历史（内容相同，无数据风险）。

**隐私与发布状态**：当前身份、联系方式、履历、项目日期与职责均为待补充占位；作品图片中已确认的作者署名和真实邮箱已脱敏。作品品牌与第三方许可证保留，正式发布前仍须确认素材授权。旧提交可能保留原信息；普通新提交不会清除Git历史，不得未经授权强推重写历史。最新结构以[README](<README.md>)及[隐私说明](<docs/PRIVACY.md>)为准，下文旧部署过程仅作历史记录。

**10-23 同步了什么**：从 `D:/backup/Documents/deepseek-harness/portfolio-landing-next` 增量同步了 `src/`、`public/`、`docs/`、`README.md`、`index.html`（`src`/`public`/`docs` 与源逐字节一致，仅 `ContactFooter` 修了一次死链）。主要变化：作品换成三件真实案例 + 61 张图（25 MB）、新增「项目经验」区（GSAP 钉标题）、导航文案改「精选作品 / 关于我」+「联系我」mailto、新增 404 路由与 `MotionConfig reducedMotion="user"`、`SectionHeader` 变大标题、依赖新增 `@gsap/react`。源项目五屏改版已被回滚（`#about-intro` / `#contact` 不挂载），本仓库跟随该状态。

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

用 Git Data API 脚本，等价于一次提交。**本项目必须用「增量版」**：

```bash
cd D:/WorkSpaces/workbuddy/portfolio-landing
TOOLS=D:/WorkSpaces/workbuddy/.workbuddy/tools

# 预演（只算差异，不写任何东西）
DEPLOY_MSG="..." node $TOOLS/deploy-github-incremental.mjs . --dry

# 真推
DEPLOY_MSG="..." node $TOOLS/deploy-github-incremental.mjs .
```

**为什么不能用 `deploy-github.mjs`**：那个脚本一次性 `POST /git/trees` 上传全部条目。本项目有 532 个文件（其中 481 片字体），实测直接 **422 timeout**，GitHub 的报错原文是 "your input was too large to process, consider building the tree incrementally"。`deploy-github-incremental.mjs` 的改动：

1. 用本地 git blob sha（`sha1("blob <len>\0"+content)`）与远端 tree 比对，**只传差异**（首次上线 498 个，日常改动通常 < 10 个）；
2. blob 先 `GET /git/blobs/<sha>` 探测，存在就复用，不重复上传 24 MB；
3. tree 按 **40 条一块**、以 `base_tree` 链式合并，最终只产出**一个 commit**（不是几十个）；
4. 远端多余文件用 `sha: null` 标记删除。

脚本安全策略与旧版一致：只读 `.token`、不打印、逐文件做 token 明文扫描命中即中止。

### 4.3 凭据

- `.token`（GitHub PAT）放在项目根，**已在 `.gitignore` 里**（`.token` / `*.token` / `*cred*`）。
- 部署脚本只从 `<projectDir>/.token` 读，不打印、不落产物。
- 交接后**建议轮换这个 token**，然后 `git remote` 用 SSH 或 credential helper，别再把长期 PAT 放在工作目录里。

### 4.4 发布记录

| 日期 | 远端 commit | Actions | 说明 |
|---|---|---|---|
| 2026-10-22 | `7fee1bb` | `39746491398` success | 首屏改版 + 品牌蓝 `#2686ED` + 思源黑体内嵌 + 架构/交接文档；树 `56729b6` 对应本地 `72b3b80` |
| 2026-10-21 | `c11aae0` | `39580131665` success | 首屏图替换 + 真实加载进度 |
| 2026-10-12 | `244b0a3` | `38230999656` success | 首次上线 |

> 表内只登记**代码发布**；纯文档修订的提交不单独列出（会追加在对应发布之后）。

上线后自检（本地跑，约 8 秒）：

```bash
node .shots/live-check.mjs        # 加载屏真实进度 + 首屏截图
```

实测基线（2026-10-22）：加载屏 3379 ms 消失、首屏图 1672×941 / 243 KB、`overflow=0`、字体 `Source Han Sans CN` 命中、22 片 woff2 全部 200。

---

## 5. 上线前必做清单

- [ ] **回填剩余占位符**（只剩 4 处：`Hero.tsx` 的 `<h1>` 与 `BASE ［城市 · 中国］`、`Clients.tsx` 的客户名）
- [x] `index.html` 的 `<title>` 与 `<meta description>` 已换成真实文案（「设计未来 | 视觉与 UI/UX 作品集」）
- [ ] `public/favicon.svg` 换成真实 logo
- [ ] **确认作品与案例授权**（真实客户 / 城市名 + 61 张作品图，发布前需拿到展示许可）
- [ ] 作品图压缩：`public/images/works` 61 张共 25 MB，建议转 WebP + `srcset`，单张控制在 300 KB 内
- [ ] 清理 11 MB 旧占位图（`work-01..04.png` / `study-01.png` / `hero-tunnel.png`，已无引用）
- [ ] 跑一遍 `design.md §11` 的 Pre-Flight 自检
- [ ] 1440 / 390 截图确认无溢出（本次已验证，改样式后需重跑）
- [ ] 推送并确认 Actions 绿灯

---

## 6. 已知问题与技术债

| 级别 | 问题 | 说明 / 建议 |
|---|---|---|
| 高 | **素材授权与历史隐私需确认** | 项目经验现为占位，作品图中确认的署名/邮箱已替换；仍需确认作品素材公开授权。旧Git历史及外部缓存不因新提交自动清理 |
| 中 | **远端历史是单次快照提交** | 远端 HEAD 是 API 生成的快照提交，与本地细粒度提交内容相同（树哈希一致）但 sha 不同；`git push` 会 non-fast-forward。要么继续用 §4.2 脚本，要么 `--force-with-lease` 覆盖为本地历史 |
| 中 | **作品图未优化** | `public/images/works` 61 张 JPG 共 25 MB（单张 0.3–1.2 MB）。已 `loading="lazy"`，移动端 4G 仍偏慢。建议 WebP + `srcset` |
| 中 | **旧占位图仍占 11 MB** | `work-01..04.png` / `study-01.png` / `hero-tunnel.png` 已无任何引用，可删除（源项目同样保留，故本次未动） |
| 中 | **未挂载的五屏组件** | `ProfileIntro.tsx` / `ProfileContact.tsx` / `profile.ts` 是五屏改版遗留，当前无引用。保留待用或整体删除，别让它们误导后来者 |
| 中 | **CSS 325.7 KB（gzip 127 KB）** | 体积几乎全来自 481 条 `@font-face`。若在意首屏 CSS，可把 `fonts.css` 拆成动态注入，或只保留 300–800 常用字重 |
| 中 | **仓库 37 MB** | 字体 24 MB 直接入库。换来的是构建稳定（不动 lockfile）。可接受，但 clone 偏慢 |
| 中 | **hls.js 与 esbuild 在 dependencies 里但代码没用到** | `grep -rn "hls" src` 为空。可从 `package.json` 移除（注意同步 lock，且要在干净目录重生成以防 rollup 平台包缺失） |
| 低 | **无 ESLint / Prettier** | `npm run lint` 只是 `tsc --noEmit`。多人接手建议补上，统一 CRLF/LF 与 import 顺序 |
| 低 | **无 git remote** | 历史推送走 API 脚本。想用 `git push` 需手动 `remote add` |
| 低 | **无测试** | 纯视觉项目，靠截图回归。若加真实数据层可考虑对 `works.ts` 的派生函数补单测 |
| 低 | **`tailwind.config.js` 注释仍写 `#1F51D6`** | 只是注释，实际值读 `--brand-rgb`（`#2686ED`） |
| 低 | **灯箱不写 URL** | 原稿灯箱是组件内 state，刷新即丢。可接受 |
| 低 | **SVG 渐变控制台告警** | `Hero.tsx` 的 `radialGradient` 写了 `cx="734/1440"` 这类非法长度（应写成 `0.51` 这类比例），Chrome 报 4 条 attribute 错误但不影响渲染。因首屏要求逐字节保持，本次未改 |
| 低 | **`design.md` 与实际存在轻微落差** | 文档多轮修订，个别措辞可能与代码不完全同步。以代码为准，顺手修正文档 |

---

## 7. 占位符回填指引

剩余占位符只有 4 处，用全角方括号包裹：`［ … ］`。搜索定位：

```bash
grep -rn "［" src --include=*.ts --include=*.tsx index.html
```

回填位置：

| 文件 | 需要改的内容 |
|---|---|
| `index.html` | 已回填，无需改动 |
| `src/data/works.ts` | 三件作品已是真实内容；换案例时改 `title / titleEn / role / tags / shortDesc / concept / description / details` 与对应图片目录 |
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
- [ ] 知道线上地址、知道远端 HEAD 是 `7fee1bb`（本地 tag `deployed-2026-10-22` 对应它）
- [ ] 知道 `.token` 位置、知道要轮换
- [ ] 知道占位符怎么回填（§7）
- [ ] 能复现 §3 的截图流程（这是唯一的回归手段）
- [ ] 读过 `design.md` 与 `ARCHITECTURE.md §11`
- [ ] 知道发布走 `deploy-github-incremental.mjs`（旧脚本会 422）

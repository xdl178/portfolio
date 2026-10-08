/**
 * 页面内容集中在这里 —— 换文案只改这个文件，不用碰组件。
 * 所有以「占位」标注的地方，替换成你的真实内容即可。
 */

export const profile = {
  /* 占位：改成你的名字 / 品牌名 */
  name: 'xdl178',
  /* 占位：Logo 上显示的字，建议 1-2 个字符 */
  logoText: 'XD',
  /* 占位：一句话头衔 */
  title: 'AI 产品设计 / 全栈开发',
  /* 占位：首屏大标题，可以用 \n 手动换行 */
  headline: '用代码与设计\n做好用的产品',
  /* 占位：首屏简介，2-3 句 */
  intro:
    '我是一名独立开发者与产品设计师，专注把想法快速做成可用的产品。擅长从 0 到 1 完成交互设计、前端实现与工程化部署，交付节奏以周为单位。',
  /* 头像：默认用首字母头像。换成真图时，把图片放进 public/，
     然后把下面这行改成 avatarImage: '/portfolio/avatar.jpg' */
  avatarImage: null,
  /* 在线状态点旁边的小字 */
  status: '目前开放合作邀约',
  /* 所在地 */
  location: '中国 · 远程',
  /* 占位：联系方式 */
  contact: {
    email: 'scarlet0ing.t@gmail.com',
    github: 'https://github.com/xdl178',
    /* 没有就留空字符串，会自动隐藏该项 */
    wechat: '',
    x: '',
  },
}

export const navLinks = [
  { label: '首页', to: '/', type: 'route' },
  { label: '作品', to: '/works', type: 'route' },
  { label: '关于', to: '/about', type: 'route' },
  { label: '联系', to: '/#contact', type: 'anchor' },
]

/* 首屏下方滚动的技术关键词条 */
export const marqueeItems = [
  'React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP',
  'Node.js', 'Python', 'Figma', 'Design System', 'CI/CD', 'GitHub Actions',
]

/* 数据条：首屏下方的小型成绩单 */
export const stats = [
  { value: '6+', label: '年设计与开发经验' },
  { value: '40+', label: '已交付项目' },
  { value: '12', label: '开源仓库' },
  { value: '100%', label: '按时交付率' },
]

/* 技能分组 */
export const skills = [
  { group: '设计', items: ['产品设计', '交互设计', '设计系统', '视觉规范', 'Figma'] },
  { group: '前端', items: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'GSAP'] },
  { group: '工程', items: ['Node.js', 'Python', 'REST / GraphQL', 'CI/CD', 'GitHub Actions'] },
  { group: '方向', items: ['AI 应用', '开发者工具', '数据可视化', '性能优化'] },
]

/**
 * 作品列表 —— 全部为占位内容。
 * cover 传字符串时按图片路径处理（放 public/ 下），传 null 则显示自动生成的渐变封面。
 */
export const works = [
  {
    slug: 'placeholder-nebula',
    title: '占位作品 · Nebula 控制台',
    year: '2026',
    category: 'AI 产品',
    role: '产品设计 + 前端实现',
    summary: '一句话说明这个项目解决了什么问题、你在其中的角色。',
    cover: null,
    tags: ['React', '数据可视化', '设计系统'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文第一段：讲清项目背景 —— 谁遇到了什么问题，为什么值得做。',
      '占位正文第二段：讲你的方案 —— 关键决策、取舍，以及为什么这样做。',
      '占位正文第三段：讲结果 —— 上线后的数据变化、沉淀下来的能力。',
    ],
  },
  {
    slug: 'placeholder-atlas',
    title: '占位作品 · Atlas 协作平台',
    year: '2025',
    category: '开发者工具',
    role: '全栈开发',
    summary: '一句话说明项目定位与你的贡献。',
    cover: null,
    tags: ['Node.js', '实时协作', '权限模型'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文：项目背景与目标用户。',
      '占位正文：技术选型与架构上的关键取舍。',
      '占位正文：上线结果与后续迭代方向。',
    ],
  },
  {
    slug: 'placeholder-lumen',
    title: '占位作品 · Lumen 设计系统',
    year: '2025',
    category: '设计系统',
    role: '设计系统负责人',
    summary: '一句话说明系统的覆盖范围与提效结果。',
    cover: null,
    tags: ['Design Token', '组件库', '文档'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文：为什么要做统一的设计系统。',
      '占位正文：令牌体系与组件分层是怎么设计的。',
      '占位正文：落地效果与团队协作方式的改变。',
    ],
  },
  {
    slug: 'placeholder-orbit',
    title: '占位作品 · Orbit 数据看板',
    year: '2024',
    category: '数据产品',
    role: '前端负责人',
    summary: '一句话说明看板解决了什么决策问题。',
    cover: null,
    tags: ['性能优化', '图表', '权限'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文：数据来源与使用者的真实痛点。',
      '占位正文：渲染性能与交互体验上的优化手段。',
      '占位正文：最终的业务收益。',
    ],
  },
  {
    slug: 'placeholder-signal',
    title: '占位作品 · Signal 内容站',
    year: '2024',
    category: '内容与品牌',
    role: '设计与实现',
    summary: '一句话说明站点定位与视觉效果目标。',
    cover: null,
    tags: ['动效', '响应式', 'SEO'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文：品牌调性如何转成视觉语言。',
      '占位正文：动效与可访问性之间怎么平衡。',
      '占位正文：流量与转化的变化。',
    ],
  },
  {
    slug: 'placeholder-forge',
    title: '占位作品 · Forge 构建工具',
    year: '2023',
    category: '开发者工具',
    role: '核心贡献者',
    summary: '一句话说明工具的能力与使用规模。',
    cover: null,
    tags: ['CLI', '构建优化', '开源'],
    links: [{ label: '在线预览', href: '#' }],
    body: [
      '占位正文：现有工具链的瓶颈在哪里。',
      '占位正文：核心实现思路与关键模块。',
      '占位正文：社区反馈与采纳情况。',
    ],
  },
]

/* 关于页 / 首页关于区块的正文 */
export const aboutParagraphs = [
  '占位：用一段话讲清你是谁、做过什么类型的产品、擅长解决哪一类问题。',
  '占位：讲你的工作方式 —— 怎么从需求走到上线，怎么和团队或客户协作。',
  '占位：讲你接下来想做的方向，以及希望遇到什么样的合作。',
]

/* ===== 经历 ===== */
export const workExperience = [
  {
    no: '01',
    company: '占位 · 某科技公司',
    companyEn: 'Placeholder Tech',
    role: '高级前端工程师 / 产品设计',
    period: '2024.03 — 至今',
    location: '远程',
    accent: '#4D6BFE',
    tags: ['AI 应用', '设计系统', '工程化'],
    summary: '占位：一句话说明这家公司做什么、你负责什么范围。',
    points: [
      '占位：主导了什么，产出了什么可量化的结果。',
      '占位：解决了什么技术或体验难题，怎么解决的。',
      '占位：和哪些角色协作，推动了什么流程改进。',
    ],
  },
  {
    no: '02',
    company: '占位 · 某设计工作室',
    companyEn: 'Placeholder Studio',
    role: '交互设计师 / 前端实现',
    period: '2022.06 — 2024.02',
    location: '上海',
    accent: '#00C2FF',
    tags: ['品牌数字化', '动效', '响应式'],
    summary: '占位：一句话说明业务类型与你的职责。',
    points: [
      '占位：独立负责了哪些项目，交付了什么资产。',
      '占位：在体验细节上做了哪些打磨。',
      '占位：复盘沉淀了什么方法论。',
    ],
  },
]

export const projectExperience = [
  {
    no: '01',
    title: '占位项目 · 智能交互终端',
    titleEn: 'Smart Terminal',
    role: '视觉与 UI/UX 设计',
    period: '2025',
    accent: '#4D6BFE',
    summary: '占位：项目面向谁、解决什么问题、覆盖哪些终端场景。',
    duties: [
      '占位：搭建了怎样的视觉与组件体系。',
      '占位：如何优化操作路径与反馈机制。',
      '占位：与开发如何协作落地，把控了什么品质标准。',
    ],
  },
  {
    no: '02',
    title: '占位项目 · 数据可视化平台',
    titleEn: 'Data Platform',
    role: '前端负责人',
    period: '2024',
    accent: '#7C4DFF',
    summary: '占位：平台服务于什么决策场景，数据规模如何。',
    duties: [
      '占位：渲染性能与交互体验上做了什么优化。',
      '占位：图表与权限体系怎么设计的。',
      '占位：最终带来了什么业务收益。',
    ],
  },
  {
    no: '03',
    title: '占位项目 · 设计系统',
    titleEn: 'Design System',
    role: '设计系统负责人',
    period: '2023',
    accent: '#00C2FF',
    summary: '占位：系统覆盖多少组件与页面，服务多少团队。',
    duties: [
      '占位：令牌体系与组件分层怎么设计。',
      '占位：如何保证一致性与可维护性。',
      '占位：落地后团队协作方式发生了什么变化。',
    ],
  },
]

/* ===== 能力清单 ===== */
export const capabilities = [
  {
    title: '产品设计与交互',
    desc: '从需求梳理到交互稿与视觉规范，输出可直接进入开发的完整方案。',
    icon: 'design',
  },
  {
    title: '前端工程实现',
    desc: 'React + Vite 工程化落地，组件化拆分，动效与性能一并考虑。',
    icon: 'code',
  },
  {
    title: '交付与自动化',
    desc: 'CI/CD 自动构建部署，配上文档与监控，交接之后也能自己维护。',
    icon: 'ship',
  },
]

/* ===== 滚动展示的关键词（跑马灯 / 卡片墙） ===== */
export const techWall = [
  'React 19', 'Vite 8', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Lenis',
  'TypeScript', 'Node.js', 'Python', 'Figma', 'Design Token', 'CI/CD',
  'GitHub Actions', 'Playwright', 'REST', 'GraphQL',
]

/* ===== 工作原则（轮播卡片） ===== */
export const principles = [
  { label: '01', title: '先跑通，再打磨', body: '快速拿出可用的版本验证方向，避免在错误的方向上做精细活。' },
  { label: '02', title: '设计要为交付负责', body: '方案必须考虑实现成本与边界情况，能落地的设计才是好设计。' },
  { label: '03', title: '性能是体验的一部分', body: '首屏体积、渲染帧率、交互延迟，都会被用户直接感知。' },
  { label: '04', title: '可维护优先于聪明', body: '写得让人看得懂、改得动，比炫技更长期有价值。' },
  { label: '05', title: '细节决定专业度', body: '空状态、加载态、错误态，这些边角往往最能体现水准。' },
]

/* 时间线：经历 */
export const timeline = [
  { period: '2024 — 至今', title: '占位 · 独立开发者 / 产品设计', desc: '占位：负责什么，做出了什么结果。' },
  { period: '2021 — 2024', title: '占位 · 某公司 高级前端工程师', desc: '占位：负责什么，做出了什么结果。' },
  { period: '2019 — 2021', title: '占位 · 某公司 交互设计师', desc: '占位：负责什么，做出了什么结果。' },
]

/* 关于页的能力自评（百分比） */
export const skillRatings = [
  { name: 'React / 前端工程', value: 92 },
  { name: 'UI / 交互设计', value: 88 },
  { name: '动效与交互动画', value: 85 },
  { name: 'Node / 后端接口', value: 76 },
  { name: '数据可视化', value: 72 },
  { name: '工程化与 CI/CD', value: 80 },
]

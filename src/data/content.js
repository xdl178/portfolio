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
  headline: '用代码与设计\n构建下一代产品',
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
  { label: '关于', to: '/#about', type: 'anchor' },
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

/* 时间线：经历 */
export const timeline = [
  { period: '2024 — 至今', title: '占位 · 独立开发者 / 产品设计', desc: '占位：负责什么，做出了什么结果。' },
  { period: '2021 — 2024', title: '占位 · 某公司 高级前端工程师', desc: '占位：负责什么，做出了什么结果。' },
  { period: '2019 — 2021', title: '占位 · 某公司 交互设计师', desc: '占位：负责什么，做出了什么结果。' },
]

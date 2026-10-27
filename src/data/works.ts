/* 作品内容与高清图取自 portfolio-test；首屏仍使用 portfolio-landing 的原始资源。 */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const frame = (folder: string, index: number) => asset(`images/works/${folder}/Frame-${index}.jpg`)

export type OriginalImage = { src: string; label: string }
export type Work = {
  id: string
  serial: string
  title: string
  titleEn: string
  category: string
  categoryLabel: string
  year: string
  period: string
  role: string
  cover: string
  pageImages: string[]
  originalImages: OriginalImage[]
  tags: string[]
  shortDesc: string
  concept: string
  description: string
  details: string[]
}

export const works: Work[] = [
  {
    id: 'original-ip', serial: '01', title: '原创 IP 视觉与交互设计',
    titleEn: 'Original IP Visual & Interaction Design', category: 'ip', categoryLabel: '原创 IP',
    year: '2025', period: '2025.06 - 2025.12', role: '主视觉 / UI & UX 设计师',
    cover: frame('original-ip', 8),
    pageImages: Array.from({ length: 19 }, (_, i) => frame('original-ip', i)),
    originalImages: Array.from({ length: 6 }, (_, i) => ({
      src: asset(`images/works/original-ip/${encodeURIComponent(`原稿${i + 1}`)}.jpg`),
      label: `界面原稿 ${String(i + 1).padStart(2, '0')}`,
    })),
    tags: ['原创 IP', '视觉设计', '交互设计', '角色形象'],
    shortDesc: '从角色原型到视觉系统、交互界面和延展应用，建立完整的原创 IP 世界观。',
    concept: '以数字感和流行文化为灵感，塑造具有辨识度与延展性的角色形象，让视觉符号与交互界面讲述同一个故事。',
    description: '围绕角色世界观，完成原型、三视图、视觉系统、互动界面、宣传海报和周边延展，沉淀可复用的视觉资产。',
    details: [
      '建立角色原型、三视图和表情动作规范，保证形象跨场景一致。',
      '设计从落地页、角色介绍到互动场景的连续界面体验。',
      '输出高保真原稿与色彩、字体、图形语言规范，服务后续落地。',
    ],
  },
  {
    id: 'art-studio', serial: '02', title: '粒象工作室品牌交互设计',
    titleEn: 'LX Studio Brand Interaction Design', category: 'brand', categoryLabel: '品牌 & 网页',
    year: '2026', period: '2026.06 - 2026.08', role: '独立品牌 & 网页 UI/UX 主设计师',
    cover: frame('art-studio', 14),
    pageImages: Array.from({ length: 15 }, (_, i) => frame('art-studio', i)),
    originalImages: Array.from({ length: 8 }, (_, i) => ({
      src: frame('art-studio', i + 15), label: `界面原稿 ${String(i + 1).padStart(2, '0')}`,
    })),
    tags: ['品牌官网', '艺术工作室', '响应式网页', '移动端适配'],
    shortDesc: '为独立艺术工作室建立品牌气质与双端页面系统，让作品成为叙事中心。',
    concept: '以克制与张力并存为设计核心，用留白与高对比的文字编排承载艺术作品，让界面成为作品的延伸。',
    description: '从品牌气质梳理、视觉语言定义到网页与移动端界面，设计作品展示、艺术家介绍与预约联系等核心模块。',
    details: [
      '搭建品牌色彩、字体层级、图形语言与网格系统。',
      '以非对称画廊编排形成明确的作品阅读动线。',
      '定义导航、作品卡片和标题组的响应式组件规范。',
    ],
  },
  {
    id: 'mivox', serial: '03', title: 'Mivox 觅沃产品网页设计',
    titleEn: 'Mivox Product Website Design', category: 'ai', categoryLabel: 'AI 产品官网',
    year: '2026', period: '2026.03 - 2026.04', role: '产品官网 UI/UX 主设计师',
    cover: frame('mivox', 7),
    pageImages: Array.from({ length: 11 }, (_, i) => frame('mivox', i)),
    originalImages: [{ src: frame('mivox', 11), label: '界面原稿 01' }],
    tags: ['AI 产品', '官网落地页', '产品叙事', '响应式'],
    shortDesc: '从品牌叙事到功能展示与转化入口，为 AI 产品建立清晰可信的官网体验。',
    concept: '用科技感、可信赖和有温度的视觉语言，将智能技术转化为用户看得懂、愿意使用的产品价值。',
    description: '设计首页主视觉、产品功能、解决方案与联系入口，建立统一组件系统和跨设备可延展的视觉规范。',
    details: [
      '定义科技感与可信赖并存的品牌视觉基调。',
      '以清晰的页面动线串联功能展示、场景说明与转化入口。',
      '梳理多端组件和栅格规则，支持开发交付与设计走查。',
    ],
  },
]

export const categories = [
  { id: 'all', label: '全部作品' },
  { id: 'ip', label: '原创 IP' },
  { id: 'brand', label: '品牌 & 网页' },
  { id: 'ai', label: 'AI 产品官网' },
] as const

export const getWorkById = (id: string | undefined) => works.find((work) => work.id === id)
export const getRelatedWorks = (id: string, limit = 2) => works.filter((work) => work.id !== id).slice(0, limit)

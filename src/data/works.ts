/* ============================================================
   works.ts · 作品数据层（全部为占位符，见 design.md §3）
   结构参考 portfolio-test 的 works.js：
   pageImages = 主要页面陈列 · originalImages = 原稿（灯箱查看）
   ============================================================ */

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

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
    id: 'brand-system',
    serial: '01',
    title: '［作品标题 01］',
    titleEn: 'PLACEHOLDER PROJECT 01',
    category: 'brand',
    categoryLabel: '品牌视觉',
    year: '2026',
    period: '2026.01 - 2026.03',
    role: '［角色 · 头衔］',
    cover: asset('images/work-01.png'),
    pageImages: [asset('images/work-01.png'), asset('images/study-01.png')],
    originalImages: [
      { src: asset('images/work-02.png'), label: '原稿 01' },
      { src: asset('images/work-03.png'), label: '原稿 02' },
    ],
    tags: ['［关键词］', '［关键词］', '［关键词］'],
    shortDesc: '［一句话项目简介，20 字以内。］',
    concept: '［设计理念：本项目以……为核心，通过……建立统一的视觉语言。］',
    description: '［项目详情：围绕核心诉求完成从概念、系统到落地页的全链路输出。］',
    details: [
      '［工作内容 01：负责的主要模块与产出。］',
      '［工作内容 02：负责的主要模块与产出。］',
      '［工作内容 03：负责的主要模块与产出。］',
      '［工作内容 04：负责的主要模块与产出。］',
    ],
  },
  {
    id: 'product-site',
    serial: '02',
    title: '［作品标题 02］',
    titleEn: 'PLACEHOLDER PROJECT 02',
    category: 'product',
    categoryLabel: '产品界面',
    year: '2026',
    period: '2026.04 - 2026.06',
    role: '［角色 · 头衔］',
    cover: asset('images/work-02.png'),
    pageImages: [asset('images/work-02.png'), asset('images/work-04.png')],
    originalImages: [{ src: asset('images/work-01.png'), label: '原稿 01' }],
    tags: ['［关键词］', '［关键词］', '［关键词］'],
    shortDesc: '［一句话项目简介，20 字以内。］',
    concept: '［设计理念：本项目以……为核心，通过……建立统一的视觉语言。］',
    description: '［项目详情：围绕核心诉求完成从概念、系统到落地页的全链路输出。］',
    details: [
      '［工作内容 01：负责的主要模块与产出。］',
      '［工作内容 02：负责的主要模块与产出。］',
      '［工作内容 03：负责的主要模块与产出。］',
    ],
  },
  {
    id: 'motion-lab',
    serial: '03',
    title: '［作品标题 03］',
    titleEn: 'PLACEHOLDER PROJECT 03',
    category: 'motion',
    categoryLabel: '动态影像',
    year: '2026',
    period: '2026.07 - 2026.08',
    role: '［角色 · 头衔］',
    cover: asset('images/work-03.png'),
    pageImages: [asset('images/work-03.png'), asset('images/study-01.png')],
    originalImages: [
      { src: asset('images/work-04.png'), label: '原稿 01' },
      { src: asset('images/work-01.png'), label: '原稿 02' },
    ],
    tags: ['［关键词］', '［关键词］', '［关键词］'],
    shortDesc: '［一句话项目简介，20 字以内。］',
    concept: '［设计理念：本项目以……为核心，通过……建立统一的视觉语言。］',
    description: '［项目详情：围绕核心诉求完成从概念、系统到落地页的全链路输出。］',
    details: [
      '［工作内容 01：负责的主要模块与产出。］',
      '［工作内容 02：负责的主要模块与产出。］',
      '［工作内容 03：负责的主要模块与产出。］',
    ],
  },
  {
    id: 'space-xp',
    serial: '04',
    title: '［作品标题 04］',
    titleEn: 'PLACEHOLDER PROJECT 04',
    category: 'space',
    categoryLabel: '空间体验',
    year: '2026',
    period: '2026.09 - 2026.10',
    role: '［角色 · 头衔］',
    cover: asset('images/work-04.png'),
    pageImages: [asset('images/work-04.png'), asset('images/work-02.png')],
    originalImages: [{ src: asset('images/study-01.png'), label: '原稿 01' }],
    tags: ['［关键词］', '［关键词］', '［关键词］'],
    shortDesc: '［一句话项目简介，20 字以内。］',
    concept: '［设计理念：本项目以……为核心，通过……建立统一的视觉语言。］',
    description: '［项目详情：围绕核心诉求完成从概念、系统到落地页的全链路输出。］',
    details: [
      '［工作内容 01：负责的主要模块与产出。］',
      '［工作内容 02：负责的主要模块与产出。］',
      '［工作内容 03：负责的主要模块与产出。］',
    ],
  },
]

export const categories = [
  { id: 'all', label: '全部作品' },
  { id: 'brand', label: '品牌视觉' },
  { id: 'product', label: '产品界面' },
  { id: 'motion', label: '动态影像' },
  { id: 'space', label: '空间体验' },
] as const

export const getWorkById = (id: string | undefined) =>
  works.find((w) => w.id === id)

export const getRelatedWorks = (id: string, limit = 3) =>
  works.filter((w) => w.id !== id).slice(0, limit)

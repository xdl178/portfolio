import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import PointerGlow from '../components/PointerGlow'
import '../components/WorksMotion.css'
import { categories, works } from '../data/works'

/* 作品档案：对齐 portfolio-test 的编辑式版式
   刊头（标签行 + 两行巨字）→ 导读（序号 + 正文 + 统计卡）→ 筛选 → 图文交替的展陈行 */

export default function WorksPage() {
  const [filter, setFilter] = useState<string>('all')
  const reduceMotion = useReducedMotion()
  const reveal = reduceMotion ? false : { opacity: 0, y: 24 }
  const revealTransition = reduceMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }
  const filtered = filter === 'all' ? works : works.filter((work) => work.category === filter)
  const pages = works.reduce((total, work) => total + work.pageImages.length, 0)
  const originals = works.reduce((total, work) => total + work.originalImages.length, 0)

  const stats = [
    { tag: 'N·01', value: String(works.length).padStart(2, '0'), label: '件精选作品' },
    { tag: 'N·02', value: String(pages).padStart(2, '0'), label: '张设计页面' },
    { tag: 'N·03', value: String(originals).padStart(2, '0'), label: '张主要原稿' },
  ]

  return (
    <div data-works-page className="relative min-h-[100dvh] bg-bg pb-28 pt-32 md:pb-44 md:pt-40">
      <div className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <motion.header data-works-reveal initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={revealTransition}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-paper/20 bg-paper/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Archive · 2026</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">The Archive · 作品档案</span>
          </div>

          <h1 className="mt-10 text-[clamp(2.8rem,11vw,8.4rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text-primary">
            <span className="block">作品</span>
            <span className="block text-gradient">档案。</span>
          </h1>

          <div className="mt-14 grid gap-10 border-b border-paper/15 pb-14 md:mt-16 md:grid-cols-12 md:items-end md:gap-14 md:pb-16">
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="font-mono text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-muted">01</span>
                <span aria-hidden="true" className="h-px w-10 bg-paper/25" />
                <span className="type-label text-[11px] text-muted">Intro · 章节导读</span>
              </div>
              <p className="mt-6 max-w-[52ch] text-base leading-8 text-muted">
                每个项目都是一次从概念到落地的探索：从原创 IP 视觉系统、品牌交互网站到 AI 产品官网，完整呈现设计页面与主要原稿。点击任意作品进入详情展区。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:col-span-5">
              {stats.map((stat) => (
                <div key={stat.tag} className="relative rounded-card border border-paper/15 bg-paper/[0.02] p-4 md:p-5">
                  <span className="absolute right-3 top-3 font-mono text-[9px] tracking-[0.14em] text-muted">{stat.tag}</span>
                  <p className="font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none text-text-primary">{stat.value}</p>
                  <p className="mt-3 text-[11px] leading-5 text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        <div className="flex flex-wrap gap-2 py-9" role="group" aria-label="按方向筛选作品">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              aria-pressed={filter === category.id}
              className={`min-h-11 rounded-full border px-5 text-sm transition-colors duration-200 ${filter === category.id ? 'border-accent bg-accent text-bg' : 'border-paper/20 text-text-primary hover:border-accent hover:text-accent-strong'}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="sr-only">找到 {filtered.length} 件作品</div>

        <motion.div layout={!reduceMotion} className="space-y-20 md:space-y-32">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, index) => (
              <motion.article data-works-reveal key={work.id} layout={!reduceMotion} initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }} transition={revealTransition}>
                <Link to={`/works/${work.id}`} className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14" aria-label={`查看${work.title}完整案例`}>
                  <div className={`relative lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-card border border-paper/10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" />
                    <PointerGlow className="overflow-hidden">
                      <img
                        src={work.cover}
                        alt={`${work.title}作品封面`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                      />
                      <span aria-hidden="true" className="absolute left-5 top-4 font-mono text-[clamp(2.6rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.05em] text-paper/75 mix-blend-difference">{work.serial}</span>
                      <span className="absolute bottom-4 right-4 rounded-full border border-paper/25 bg-bg/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur-md">{work.categoryLabel}</span>
                    </PointerGlow>
                  </div>

                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Exhibit · N° {String(index + 1).padStart(3, '0')}</p>
                    <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-text-primary transition-colors group-hover:text-accent-strong">{work.title}</h2>
                    <p className="mt-3 font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-muted">{work.titleEn}</p>
                    <p className="mt-6 max-w-[44ch] text-sm leading-7 text-muted">{work.shortDesc}</p>

                    <dl className="mt-8 grid grid-cols-2 gap-3">
                      <PointerGlow><div className="p-4">
                        <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Role · 角色</dt>
                        <dd className="mt-2 text-sm leading-6 text-text-primary">{work.role}</dd>
                      </div></PointerGlow>
                      <PointerGlow><div className="p-4">
                        <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Year · 年份</dt>
                        <dd className="mt-2 font-mono text-sm leading-6 text-text-primary">{work.year}</dd>
                      </div></PointerGlow>
                    </dl>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-paper/15 px-3 py-1 text-[11px] text-muted"># {tag}</li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {work.pageImages.length} 页设计页面 <span className="mx-2 text-accent">/</span> {work.originalImages.length} 张原稿
                      </p>
                      <span data-work-enter className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-primary">
                        Enter
                        <svg aria-hidden="true" viewBox="0 0 48 16" fill="none" className="work-enter-arrow h-4 w-12 text-accent">
                          <path d="M1 8h44m-7-6 7 6-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xl text-text-primary">这个方向还没有公开的作品。</p>
            <button type="button" onClick={() => setFilter('all')} className="btn btn-outline mt-6">查看全部作品</button>
          </div>
        )}
      </div>
    </div>
  )
}

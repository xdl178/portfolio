import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import PointerGlow from '../components/PointerGlow'
import '../components/WorksMotion.css'
import { categories, works } from '../data/works'
import { useMotionTokens } from '../hooks/useMotionTokens'
import ActionButton from '../components/ActionButton'
import Badge from '../components/Badge'
import SurfaceCard from '../components/SurfaceCard'
import WorkTag from '../components/WorkTag'
import './WorksFilters.css'

/* 作品档案：对齐 portfolio-test 的编辑式版式
   刊头（标签行 + 两行巨字）→ 导读（序号 + 正文 + 统计卡）→ 筛选 → 图文交替的展陈行 */

export default function WorksPage() {
  const [filter, setFilter] = useState<string>('all')
  const [hasFiltered, setHasFiltered] = useState(false)
  const selectFilter = (category: string) => {
    setHasFiltered(true)
    setFilter(category)
  }
  const reduceMotion = useReducedMotion()
  const tokens = useMotionTokens()
  const reveal = { opacity: 0, transform: 'translateY(24px)' }
  const visible = { opacity: 1, transform: 'none' }
  const entrance = !hasFiltered && !reduceMotion
  const revealTransition = reduceMotion ? { duration: 0 } : tokens.reveal
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
      <div className="container-page">
        <header data-works-reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge>Archive · 2026</Badge>
          </div>

          <h1 className="mt-10 whitespace-nowrap text-center text-[clamp(2.8rem,11vw,8.4rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text-primary">
            <span>作品</span><span className="text-gradient">档案</span>
          </h1>

          <div className="mt-14 grid gap-10 border-b border-paper/15 pb-14 md:mt-16 md:grid-cols-12 md:items-end md:gap-14 md:pb-16">
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="font-mono text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-muted">01</span>
                <span aria-hidden="true" className="h-px w-10 bg-paper/25" />
                <span className="type-label text-xs text-muted">Intro · 章节导读</span>
              </div>
              <p className="mt-6 max-w-[52ch] text-base leading-8 text-muted">
                每个项目都是一次从概念到落地的探索：从原创 IP 视觉系统、品牌交互网站到 AI 产品官网，完整呈现设计页面与主要原稿。点击任意作品进入详情展区。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:col-span-5">
              {stats.map((stat, index) => (
                <SurfaceCard key={stat.tag} index={index}>
                  <span className="block text-right font-mono text-xs leading-[18px] tracking-[0.14em] text-muted">{stat.tag}</span>
                  <p className="mt-2 font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none text-text-primary">{stat.value}</p>
                  <p className="mt-3 text-balance text-xs leading-5 text-muted">{stat.label}</p>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </header>

        <div data-works-filter-tabs="true" className="works-filter-tabs" role="group" aria-label="按方向筛选作品">
          {categories.map((category) => (
            <Badge
              as="button"
              key={category.id}
              type="button"
              className="works-filter-tab"
              onClick={() => selectFilter(category.id)}
              aria-pressed={filter === category.id}
            >
              {filter === category.id && <motion.span
                aria-hidden="true"
                data-work-filter-indicator
                className="works-filter-indicator"
                layoutId={reduceMotion ? undefined : 'works-filter-active'}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
              />}
              <span className="works-filter-label">{category.label}</span>
            </Badge>
          ))}
        </div>

        <div aria-live="polite" className="sr-only">找到 {filtered.length} 件作品</div>

        {/* Gap belongs to the list, not siblings retained by an exit animation.
            Scroll reveal is initial-page only: filtering commits directly to its
            final geometry, without parent/row projection or a second y reveal. */}
        <div className="works-results">
            {filtered.map((work, index) => (
              <motion.article
                data-works-reveal
                key={work.id}
                // Explicit base pose survives the route's initial=false presence.
                style={entrance ? reveal : visible}
                initial={entrance ? reveal : false}
                animate={hasFiltered ? visible : undefined}
                whileInView={entrance ? visible : undefined}
                viewport={{ once: true, amount: .08 }}
                transition={hasFiltered ? { duration: 0 } : revealTransition}
              >
                <Link to={`/works/${work.id}`} className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14" aria-label={`查看${work.title}完整案例`}>
                  <div className={`relative lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-card border border-paper/10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" />
                    <PointerGlow className="overflow-hidden">
                      <img
                        src={work.cover}
                        alt={`${work.title}作品封面`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="aspect-[16/10] w-full object-cover transition-transform archive-cover-transition ease-out group-hover:scale-[1.04]"
                      />
                      <span aria-hidden="true" className="absolute left-5 top-4 font-mono text-[clamp(2.6rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.05em] text-text-primary mix-blend-difference">{work.serial}</span>
                      <Badge surface="image" className="absolute bottom-4 right-4">{work.categoryLabel}</Badge>
                    </PointerGlow>
                  </div>

                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Exhibit · N° {String(index + 1).padStart(3, '0')}</p>
                    <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-text-primary transition-colors group-hover:text-accent-strong">{work.title}</h2>
                    <p className="mt-3 font-mono text-xs uppercase leading-5 tracking-[0.16em] text-muted">{work.titleEn}</p>
                    <p className="mt-6 max-w-[44ch] text-sm leading-7 text-muted">{work.shortDesc}</p>

                    <dl className="mt-8 grid grid-cols-2 gap-3">
                      <SurfaceCard reveal={false} glow>
                        <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Role · 角色</dt>
                        <dd className="mt-2 text-sm leading-6 text-text-primary">{work.role}</dd>
                      </SurfaceCard>
                      <SurfaceCard reveal={false} glow>
                        <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Year · 年份</dt>
                        <dd className="mt-2 font-mono text-sm leading-6 text-text-primary">{work.year}</dd>
                      </SurfaceCard>
                    </dl>

                    <ul className="mt-6 flex flex-wrap gap-4" aria-label="作品标签">
                      {work.tags.map((tag) => (
                        <li key={tag}><WorkTag># {tag}</WorkTag></li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5">
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                        {work.pageImages.length} 页设计页面 <span className="mx-2 text-accent">/</span> {work.originalImages.length} 张原稿
                      </p>
                      <span data-work-enter className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-text-primary">
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
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xl text-text-primary">这个方向还没有公开的作品。</p>
            <ActionButton size="regular" pill onClick={() => selectFilter('all')} className="mt-6">查看全部作品</ActionButton>
          </div>
        )}
      </div>
    </div>
  )
}

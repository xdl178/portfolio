import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import WorkTilt from '../components/WorkTilt'
import '../components/WorksMotion.css'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import PointerGlow from '../components/PointerGlow'
import { getRelatedWorks, getWorkById } from '../data/works'

/* 作品详情：对齐 portfolio-test 的展陈版式
   面包屑 + 返回 → 标签行 → 巨字标题 → 摘要 → 四方信息卡 → 01/02/03 分节 */

function SectionLead({ index, label, title, note }: { index: string; label: string; title: string; note?: string }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-paper/15 pb-6">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="font-mono text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-muted">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-paper/25" />
        <div>
          <p className="type-label text-[10px] text-muted">{label}</p>
          <h2 className="mt-2 text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.055em] text-text-primary">{title}</h2>
        </div>
      </div>
      {note && <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{note}</span>}
    </div>
  )
}

export default function WorkDetailPage() {
  const { id } = useParams()
  const work = getWorkById(id)
  const [imageIndex, setImageIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const reveal = reduceMotion ? false : { opacity: 0, y: 28 }
  const revealTransition = reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  useLayoutEffect(() => {
    // Runs when the incoming route actually mounts, not while the old page exits.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])
  useEffect(() => { setImageIndex(null) }, [id])
  const openOriginal = (index: number, trigger: HTMLElement) => {
    returnFocus.current = trigger
    setImageIndex(index)
  }
  const closeOriginal = () => {
    setImageIndex(null)
    window.requestAnimationFrame(() => returnFocus.current?.focus())
  }
  useEffect(() => {
    if (imageIndex === null || !work) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeOriginal() }
      if (event.key === 'Tab') {
        const targets = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
        if (targets?.length) {
          const first = targets[0]
          const last = targets[targets.length - 1]
          if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
          else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
        }
      }
      if (event.key === 'ArrowRight') setImageIndex((current) => current === null ? 0 : (current + 1) % work.originalImages.length)
      if (event.key === 'ArrowLeft') setImageIndex((current) => current === null ? 0 : (current - 1 + work.originalImages.length) % work.originalImages.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [imageIndex, work])

  if (!work) return <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center"><h1 className="text-8xl font-semibold text-accent">404</h1><p className="mt-6 text-xl text-text-primary">这件作品暂时不在档案里。</p><Link to="/works" className="btn btn-outline mt-8">返回作品档案</Link></div>

  const related = getRelatedWorks(work.id)
  const original = imageIndex === null ? null : work.originalImages[imageIndex]
  return (
    <div data-work-detail className="bg-bg pb-28 pt-24 md:pb-44 md:pt-32">
      <div className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <nav aria-label="面包屑" className="flex flex-wrap items-center justify-between gap-5 border-b border-paper/15 py-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            <span className="text-muted">01</span><Link to="/" className="hover:text-accent">Home</Link>
            <span className="text-muted">/</span>
            <span className="text-muted">02</span><Link to="/works" className="hover:text-accent">Archive</Link>
            <span className="text-muted">/</span>
            <span className="text-muted">03</span><span className="text-text-primary">{work.title}</span>
          </div>
          <Link to="/works" className="group inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-primary transition-colors hover:border-accent">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Back · 返回作品档案
          </Link>
        </nav>

        <motion.header initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={revealTransition} className="py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{work.categoryLabel}</span>
            <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{work.year}</span>
            <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">N° {work.serial}</span>
          </div>

          <h1 className="mt-8 max-w-[46ch] text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[1.04] tracking-[-0.06em] text-text-primary text-balance">{work.title}</h1>
          <p className="mt-5 font-mono text-[11px] uppercase leading-6 tracking-[0.18em] text-muted">{work.titleEn}</p>
          <p className="mt-8 max-w-[54ch] text-base leading-8 text-muted">{work.shortDesc}</p>

          <dl className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PointerGlow><div className="p-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">01 · Role 角色</dt>
              <dd className="mt-3 text-sm leading-6 text-text-primary">{work.role}</dd>
            </div></PointerGlow>
            <PointerGlow><div className="p-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">02 · Period 周期</dt>
              <dd className="mt-3 font-mono text-sm leading-6 text-text-primary">{work.period}</dd>
            </div></PointerGlow>
            <PointerGlow><div className="p-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">03 · Category 方向</dt>
              <dd className="mt-3 text-sm leading-6 text-text-primary">{work.categoryLabel}</dd>
            </div></PointerGlow>
            <PointerGlow><div className="p-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">04 · Tags 关键词</dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">{work.tags.map((tag) => <span key={tag} className="rounded-full border border-paper/15 px-2.5 py-1 text-[11px] leading-4 text-muted">{tag}</span>)}</dd>
            </div></PointerGlow>
          </dl>
        </motion.header>

        <motion.figure initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={revealTransition} className="relative">
          <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rounded-card border border-paper/10" />
          <div className="relative overflow-hidden rounded-card border border-paper/10 bg-surface">
            <img src={work.cover} alt={`${work.title}主视觉`} className="aspect-[16/9] w-full object-cover" fetchPriority="high" />
          </div>
        </motion.figure>

        <section className="py-24 md:py-36" aria-labelledby="concept-h">
          <SectionLead index="01" label="Concept · 设计理念" title="设计的出发点。" note={work.period} />
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <p id="concept-h" className="text-xl leading-9 text-text-primary md:col-span-6 md:text-2xl md:leading-[1.7]">{work.concept}</p>
            <div className="md:col-span-6">
              <PointerGlow><div className="p-6 md:p-8">
              <p className="leading-8 text-muted">{work.description}</p>
              <ul className="mt-10 space-y-5 border-t border-paper/15 pt-8">
                {work.details.map((detail) => (
                  <li key={detail} className="flex gap-4 text-sm leading-7 text-muted">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                    {detail}
                  </li>
                ))}
              </ul>
              </div></PointerGlow>
            </div>
          </div>
        </section>

        <section id="work-pages" className="py-20 md:py-28" aria-labelledby="frames-h">
          <SectionLead index="02" label="Pages · 页面陈列" title="页面陈列。" note={`${work.pageImages.length} Frames`} />
          <div className="space-y-6 md:space-y-10">
            {work.pageImages.map((src, i) => (
              <motion.figure key={src} initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -80px 0px' }} transition={revealTransition} className="overflow-hidden rounded-card border border-paper/10 bg-surface">
                <img src={src} alt={`${work.title}设计页面 ${i + 1}`} loading="lazy" decoding="async" className="block h-auto w-full" />
                <figcaption className="flex items-center justify-between border-t border-paper/10 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <span>{work.title}</span>
                  <span>{String(i + 1).padStart(2, '0')} / {String(work.pageImages.length).padStart(2, '0')}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section id="work-originals" className="py-20 md:py-28" aria-labelledby="originals-h">
          <SectionLead index="03" label="Originals · 原稿" title="回到原稿。" note={`${work.originalImages.length} Drafts · 键盘 ← → 切换`} />
          <div className="grid grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {work.originalImages.map((item, i) => (
              <motion.div key={item.src} initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ ...revealTransition, delay: reduceMotion ? 0 : (i % 3) * .06 }}><PointerGlow><button type="button" onClick={(event) => openOriginal(i, event.currentTarget)} title={`点击查看${item.label}，使用左右方向键切换`} className="group block w-full rounded-card text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                <span className="relative block overflow-hidden">
                  <img src={item.src} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <span data-original-hint className="original-hint absolute inset-x-0 bottom-0 bg-bg/85 px-5 py-4 text-sm text-text-primary">点击查看主要界面原稿 <span aria-hidden="true">↗</span></span>
                </span>
                <span className="flex items-center justify-between border-t border-paper/10 px-5 py-4 text-sm text-text-primary">
                  {item.label}
                  <span aria-hidden="true" className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </span>
                <span className="sr-only">点击放大，左右方向键切换，Esc 关闭</span>
              </button><a href={item.src} target="_blank" rel="noopener noreferrer" className="block border-t border-paper/10 px-5 py-3 text-xs text-muted transition-colors hover:text-text-primary" aria-label={`新标签页打开${item.label}`}>新标签页打开高清原稿 ↗</a></PointerGlow></motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-paper/15 pt-14" aria-labelledby="related-h">
          <div className="mb-10 flex items-center gap-4">
            <span aria-hidden="true" className="font-mono text-[1.8rem] font-semibold leading-none text-muted">04</span>
            <span aria-hidden="true" className="h-px w-10 bg-paper/25" />
            <h2 id="related-h" className="text-2xl font-semibold text-text-primary">继续探索</h2>
          </div>
          <div data-work-related className="grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <WorkTilt key={item.id}><PointerGlow><Link to={`/works/${item.id}`} className="group block h-full overflow-hidden rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                <div className="overflow-hidden">
                  <img src={item.cover} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-paper/10 p-6 text-xl text-text-primary">
                  <span>{item.title}</span>
                  <span aria-hidden="true" className="work-related-arrow text-accent">↗</span>
                </div>
              </Link></PointerGlow></WorkTilt>
            ))}
          </div>
        </section>
      </div>

      {createPortal(<AnimatePresence>
        {original && (
          <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label={original.label} className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgb(var(--gallery-overlay-rgb)/.95)] p-5 backdrop-blur-xl md:p-10" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }} onClick={closeOriginal}>
            <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between text-text-primary">
                <span>{original.label} <span className="ml-2 text-muted">{imageIndex! + 1} / {work.originalImages.length}</span></span>
                <button type="button" onClick={closeOriginal} autoFocus aria-label="关闭原稿" className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 text-2xl hover:border-accent">×</button>
              </div>
              <img src={original.src} alt={original.label} className="max-h-[72dvh] w-full rounded-card object-contain" />
              <div className="mt-5 flex justify-between gap-4">
                <button type="button" onClick={() => setImageIndex((imageIndex! - 1 + work.originalImages.length) % work.originalImages.length)} className="btn btn-outline">← 上一张</button>
                <a href={original.src} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">打开原图 ↗</a>
                <button type="button" onClick={() => setImageIndex((imageIndex! + 1) % work.originalImages.length)} className="btn btn-outline">下一张 →</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  )
}

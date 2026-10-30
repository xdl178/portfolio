import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ActionButton from './ActionButton'

/* 影像实验室：手风琴画廊（对齐 portfolio-test 的 AccordionGallery 版式）
   桌面 → 三块横向面板，悬停 / 聚焦时该块变宽；移动端 → 纵向堆叠
   点击任意面板进入灯箱，键盘 ← → / Esc 可切换与关闭 */

type Item = { title: string; image: string; description: string; index: string }
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const images: Item[] = [
  { index: '01', title: '角色叙事', image: 'images/works/original-ip/Frame-8.jpg', description: '从一个角色出发，延伸出一整套表达语言。' },
  { index: '02', title: '品牌构图', image: 'images/works/art-studio/Frame-14.jpg', description: '在作品和空间之间，找到恰好的阅读节奏。' },
  { index: '03', title: '产品语言', image: 'images/works/mivox/Frame-7.jpg', description: '把抽象的技术能力，转译为可感知的产品体验。' },
]

export default function Explorations() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((current) => current === null ? 0 : (current + 1) % images.length)
      if (event.key === 'ArrowLeft') setActive((current) => current === null ? 0 : (current - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
  }, [active])

  return (
    <section id="gallery" ref={root} className="home-section relative bg-bg">
      <div className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <SectionHeader
          index="03"
          label="影像实验室 · VISUAL LAB"
          title={<>视觉，是<span className="whitespace-nowrap">另一种</span><span className="text-gradient whitespace-nowrap">思考方式。</span></>}
          subtitle="打开一幅画面，看看设计如何从概念走向界面。"
          action={<p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Hover to expand · 点击放大</p>}
        />

        <div className="mt-14 flex flex-col gap-4 md:mt-20 md:h-[62vh] md:min-h-[480px] md:flex-row md:gap-3">
          {images.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`放大查看${item.title}`}
              className="group relative flex flex-none flex-col overflow-hidden rounded-card border border-paper/10 bg-surface text-left transition-[flex-grow,border-color] duration-700 [transition-timing-function:var(--e-smooth)] hover:border-accent/40 focus-visible:border-accent/60 md:min-w-0 md:flex-1 md:grow md:hover:grow-[1.8] md:focus-visible:grow-[1.8]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                <img
                  src={asset(item.image)}
                  alt={item.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform [transition-duration:var(--d-experiment-cover)] ease-out group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-t from-bg/95 via-bg/25 to-transparent md:block" />
                <span aria-hidden="true" className="absolute left-5 top-4 font-mono text-sm tracking-[0.16em] text-muted">{item.index}</span>
                <span aria-hidden="true" className="absolute right-5 top-4 grid h-9 w-9 place-items-center rounded-full border border-paper/30 bg-bg/25 text-sm text-text-primary backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              </div>
              <div className="relative border-t border-paper/10 bg-[rgb(var(--surface-card-rgb))] p-5 md:absolute md:inset-x-0 md:bottom-0 md:border-0 md:bg-transparent md:p-8">
                <h3 className="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold tracking-[-0.03em] text-text-primary">{item.title}</h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-7 text-muted md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={images[active].title}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgb(var(--gallery-overlay-rgb)/0.95)] p-5 backdrop-blur-xl md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between text-text-primary">
                <p>{images[active].title} <span className="ml-2 text-muted">{active + 1} / {images.length}</span></p>
                <button type="button" onClick={() => setActive(null)} autoFocus aria-label="关闭画廊" className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 text-2xl hover:border-accent">×</button>
              </div>
              <img src={asset(images[active].image)} alt={images[active].title} className="max-h-[72dvh] w-full rounded-card object-contain" />
              <div className="mt-5 flex justify-between">
                <ActionButton size="regular" pill onClick={() => setActive((active - 1 + images.length) % images.length)}>上一张</ActionButton>
                <ActionButton size="regular" pill onClick={() => setActive((active + 1) % images.length)}>下一张</ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

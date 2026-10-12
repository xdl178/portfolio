import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   Explorations · 滚动驱动视差画廊
   - min-h-[300vh] 容器制造滚动空间
   - 中心文案层被 ScrollTrigger pin（pinSpacing: false）
   - 左右两列图片以不同幅度做视差位移 + 旋转
   - 点击卡片打开 Lightbox
   ============================================================ */

type Item = { title: string; image: string; rotate: number }

const COLUMN_LEFT: Item[] = [
  { title: '［影像标题 01］', image: 'work-01.png', rotate: -4 },
  { title: '［影像标题 02］', image: 'study-01.png', rotate: 3 },
  { title: '［影像标题 03］', image: 'work-03.png', rotate: -2 },
]

const COLUMN_RIGHT: Item[] = [
  { title: '［影像标题 04］', image: 'work-02.png', rotate: 4 },
  { title: '［影像标题 05］', image: 'work-04.png', rotate: -3 },
  { title: '［影像标题 06］', image: 'hero-tunnel.png', rotate: 2 },
]

export default function Explorations() {
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<Item | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      /* 中心层固定，pinSpacing: false 让两列继续在其上方滚动 */
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
      })

      /* 左列向下漂移，右列向上漂移 → 形成反向视差 */
      gsap.fromTo(
        leftRef.current,
        { y: 120 },
        {
          y: -180,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        rightRef.current,
        { y: -80 },
        {
          y: 220,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )

      /* 渐入 */
      gsap.from(contentRef.current, {
        opacity: 0,
        filter: 'blur(12px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  /* Lightbox：锁定滚动 + Esc 关闭 */
  useEffect(() => {
    if (!lightbox) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  const renderCard = (item: Item, i: number) => (
    <button
      key={item.title}
      type="button"
      onClick={() => setLightbox(item)}
      style={{ transform: `rotate(${item.rotate}deg)` }}
      className="glass glass-hover group block w-full max-w-[320px] overflow-hidden rounded-card text-left transition-transform duration-500 ease-out hover:!rotate-0 hover:scale-[1.03]"
      aria-label={`查看 ${item.title}`}
    >
      <span className="media-crop relative block aspect-square">
        <img
          src={`${import.meta.env.BASE_URL}images/${item.image}`}
          alt=""
          loading="lazy"
          decoding="async"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </span>
      <span className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm text-text-primary">{item.title}</span>
        <span className="type-num text-[11px] text-muted">0{i + 1}</span>
      </span>
    </button>
  )

  return (
    <section ref={rootRef} className="relative min-h-[300vh] bg-bg" id="gallery">
      {/* 第 1 层：钉住的中心文案（z-10） */}
      <div
        ref={contentRef}
        className="pointer-events-none relative z-10 flex h-[100svh] flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="type-h2 text-text-primary">
          影像<span className="text-gradient">实验室</span>
        </h2>
        <p className="type-body mt-6 max-w-md">［副标］实验性的视觉、材质与动效研究。</p>
      </div>

      {/* 第 2 层：视差双列（z-20） */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-2 gap-6 px-6 py-[20vh] md:gap-40 md:px-10">
          <div
            ref={leftRef}
            className="pointer-events-auto flex flex-col items-start gap-16 md:gap-40"
          >
            {COLUMN_LEFT.map(renderCard)}
          </div>
          <div
            ref={rightRef}
            className="pointer-events-auto mt-[30vh] flex flex-col items-end gap-16 md:gap-40"
          >
            {COLUMN_RIGHT.map(renderCard)}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
          >
            <motion.div
              className="glass-lg relative w-full max-w-4xl rounded-panel p-3"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/${lightbox.image}`}
                alt=""
                className="max-h-[72vh] w-full rounded-field object-cover"
              />
              <p className="px-2 pb-1 pt-4 text-center text-base text-text-primary">
                {lightbox.title}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="关闭"
                className="glass absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full text-lg leading-none text-text-primary transition-transform duration-300 hover:scale-110"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

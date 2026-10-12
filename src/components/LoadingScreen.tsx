import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ============================================================
   LoadingScreen · 全屏加载屏
   - rAF 驱动计数器 000 → 100（按真实时间推进，不受掉帧影响）
   - 中心轮播词 AnimatePresence mode="wait"
   - 进度条 scaleX 绑定 count/100
   - 到达 100 后延迟回调 onComplete
   ============================================================ */

const WORDS = ['构思', '设计', '交付']
const DURATION = 2400
const WORD_INTERVAL = 800

type Props = { onComplete: () => void }

export default function LoadingScreen({ onComplete }: Props) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setCount(100)
      const t = window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true
          onComplete()
        }
      }, 300)
      return () => window.clearTimeout(t)
    }

    let rafId = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / DURATION)
      setCount(Math.round(progress * 100))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else if (!completedRef.current) {
        completedRef.current = true
        window.setTimeout(onComplete, 350)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [onComplete])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, WORD_INTERVAL)
    return () => window.clearInterval(id)
  }, [])

  const display = String(count).padStart(3, '0')

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label={`加载中 ${count}%`}
    >
      {/* 装饰层 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-grid mask-radial animate-grid-pan absolute inset-0 opacity-30" />
        <span
          className="glow glow-cyan"
          style={{
            width: '40rem',
            height: '40rem',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.5,
          }}
        />
      </div>

      {/* 左上：品牌标签 */}
      <motion.span
        className="type-label absolute left-6 top-6 md:left-10 md:top-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        ［工作室名称］ / PORTFOLIO
      </motion.span>

      {/* 中心：轮播词 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative flex h-[1.4em] items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.span
              key={WORDS[wordIndex]}
              className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-none tracking-[0.12em] text-text-primary/90"
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* 右下：计数器 */}
      <motion.div
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <span className="type-num text-6xl font-semibold leading-none text-text-primary md:text-8xl lg:text-9xl">
          {display}
        </span>
      </motion.div>

      {/* 底部：进度条 */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-[2px] w-full overflow-hidden bg-white/10">
          <div
            className="grad-accent h-full w-full origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 12px rgba(46, 217, 245, 0.5)',
              transition: 'transform 80ms linear',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

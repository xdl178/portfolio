import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ============================================================
   LoadingScreen · 全屏加载屏（真实进度）
   - progress 由 App 的真实预加载驱动（fetch + ReadableStream 读字节）
   - 计数器做「追赶」缓动，避免字节跳动导致数字乱跳
   - ready = 首屏大图已解码完成，稍作停留后回调 onComplete
   ============================================================ */

const WORDS = ['构思', '设计', '交付']

type Props = {
  /** 真实加载进度 0..1 */
  progress: number
  /** 首屏关键资源是否已就绪 */
  ready: boolean
  onComplete: () => void
}

export default function LoadingScreen({ progress, ready, onComplete }: Props) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const countRef = useRef(0)
  const firedRef = useRef(false)

  /* 数字追赶真实进度（只增不减，到点即停，不空转） */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      countRef.current = Math.round(progress * 100)
      setCount(countRef.current)
      return
    }
    let rafId = 0
    const tick = () => {
      const target = Math.round(progress * 100)
      if (countRef.current < target) {
        const step = Math.max(1, Math.ceil((target - countRef.current) * 0.15))
        countRef.current = Math.min(target, countRef.current + step)
        setCount(countRef.current)
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progress])

  /* 就绪后停留一拍再退出，避免"闪一下" */
  useEffect(() => {
    if (!ready || firedRef.current) return
    const t = window.setTimeout(() => {
      if (firedRef.current) return
      firedRef.current = true
      onComplete()
    }, 420)
    return () => window.clearTimeout(t)
  }, [ready, onComplete])

  /* 轮播词：加载中才转，就绪即停 */
  useEffect(() => {
    if (ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 800)
    return () => window.clearInterval(id)
  }, [ready])

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

      {/* 左下：加载对象说明 */}
      <motion.span
        className="type-label absolute bottom-8 left-6 hidden text-[10px] md:left-10 md:bottom-10 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        {ready ? 'READY' : 'PRELOADING / HERO IMAGE'}
      </motion.span>

      {/* 底部：进度条 */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-[2px] w-full overflow-hidden bg-white/10">
          <div
            className="grad-accent h-full w-full origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 12px rgba(46, 217, 245, 0.5)',
              transition: 'transform 120ms linear',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

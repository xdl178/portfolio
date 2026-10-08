import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CountUp from './ui/CountUp.jsx'
import { profile } from '../data/content.js'

/**
 * 首屏加载动画：百分比计数 + 进度条 + 阶段文案。
 * 加载期间锁定页面滚动，结束后淡出并解锁。
 */
export default function Preloader({ children }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  const handleComplete = useCallback(() => {
    setTimeout(() => setLoading(false), 520)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) return undefined

    const duration = 2400
    const startTime = performance.now()
    let rafId

    const tick = (now) => {
      const elapsed = now - startTime
      const raw = Math.min(100, (elapsed / duration) * 100)
      const eased = 1 - Math.pow(1 - raw / 100, 3)
      setProgress(eased)
      if (raw < 100) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    const forceComplete = setTimeout(() => setProgress(100), duration + 120)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(forceComplete)
    }
  }, [loading])

  useEffect(() => {
    if (progress >= 100 && loading) handleComplete()
  }, [progress, loading, handleComplete])

  /* 硬兜底：即使分数计数因任何原因没走完（后台标签页、rAF 被节流等），
     也必须在 4 秒内放行，绝不能让访问者卡在加载页。 */
  useEffect(() => {
    const failsafe = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  const stage =
    progress < 30
      ? 'Fetching Assets…'
      : progress < 60
        ? 'Compiling Modules…'
        : progress < 90
          ? 'Rendering Layout…'
          : 'Finalizing…'

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* 冷光背景 + 细网格 */}
            <div className="pointer-events-none absolute inset-0 bg-glow-cool" />
            <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-70" />

            {/* 角标 */}
            <div className="absolute left-6 top-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-faint">
                Loading Portfolio
              </span>
            </div>
            <div className="absolute right-6 top-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-faint">
                {profile.name} · {new Date().getFullYear()}
              </span>
            </div>

            {/* 顶部流光线 */}
            <div className="brut-torn-top absolute inset-x-0 top-0 h-[2px]" />

            <div className="relative z-10 flex flex-col items-center px-6">
              <div className="flex items-baseline">
                <CountUp
                  from={0}
                  to={100}
                  duration={2.4}
                  delay={0.1}
                  className="font-display text-[clamp(52px,9vw,120px)] font-black leading-none tracking-brut-tight text-ink tnum"
                  startWhen={mounted}
                  onEnd={handleComplete}
                />
                <span className="ml-2 font-display text-[clamp(52px,9vw,120px)] font-black leading-none text-brand">
                  %
                </span>
              </div>

              {/* 进度条 */}
              <div className="mt-8 w-[min(78vw,420px)]">
                <div className="relative h-[3px] overflow-hidden rounded-pill bg-mist">
                  <div
                    className="absolute inset-y-0 left-0 rounded-pill bg-brand-gradient"
                    style={{ width: `${progress}%`, transition: 'width 0.08s linear' }}
                  />
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-faint">
                    {stage}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-faint tnum">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* 品牌色点 */}
              <div className="mt-8 flex items-center gap-3">
                {['#2440CC', '#4D6BFE', '#00C2FF', '#7C4DFF'].map((color, i) => (
                  <motion.span
                    key={color}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: color }}
                    animate={{
                      scale: progress > (i + 1) * 20 ? [1, 1.45, 1] : [0.8, 1, 0.8],
                      opacity: progress > (i + 1) * 20 ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror', delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>

            <div className="brut-torn-bottom absolute inset-x-0 bottom-0 h-[2px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}

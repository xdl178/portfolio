import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LOADING_MIN_DURATION_MS } from '../config/loading'
import './LoadingScreen.css'

type Props = {
  /** App's real byte progress, 0..1; visual effects never invent resource progress. */
  progress: number
  ready: boolean
  onComplete: () => void
}

const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: (i * 149 + 53) % 1440,
  y: (i * 227 + 97) % 900,
  r: i % 11 === 0 ? 1 : .45,
  opacity: .16 + (i % 5) * .09,
}))
const BOKEH = Array.from({ length: 48 }, (_, i) => ({
  x: (i * 343 + 91) % 1440,
  y: (i * 197 + 41) % 900,
  r: i % 9 === 0 ? 13 : 3 + (i % 5) * 1.5,
  start: .03 + (i % 8) * .09,
  opacity: .24 + (i % 4) * .14,
}))

export default function LoadingScreen({ progress, ready, onComplete }: Props) {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const countRef = useRef(0)
  const firedRef = useRef(false)
  const target = Math.min(ready ? 100 : 99, Math.max(0, Math.round(progress * 100)))
  const canEnter = ready && count === 100 && introDone

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), reduceMotion ? 0 : LOADING_MIN_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) {
      countRef.current = Math.max(countRef.current, target)
      setCount(countRef.current)
      return
    }
    let frame = 0
    const tick = () => {
      const delta = target - countRef.current
      if (delta <= 0) return
      countRef.current = Math.min(target, countRef.current + Math.max(1, Math.ceil(delta * .065)))
      setCount(countRef.current)
      if (countRef.current < target) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [target, reduceMotion])

  const complete = useCallback(() => {
    if (!canEnter || firedRef.current) return
    firedRef.current = true
    onComplete()
  }, [canEnter, onComplete])

  useEffect(() => {
    if (!canEnter) return
    const timer = window.setTimeout(complete, reduceMotion ? 0 : 300)
    return () => window.clearTimeout(timer)
  }, [canEnter, complete, reduceMotion])

  const stage = canEnter ? '一切就绪' : ready ? '即将就绪' : count < 30 ? '唤醒灵感' : count < 75 ? '准备视觉' : '整理细节'

  return (
    <motion.div
      data-loading-screen
      data-state={canEnter ? 'ready' : 'loading'}
      className="loading-screen"
      style={{ '--loading-progress': count / 100 } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? .15 : .65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="loading-scene" aria-hidden="true">
        <svg className="loading-stars" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {STARS.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.r} opacity={star.opacity} />)}
        </svg>
        <svg data-loader-bokeh className="loading-bokeh" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="loading-star-glow">
              <stop offset="0" stopColor="rgb(var(--accent-soft-rgb))" stopOpacity=".95" />
              <stop offset=".22" stopColor="rgb(var(--accent-strong-rgb))" stopOpacity=".6" />
              <stop offset=".55" stopColor="var(--brand)" stopOpacity=".16" />
              <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {BOKEH.map((spot, i) => <ellipse key={i} cx={spot.x} cy={spot.y} rx={spot.r} ry={spot.r} fill="url(#loading-star-glow)" style={{ opacity: Math.min(1, Math.max(0, (count / 100 - spot.start) / .3)) * spot.opacity }} />)}
        </svg>
        <div className="loading-halo" />
        <div className="loading-ripples">
          <span data-loader-ring /><span data-loader-ring /><span data-loader-ring />
        </div>
        <span className="loading-spark" />
      </div>
      <header className="loading-identity">
        <h2 id="loading-title">设计未来</h2>
        <p>VISUAL &amp; INTERACTION</p>
      </header>
      <p className="loading-caption">每一次探索，从一个灵感开始。</p>
      <div className="loading-meter">
        <div className="loading-track" role="progressbar" aria-label="首屏资源加载进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={count}>
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <div className="loading-readout">
          <span role="status" aria-live="polite">{stage}</span>
          <span className="loading-percent" aria-hidden="true">{String(count).padStart(2, '0')}<span>%</span></span>
        </div>
      </div>
    </motion.div>
  )
}

import { useEffect, useState } from 'react'

/** 顶部滚动进度条：读取 Lenis 实例（window.__lenis）或原生滚动位置 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId = 0

    const measure = () => {
      const lenis = window.__lenis
      if (lenis && typeof lenis.scroll === 'number' && lenis.limit > 0) {
        setProgress(Math.min(1, Math.max(0, lenis.scroll / lenis.limit)))
      } else {
        const h = document.documentElement
        const total = h.scrollHeight - h.clientHeight
        setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
      }
      rafId = 0
    }

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(measure)
    }

    const lenis = window.__lenis
    if (lenis && typeof lenis.on === 'function') lenis.on('scroll', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measure()

    return () => {
      if (lenis && typeof lenis.off === 'function') lenis.off('scroll', schedule)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const isEnd = progress >= 0.995

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className={`scroll-progress__bar${isEnd ? ' is-end' : ''}`}
        style={{ width: `${(progress * 100).toFixed(3)}%` }}
      />
    </div>
  )
}

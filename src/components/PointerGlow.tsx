import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import './PointerGlow.css'

/** 鼠标靠近边缘才出现冷蓝描边；鼠标轨迹写 CSS 变量，不触发 React 重渲染。 */
export function usePointerGlow() {
  const root = useRef<HTMLElement | null>(null)
  const ref = (element: HTMLElement | null) => { root.current = element }
  const frame = useRef<number>(0)
  const pending = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => () => {
    if (frame.current) window.cancelAnimationFrame(frame.current)
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    pending.current = { x: event.clientX, y: event.clientY }
    if (frame.current) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0
      const element = root.current
      const point = pending.current
      if (!element || !point) return
      const rect = element.getBoundingClientRect()
      const x = point.x - rect.left
      const y = point.y - rect.top
      const halfWidth = rect.width / 2
      const halfHeight = rect.height / 2
      const edge = Math.min(1, Math.max(Math.abs(x - halfWidth) / halfWidth, Math.abs(y - halfHeight) / halfHeight))
      const angle = (Math.atan2(y - halfHeight, x - halfWidth) * 180 / Math.PI + 90 + 360) % 360
      element.style.setProperty('--edge-proximity', (edge * 100).toFixed(2))
      element.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`)
      element.style.setProperty('--pointer-x', `${x.toFixed(1)}px`)
      element.style.setProperty('--pointer-y', `${y.toFixed(1)}px`)
      element.setAttribute('data-glow-active', 'true')
    })
  }

  const onPointerLeave = () => {
    if (frame.current) window.cancelAnimationFrame(frame.current)
    frame.current = 0
    pending.current = null
    root.current?.setAttribute('data-glow-active', 'false')
    root.current?.style.setProperty('--edge-proximity', '0')
  }

  return { ref, onPointerMove, onPointerLeave }
}

export default function PointerGlow({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, onPointerMove, onPointerLeave } = usePointerGlow()
  return (
    <div ref={ref} data-pointer-glow data-glow-active="false" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className={`pointer-glow ${className}`} style={{ '--edge-proximity': '0', '--cursor-angle': '0deg' } as CSSProperties}>
      <div className="pointer-glow__content">{children}</div>
    </div>
  )
}

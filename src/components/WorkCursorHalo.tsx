import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './WorkCursorHalo.css'

/** App 挂载的全站单实例；portal 保持视口坐标，不替换原生光标或拦截点击。 */
export default function WorkCursorHalo() {
  const [enabled, setEnabled] = useState(false)
  const halo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const element = halo.current
    if (!element) return
    let frame = 0
    let x = -400, y = -400, targetX = -400, targetY = -400
    let visible = false
    const tick = () => {
      x += (targetX - x) * .16
      y += (targetY - y) * .16
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      if (visible && (Math.abs(targetX - x) > .3 || Math.abs(targetY - y) > .3)) frame = window.requestAnimationFrame(tick)
      else frame = 0
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      targetX = event.clientX
      targetY = event.clientY
      const target = event.target instanceof Element ? event.target : null
      const interactive = target?.closest('a, button, article, [data-pointer-glow]')
      element.dataset.hovering = interactive ? 'true' : 'false'
      element.dataset.hoverLevel = target?.closest('article, [data-work-tilt]') ? 'card' : interactive ? 'control' : 'none'
      if (!visible) { visible = true; element.dataset.visible = 'true' }
      if (!frame) frame = window.requestAnimationFrame(tick)
    }
    const onLeave = () => { visible = false; element.dataset.visible = 'false'; if (frame) window.cancelAnimationFrame(frame); frame = 0 }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return createPortal(<div ref={halo} data-work-halo data-visible="false" data-hovering="false" aria-hidden="true" className="work-cursor-halo"><span /></div>, document.body)
}

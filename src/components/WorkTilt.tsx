import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

/** Related-card feedback only. The outer reveal and inner image keep separate transforms. */
export default function WorkTilt({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 220, damping: 20, mass: .5 })
  const rotateY = useSpring(y, { stiffness: 220, damping: 20, mass: .5 })
  const transform = useMotionTemplate`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => { setEnabled(query.matches); x.set(0); y.set(0) }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [x, y])

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(-((event.clientY - rect.top) / rect.height - .5) * 14)
    y.set(((event.clientX - rect.left) / rect.width - .5) * 14)
  }
  return <motion.div data-work-tilt onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }} whileTap={enabled ? { scale: .98 } : undefined} style={{ transform: enabled ? transform : 'none', height: '100%' }}>{children}</motion.div>
}

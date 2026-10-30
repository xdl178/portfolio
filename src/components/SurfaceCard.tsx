import type { CSSProperties, HTMLAttributes } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMotionTokens } from '../hooks/useMotionTokens'
import { usePointerGlow } from './PointerGlow'
import './SurfaceCard.css'

export type SurfaceCardProps = Omit<HTMLAttributes<HTMLElement>, keyof MotionProps> & Omit<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> & {
  /** Native container: use li directly inside a ul, div for statistics/metadata. */
  as?: 'div' | 'li'
  /** Zero-based entrance stagger; durations/easing remain live root CSS tokens. */
  index?: number
  /** Disable the entrance inside an already-animated parent; color hover remains. */
  reveal?: boolean
  /** Opt into the original pointer-following border on this native root. */
  glow?: boolean
}

/** Shared material and entrance. className owns placement/layout, never a wrapper. */
export default function SurfaceCard({ as = 'div', index = 0, reveal = true, glow = false, className = '', style, children, onPointerMove, onPointerLeave, ...props }: SurfaceCardProps) {
  const pointer = usePointerGlow()
  const pointerProps = glow ? {
    ref: pointer.ref,
    'data-pointer-glow': true,
    'data-glow-active': 'false',
    onPointerMove: (event: Parameters<NonNullable<typeof onPointerMove>>[0]) => {
      pointer.onPointerMove(event)
      onPointerMove?.(event)
    },
    onPointerLeave: (event: Parameters<NonNullable<typeof onPointerLeave>>[0]) => {
      pointer.onPointerLeave()
      onPointerLeave?.(event)
    },
  } : { onPointerMove, onPointerLeave }
  const reduce = useReducedMotion()
  const tokens = useMotionTokens()
  const Card = as === 'li' ? motion.li : motion.div
  const entrance = reveal && !reduce
  const hidden = { opacity: 0, transform: 'translateY(32px)' }
  return (
    <Card
      {...props}
      {...pointerProps}
      data-surface-card
      data-surface-reveal={reveal ? 'true' : 'false'}
      className={`surface-card${glow ? ' pointer-glow' : ''}${className ? ` ${className}` : ''}`}
      // Explicit base pose is required: the route AnimatePresence uses initial=false.
      style={{ ...(glow ? { '--edge-proximity': '0', '--cursor-angle': '0deg' } as CSSProperties : {}), ...style, ...(entrance ? hidden : { opacity: 1, transform: 'none' }) }}
      initial={entrance ? hidden : false}
      whileInView={entrance ? { opacity: 1, transform: 'none' } : undefined}
      viewport={{ once: true, amount: .15, margin: '0px 0px -8% 0px' }}
      transition={entrance ? { ...tokens.toolReveal, delay: index * tokens.toolStagger } : { duration: 0, delay: 0 }}
    >
      {children}
    </Card>
  )
}

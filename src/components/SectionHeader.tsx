import { useReducedMotion } from '../hooks/useReducedMotion'
import { readMotionTokens, useMotionTokens } from '../hooks/useMotionTokens'
import type { ReactNode } from 'react'
import SectionHeading from './SectionHeading'

/** Compatibility adapter: existing callers share the canonical heading and root reveal. */
type Props = {
  index?: string
  label?: string
  eyebrow?: string
  en?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  level?: 'h1' | 'h2'
  id?: string
  titleId?: string
  className?: string
}

export const HEADER_VIEWPORT = { once: true, margin: '-100px' } as const
export const getHeaderTransition = () => readMotionTokens().section

export default function SectionHeader({ index = '', label, eyebrow, en, title, subtitle, action, level = 'h2', id, titleId, className }: Props) {
  const reduce = useReducedMotion()
  const tokens = useMotionTokens()
  return <SectionHeading
    index={index}
    en={en ?? (label ?? eyebrow ?? '').split(' · ')[0]}
    title={title}
    subtitle={subtitle}
    action={action}
    level={level}
    id={id}
    titleId={titleId}
    className={className}
    motionProps={{ initial: reduce ? false : { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: HEADER_VIEWPORT, transition: reduce ? { duration: 0 } : tokens.section }}
  />
}

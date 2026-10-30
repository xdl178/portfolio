import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import './SectionHeading.css'

type Props = {
  index: string
  en: string
  title: ReactNode
  level: 'h1' | 'h2'
  id?: string
  titleId?: string
  className?: string
  subtitle?: ReactNode
  action?: ReactNode
  motionProps?: HTMLMotionProps<'header'>
}

/** One editorial chapter heading, shared by page mastheads and section titles. */
export default function SectionHeading({ index, en, title, level: Title, id, titleId, className = '', subtitle, action, motionProps }: Props) {
  const contents = <>
    <span className="section-heading-index selected-works-chapter" aria-hidden="true">{index}</span>
    <div className="section-heading-copy selected-works-heading-copy">
      <span className="section-heading-en selected-works-exhibit" aria-hidden="true">{en}</span>
      <div className="section-heading-row selected-works-heading-row">
        <span className="section-heading-slash selected-works-slash" aria-hidden="true">/</span>
        <Title id={titleId ?? id} className="section-heading-title">{title}</Title>
      </div>
    </div>
    {action && <div className="section-heading-action">{action}</div>}
    {subtitle && <p className="section-heading-subtitle">{subtitle}</p>}
  </>
  const root = { className: `section-heading selected-works-heading ${className}`.trim(), 'data-section-heading': 'true', 'aria-labelledby': titleId ?? id }
  return motionProps ? <motion.header {...motionProps} {...root}>{contents}</motion.header> : <header {...root}>{contents}</header>
}

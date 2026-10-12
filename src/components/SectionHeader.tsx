import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/* ============================================================
   SectionHeader · 统一章节头
   纵向堆叠：可选 eyebrow（英文 mono 小标）+ 中文标题 + 副标
   - 全站 eyebrow 最多 2 处（design.md §7.6）
   - 禁止「左标题 + 右小段落」分栏式章节头
   ============================================================ */

type Props = {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
}

export const HEADER_VIEWPORT = { once: true, margin: '-100px' } as const
export const HEADER_TRANSITION = { duration: 0.9, ease: [0.22, 1, 0.36, 1] } as const

export default function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={HEADER_VIEWPORT}
      transition={HEADER_TRANSITION}
      className="flex max-w-3xl flex-col items-start gap-4"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-white/20" aria-hidden="true" />
          <span className="type-label">{eyebrow}</span>
        </span>
      )}
      <h2 className="type-h2 text-text-primary">{title}</h2>
      {subtitle && <p className="type-body max-w-[62ch]">{subtitle}</p>}
    </motion.div>
  )
}

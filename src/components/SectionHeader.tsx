import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { readMotionTokens, useMotionTokens } from '../hooks/useMotionTokens'
import type { ReactNode } from 'react'

/* ============================================================
   SectionHeader · 编辑式章节头（对齐 portfolio-test 的版式）
   结构：序号 — 分隔线 — 中英标签 ／ 巨型标题 ／ 副标 ／ 右侧动作
   - 序号用等宽字体、低透明度，只做版式锚点，不抢标题
   - 标题允许两行，行距收紧；副标限宽 62ch
   ============================================================ */

type Props = {
  index?: string
  label?: string
  /* 兼容旧调用（Clients 等未挂载组件）：等价于 label，不带序号 */
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}

export const HEADER_VIEWPORT = { once: true, margin: '-100px' } as const
export const getHeaderTransition = () => readMotionTokens().section

export default function SectionHeader({ index, label, eyebrow, title, subtitle, action }: Props) {
  const labelText = label ?? eyebrow
  const reduce = useReducedMotion()
  const tokens = useMotionTokens()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={HEADER_VIEWPORT}
      transition={reduce ? { duration: 0 } : tokens.section}
      className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-14"
    >
      <div className="min-w-0 md:flex-1">
        {(index || labelText) && (
          <div className="flex items-center gap-4 md:gap-5">
            {index && (
              <span aria-hidden="true" className="font-mono text-[clamp(2.4rem,4.4vw,3.6rem)] font-semibold leading-none tracking-[-0.04em] text-muted">
                {index}
              </span>
            )}
            <span aria-hidden="true" className="h-px w-10 bg-paper/25 md:w-16" />
            {labelText && <span className="type-label text-[11px] text-muted">{labelText}</span>}
          </div>
        )}
        <h2 className="mt-7 max-w-[26ch] text-[clamp(2.2rem,4.6vw,4.6rem)] font-semibold leading-[1.08] tracking-[-0.06em] text-text-primary text-balance">{title}</h2>
        {subtitle && <p className="mt-6 max-w-[32rem] text-base leading-8 text-muted text-pretty">{subtitle}</p>}
      </div>
      {action && <div className="flex-none md:pb-2">{action}</div>}
    </motion.div>
  )
}

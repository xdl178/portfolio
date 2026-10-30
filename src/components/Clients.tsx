import { motion } from 'framer-motion'
import SectionHeader, { getHeaderTransition, HEADER_VIEWPORT } from './SectionHeader'

/* ============================================================
   Clients · 合作客户
   - 客户标记墙：每个客户一枚 monogram 几何标记（无分类标签）
   - 客户名称为占位符，仅通过 sr-only 提供给读屏器
   ============================================================ */

const CLIENTS = 'ABCDEFGHIJKL'.split('').map((letter) => ({
  letter,
  name: `［客户 ${letter}］`,
}))

export default function Clients() {
  return (
    <section id="clients" className="relative bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Clients"
          title={
            <>
              合作<span className="text-gradient">客户</span>
            </>
          }
          subtitle="与不同规模的品牌与产品团队长期协作。"
        />

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 lg:grid-cols-6">
          {CLIENTS.map((client, i) => (
            <motion.li
              key={client.letter}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={HEADER_VIEWPORT}
              transition={{ ...getHeaderTransition(), delay: (i % 6) * 0.05 }}
              className="glass-sm glass-hover group grid h-24 place-items-center rounded-card"
            >
              <span className="sr-only">{client.name}</span>
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center border border-current text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
                style={{ borderRadius: i % 2 === 0 ? '9999px' : '12px' }}
              >
                <span className="font-mono text-sm tracking-wider">{client.letter}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import AboutCapabilities from '../components/AboutCapabilities'
import { HEADER_TRANSITION } from '../components/SectionHeader'

/* ============================================================
   AboutPage · 关于 /about（参考 portfolio-test About 布局）
   刊头（巨字 ABOUT）→ 工作室简介 + 能力网格 → 经历时间线
   联系入口由全局页脚承担
   ============================================================ */

const TIMELINE = [
  {
    no: '01',
    org: '［公司 / 团队名称 01］',
    orgEn: 'PLACEHOLDER STUDIO 01',
    role: '［角色 · 头衔］',
    period: '2026.03 - 至今',
    points: [
      '［工作内容：负责的主要业务与产出。］',
      '［工作内容：负责的主要业务与产出。］',
    ],
  },
  {
    no: '02',
    org: '［公司 / 团队名称 02］',
    orgEn: 'PLACEHOLDER STUDIO 02',
    role: '［角色 · 头衔］',
    period: '2025.08 - 2026.02',
    points: [
      '［工作内容：负责的主要业务与产出。］',
      '［工作内容：负责的主要业务与产出。］',
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="relative bg-bg pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        {/* ============ 刊头 ============ */}
        <header className="border-b border-white/10 pb-12 md:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={HEADER_TRANSITION}
            className="type-label mb-6"
          >
            ABOUT · 关于我们
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...HEADER_TRANSITION, delay: 0.1 }}
            className="type-display text-text-primary"
          >
            关于<span className="text-gradient">工作室</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...HEADER_TRANSITION, delay: 0.18 }}
            className="type-body mt-8 max-w-[56ch]"
          >
            ［工作室简介：我们是谁、相信什么、如何工作。］秩序、材质与光的克制使用，
            让复杂系统变得直觉可读。
          </motion.p>
        </header>
      </div>

      {/* ============ 简介 + 能力（复用组件） ============ */}
      <AboutCapabilities />

      {/* ============ 经历时间线 ============ */}
      <section className="relative py-24 md:py-32" aria-labelledby="timeline-h">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={HEADER_TRANSITION}
            className="mb-12 md:mb-16"
          >
            <h2 id="timeline-h" className="type-h2 text-text-primary">
              经历<span className="text-gradient">时间线</span>
            </h2>
            <p className="type-body mt-4 max-w-[52ch]">团队与合作经历的简要脉络。</p>
          </motion.div>

          <ol className="relative flex flex-col gap-6 md:gap-8">
            {TIMELINE.map((item, i) => (
              <motion.li
                key={item.no}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...HEADER_TRANSITION, delay: i * 0.08 }}
                className="glass glass-hover rounded-card p-6 md:p-10"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="type-num mb-3 text-sm text-accent">N°{item.no}</p>
                    <h3 className="type-h3 text-text-primary">{item.org}</h3>
                    <p className="type-label mt-1.5">{item.orgEn}</p>
                  </div>
                  <div className="text-right">
                    <p className="chip mb-3">{item.role}</p>
                    <p className="type-num text-sm text-muted">{item.period}</p>
                  </div>
                </div>

                <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 md:grid-cols-2">
                  {item.points.map((p, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="type-num flex-none text-xs text-accent/70">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="type-body text-sm">{p}</p>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

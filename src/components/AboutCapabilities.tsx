import { motion } from 'framer-motion'
import { HEADER_TRANSITION, HEADER_VIEWPORT } from './SectionHeader'

/* ============================================================
   AboutCapabilities · 关于 / 能力
   - 非对称两栏：左「关于」叙述，右「能力」玻璃卡网格
   - 能力名称与说明均为占位符（design.md §3）
   ============================================================ */

type Capability = { name: string; code: string; desc: string }

const CAPABILITIES: Capability[] = [
  { name: '［能力名称 01］', code: 'CAPABILITY 01', desc: '［一句话说明］' },
  { name: '［能力名称 02］', code: 'CAPABILITY 02', desc: '［一句话说明］' },
  { name: '［能力名称 03］', code: 'CAPABILITY 03', desc: '［一句话说明］' },
  { name: '［能力名称 04］', code: 'CAPABILITY 04', desc: '［一句话说明］' },
  { name: '［能力名称 05］', code: 'CAPABILITY 05', desc: '［一句话说明］' },
  { name: '［能力名称 06］', code: 'CAPABILITY 06', desc: '［一句话说明］' },
]

export default function AboutCapabilities() {
  return (
    <section id="capabilities" className="relative bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* 左：关于 */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={HEADER_VIEWPORT}
            transition={HEADER_TRANSITION}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="type-h2 mb-6 text-text-primary">
              创作<span className="text-gradient">理念</span>
            </h2>
            <p className="type-body mb-5 max-w-[52ch]">
              ［创作理念］我们是一家专注数字体验的独立工作室，服务［服务对象］的品牌与产品团队。
            </p>
            <p className="type-body max-w-[52ch]">
              相信秩序、材质与光的克制使用，能让复杂系统变得直觉可读。
            </p>
          </motion.div>

          {/* 右：能力 */}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={HEADER_VIEWPORT}
                transition={{ ...HEADER_TRANSITION, delay: i * 0.06 }}
                className="glass glass-hover group relative overflow-hidden rounded-card p-6"
              >
                <span className="type-num block text-xs text-accent/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="type-h3 mt-5 text-text-primary">{item.name}</h3>
                <p className="type-label mt-1.5">{item.code}</p>
                <p className="type-body mt-4 text-sm">{item.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

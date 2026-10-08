import Reveal, { RevealGroup, RevealItem } from '../ui/Reveal.jsx'

/* 能力清单：图标用极简内联 SVG，避免引入图标库 */
const services = [
  {
    title: '产品设计',
    desc: '从需求梳理到交互稿与视觉规范，输出可直接进入开发的完整方案。',
    icon: (
      <path d="M4 20V9.5L12 4l8 5.5V20M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: '前端实现',
    desc: 'React + Vite 工程化落地，组件化拆分，动效与性能一并考虑。',
    icon: (
      <path d="M9 7 4 12l5 5M15 7l5 5-5 5M13 4l-2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: '交付与上线',
    desc: 'CI/CD 自动构建部署，配上监控与文档，交接之后也能自己维护。',
    icon: (
      <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="section-y bg-wash">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Capabilities</p>
          <h2 className="mt-4 max-w-prose-narrow font-display text-section text-ink">
            我能提供的三类协作方式
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-7 md:grid-cols-3">
          {services.map((s, i) => (
            <RevealItem key={s.title} className="card card-hover group p-8">
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {s.icon}
                  </svg>
                </span>
                <span className="absolute right-0 top-0 font-mono text-[28px] font-bold leading-none text-line tnum">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-card-title text-ink">{s.title}</h3>
              <p className="mt-3 text-body-sm text-slate-soft">{s.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

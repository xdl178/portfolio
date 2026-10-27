import SectionHeader from './SectionHeader'

const capabilities = [
  { title: '品牌与视觉系统', text: '从品牌基调、角色形象到可复用的视觉规范，让每一次表达保持清晰。', en: 'Brand System' },
  { title: '数字产品体验', text: '梳理信息架构、交互流程与关键反馈，为复杂场景建立好用的界面。', en: 'Product UX' },
  { title: '网页与响应式设计', text: '让品牌叙事与产品信息在不同屏幕上保持同一节奏。', en: 'Web & Responsive' },
  { title: '动态影像与 AI 工作流', text: '把动态反馈、三维表达与辅助创作工具纳入完整的设计流程。', en: 'Motion & AI' },
]

export default function AboutCapabilities() {
  return (
    <section id="capabilities" className="bg-bg py-28 md:py-40">
      <div className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <SectionHeader
          index="02"
          label="能力 · CAPABILITIES"
          title={<>设计，不只负责<span className="text-gradient whitespace-nowrap">好看。</span></>}
          subtitle={<>四条能力线互相咬合：<br className="md:hidden" />从视觉定调，到动态与 AI 提效。</>}
        />
        <div className="mt-14 grid grid-flow-dense gap-px overflow-hidden rounded-card border border-paper/10 bg-paper/10 md:mt-20 md:grid-cols-2">
          {capabilities.map((item, i) => (
            <article key={item.title} className="group min-h-[240px] bg-[rgb(var(--surface-card-rgb))] p-8 transition-colors duration-300 hover:bg-[rgb(var(--surface-card-hover-rgb))] md:min-h-[280px] md:p-12">
              <div className="flex items-start justify-between gap-6">
                <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.18em] text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{item.en}</span>
              </div>
              <h3 className="mt-12 text-2xl font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-4 max-w-[36ch] text-sm leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

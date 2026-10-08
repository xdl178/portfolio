import { useState } from 'react'
import WorkCard from '../components/ui/WorkCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { works } from '../data/content.js'

export default function WorksPage() {
  const categories = ['全部', ...new Set(works.map((w) => w.category))]
  const [active, setActive] = useState('全部')

  const list = active === '全部' ? works : works.filter((w) => w.category === active)

  return (
    <div className="container pt-16 md:pt-24">
      <Reveal>
        <p className="eyebrow">All Works</p>
        <h1 className="mt-4 font-display text-hero-sub text-ink">全部作品</h1>
        <p className="mt-6 max-w-prose-narrow text-lead text-slate-ink">
          共 {works.length} 个占位项目。点击卡片进入详情，替换成你的真实项目后这个数字会自动更新。
        </p>
      </Reveal>

      {/* 分类筛选 */}
      <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-pill border px-4 py-2 text-body-sm transition-all duration-300 ${
              active === c
                ? 'border-brand bg-brand text-white shadow-brand-soft'
                : 'border-line bg-white text-slate-soft hover:border-brand-line hover:bg-brand-soft hover:text-brand'
            }`}
          >
            {c}
          </button>
        ))}
      </Reveal>

      <div className="mt-12 grid gap-7 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((work, i) => (
          <WorkCard key={work.slug} work={work} index={i} />
        ))}
      </div>
    </div>
  )
}

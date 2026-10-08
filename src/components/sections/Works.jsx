import { Link } from 'react-router-dom'
import WorkCard from '../ui/WorkCard.jsx'
import Reveal from '../ui/Reveal.jsx'
import { works } from '../../data/content.js'

/** 首页的作品区块：展示前 4 个，其余去 /works 看 */
export default function Works({ limit = 4 }) {
  const list = works.slice(0, limit)

  return (
    <section id="works" className="section-y">
      <div className="container">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected Works</p>
            <h2 className="mt-4 font-display text-section text-ink">精选作品</h2>
            <p className="mt-4 max-w-prose-narrow text-body text-slate-soft">
              每一个项目都写清了背景、方案与结果。占位内容已标注，替换成你的真实项目即可。
            </p>
          </div>
          <Link to="/works" className="btn-ghost shrink-0">
            查看全部作品
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((work, i) => (
            <WorkCard key={work.slug} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

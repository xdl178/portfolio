import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/ui/Reveal.jsx'
import { works } from '../data/content.js'

const gradients = [
  'from-[#4D6BFE] to-[#00C2FF]',
  'from-[#2440CC] to-[#7C4DFF]',
  'from-[#00C2FF] to-[#4D6BFE]',
  'from-[#7C4DFF] to-[#4D6BFE]',
  'from-[#3A55E8] to-[#00C2FF]',
  'from-[#0B1220] to-[#4D6BFE]',
]

export default function WorkDetail() {
  const { slug } = useParams()
  const index = works.findIndex((w) => w.slug === slug)
  const work = works[index]

  // slug 不存在时给一个明确的兜底，而不是白屏
  if (!work) {
    return (
      <div className="container pt-24">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-hero-sub text-ink">找不到这个作品</h1>
        <p className="mt-5 text-body text-slate-soft">
          链接里的 <code className="rounded bg-mist px-2 py-1 font-mono text-body-sm">{slug}</code> 不存在，
          可能已被重命名。
        </p>
        <Link to="/works" className="btn-primary mt-8">
          返回作品列表
        </Link>
      </div>
    )
  }

  const next = works[(index + 1) % works.length]
  const gradient = gradients[index % gradients.length]

  return (
    <article className="container pt-16 md:pt-24">
      {/* 头部 */}
      <Reveal>
        <Link to="/works" className="link-underline font-mono text-body-sm text-slate-soft">
          ← 返回作品列表
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">
          <span className="text-brand">{work.category}</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>{work.year}</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>{work.role}</span>
        </div>

        <h1 className="mt-5 max-w-[20ch] font-display text-hero-sub text-ink">{work.title}</h1>
        <p className="mt-6 max-w-prose-narrow text-lead text-slate-ink">{work.summary}</p>
      </Reveal>

      {/* 封面 */}
      <Reveal delay={0.1} className="mt-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card-lg border border-line">
          {work.cover ? (
            <img src={work.cover} alt={work.title} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradient}`}>
              <div className="absolute inset-0 bg-grid-tech opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-[clamp(56px,10vw,140px)] font-bold leading-none text-white/85 tnum">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-faint">
          占位封面：把图片放进 public/ 并在 content.js 里设置该项目的 cover 字段即可替换
        </p>
      </Reveal>

      {/* 正文 + 侧栏 */}
      <div className="mt-16 grid gap-12 pb-20 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div className="space-y-6">
          {work.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.05} as="p" className="text-body text-slate-ink">
              {p}
            </Reveal>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">项目信息</h2>
            <dl className="mt-5 space-y-4">
              {[
                { k: '年份', v: work.year },
                { k: '分类', v: work.category },
                { k: '我的角色', v: work.role },
              ].map((row) => (
                <div key={row.k} className="flex items-start justify-between gap-4 border-b border-line-soft pb-4 last:border-0 last:pb-0">
                  <dt className="text-body-sm text-slate-soft">{row.k}</dt>
                  <dd className="text-right text-body-sm font-medium text-ink-2">{row.v}</dd>
                </div>
              ))}
            </dl>

            {work.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span key={tag} className="rounded-pill bg-mist px-3 py-1 font-mono text-[11px] text-slate-soft">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {work.links?.length > 0 && (
              <div className="mt-7 space-y-2">
                {work.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 下一个项目 */}
      <Reveal className="border-t border-line py-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">下一个项目</div>
            <div className="mt-3 font-display text-card-title text-ink">{next.title}</div>
          </div>
          <Link to={`/works/${next.slug}`} className="btn-ghost">
            继续查看
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </article>
  )
}

import Reveal, { RevealGroup, RevealItem } from '../ui/Reveal.jsx'
import Avatar from '../ui/Avatar.jsx'
import { profile, skills, aboutParagraphs, timeline } from '../../data/content.js'

export default function About() {
  return (
    <section id="about" className="section-y">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* 左：头像 + 简介 */}
          <Reveal>
            <p className="eyebrow">About</p>
            <h2 className="mt-4 font-display text-section text-ink">关于我</h2>

            <div className="mt-8 flex items-center gap-5">
              <Avatar size="md" />
              <div>
                <div className="font-display text-card-title text-ink">{profile.name}</div>
                <div className="mt-1 text-body-sm text-slate-soft">{profile.title}</div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {aboutParagraphs.map((p, i) => (
                <p key={i} className="text-body text-slate-ink">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* 右：技能 + 经历 */}
          <div>
            <Reveal delay={0.1}>
              <h3 className="font-mono text-meta uppercase tracking-[0.14em] text-slate-faint">技能</h3>
              <div className="mt-5 space-y-5">
                {skills.map((group) => (
                  <div key={group.group} className="grid gap-3 sm:grid-cols-[80px_1fr] sm:items-start">
                    <div className="font-mono text-body-sm text-brand">{group.group}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-pill border border-line bg-white px-3 py-1 text-body-sm text-slate-ink transition-colors hover:border-brand-line hover:bg-brand-soft hover:text-brand"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-12">
              <h3 className="font-mono text-meta uppercase tracking-[0.14em] text-slate-faint">经历</h3>
            </Reveal>

            <RevealGroup className="mt-5 border-l border-line pl-6" stagger={0.1}>
              {timeline.map((t) => (
                <RevealItem key={t.period} className="relative pb-8 last:pb-0">
                  {/* 时间轴节点 */}
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand shadow-brand-soft" />
                  <div className="font-mono text-meta text-slate-faint">{t.period}</div>
                  <div className="mt-2 font-display text-body font-semibold text-ink">{t.title}</div>
                  <p className="mt-2 text-body-sm text-slate-soft">{t.desc}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  )
}

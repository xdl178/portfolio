import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from '../components/ui/Avatar.jsx'
import BlurHighlight from '../components/ui/BlurHighlight.jsx'
import BorderGlow from '../components/ui/BorderGlow.jsx'
import CountUp from '../components/ui/CountUp.jsx'
import DepthText from '../components/ui/DepthText.jsx'
import ScrollReveal, { ScrollRevealItem } from '../components/ui/ScrollReveal.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { profile, aboutParagraphs, skills, skillRatings, timeline, workExperience, stats } from '../data/content.js'

/** 能力条：进入视口后从 0 涨到目标值 */
function SkillBar({ name, value, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="py-3"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-body-sm text-ink-2">{name}</span>
        <span className="font-mono text-meta text-slate-faint tnum">
          <CountUp from={0} to={value} duration={1.6} />%
        </span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden rounded-pill bg-mist">
        <motion.div
          className="h-full rounded-pill bg-brand-gradient"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, delay: 0.15 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.li>
  )
}

export default function About() {
  return (
    <div className="container pt-16 md:pt-24">
      {/* 头部 */}
      <Reveal>
        <p className="eyebrow">About</p>
        <h1 className="mt-4 max-w-[18ch] font-display text-brut-sub text-ink">
          设计与代码之间的那个人
        </h1>
        <p className="mt-6 max-w-prose-narrow text-lead text-slate-ink">
          占位：一句话概括你的定位 —— 你更偏设计、工程，还是两端都做；你擅长解决什么类型的问题。
        </p>
      </Reveal>

      {/* 名片 + 数据 */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <Reveal>
          <BorderGlow glowColor="230 99 65" colors={['#4D6BFE', '#00C2FF', '#7C4DFF']} borderRadius={24}>
            <div className="p-8">
              <Avatar size="lg" />
              <h2 className="mt-6 font-display text-card-title text-ink">{profile.name}</h2>
              <p className="mt-2 text-body-sm text-slate-soft">{profile.title}</p>

              <dl className="mt-7 space-y-3 border-t border-line-soft pt-6">
                {[
                  { k: '所在地', v: profile.location },
                  { k: '邮箱', v: profile.contact.email },
                  { k: 'GitHub', v: profile.contact.github?.replace(/^https?:\/\//, '') },
                ].filter((r) => r.v).map((r) => (
                  <div key={r.k} className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-meta text-slate-faint">{r.k}</dt>
                    <dd className="text-right text-body-sm text-ink-2">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <a href={`mailto:${profile.contact.email}`} className="btn-primary mt-7 w-full">
                联系我
              </a>
            </div>
          </BorderGlow>
        </Reveal>

        <div>
          <BlurHighlight
            text={aboutParagraphs.join(' ')}
            keywords={['独立开发者', '产品设计', '前端', '工程化', '上线', '协作']}
            size="large"
          />

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-5 py-6">
                <div className="font-display text-[clamp(24px,3vw,34px)] font-bold leading-none text-ink tnum">{s.value}</div>
                <div className="mt-2 text-body-xs text-slate-soft">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <DepthText text="Focus" fontSize="clamp(2.4rem,6vw,3.6rem)" layers={22} depth={1.8} autoOrbit={false} />
          </div>
        </div>
      </div>

      {/* 能力自评 */}
      <section className="section-y">
        <Reveal>
          <p className="eyebrow">Skills</p>
          <h2 className="mt-4 font-display text-section text-ink">能力自评</h2>
        </Reveal>
        <ul className="mt-10 grid gap-x-14 md:grid-cols-2">
          {skillRatings.map((s, i) => (
            <SkillBar key={s.name} name={s.name} value={s.value} index={i} />
          ))}
        </ul>
      </section>

      {/* 技能分组 */}
      <section className="pb-20">
        <ScrollReveal stagger={0.08}>
          <ScrollRevealItem>
            <h2 className="font-display text-section text-ink">技能清单</h2>
          </ScrollRevealItem>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {skills.map((group) => (
              <ScrollRevealItem key={group.group} className="card p-7">
                <div className="font-mono text-meta text-brand">{group.group}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-pill border border-line bg-white px-3 py-1 text-body-sm text-slate-ink">
                      {item}
                    </span>
                  ))}
                </div>
              </ScrollRevealItem>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 工作经历 */}
      <section className="pb-20">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 font-display text-section text-ink">工作经历</h2>
        </Reveal>

        <div className="mt-10 space-y-6">
          {workExperience.map((w, i) => (
            <motion.article
              key={w.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card p-8"
            >
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div>
                  <div className="font-mono text-meta text-slate-faint">{w.period}</div>
                  <h3 className="mt-2 font-display text-body font-semibold text-ink">{w.company}</h3>
                  <div className="mt-1 text-body-sm text-slate-soft">{w.role}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {w.tags.map((t) => (
                      <span key={t} className="rounded-pill bg-mist px-3 py-1 font-mono text-[11px] text-slate-soft">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-body-sm text-slate-ink">{w.summary}</p>
                  <ul className="mt-4 space-y-2.5">
                    {w.points.map((p, idx) => (
                      <li key={idx} className="flex gap-2 text-body-sm text-slate-soft">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 时间线 */}
      <section className="pb-24">
        <Reveal>
          <h2 className="font-display text-section text-ink">时间线</h2>
        </Reveal>
        <ol className="mt-10 border-l border-line pl-7">
          {timeline.map((t, i) => (
            <motion.li
              key={t.period}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative pb-9 last:pb-0"
            >
              <span className="absolute -left-[35px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand shadow-brand-soft" />
              <div className="font-mono text-meta text-slate-faint">{t.period}</div>
              <div className="mt-2 font-display text-body font-semibold text-ink">{t.title}</div>
              <p className="mt-2 text-body-sm text-slate-soft">{t.desc}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-12">
          <Link to="/works" className="btn-primary">
            去看看我的作品
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

import { motion } from 'framer-motion'
import Avatar from '../ui/Avatar.jsx'
import Marquee from '../ui/Marquee.jsx'
import { profile, marqueeItems, stats } from '../../data/content.js'
import { useLenis } from '../../hooks/useSmoothScroll.jsx'

/* 首屏文字块的错落入场节奏 */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Hero() {
  const lenis = useLenis()

  // 滚到作品区：必须交给 Lenis，HashRouter 下用原生锚点会改掉路由
  const scrollToWorks = () => {
    const el = document.getElementById('works')
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.2 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden">
      {/* 背景：冷光 + 极细网格 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow-cool" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-glow-soft blur-2xl" />

      <div className="container pt-16 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* ===== 左：文字 ===== */}
          <motion.div variants={container} initial="hidden" animate="visible">
            {/* 状态徽标 */}
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-pill border border-brand-line bg-white/70 px-4 py-2 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              <span className="font-mono text-meta text-slate-soft">{profile.status}</span>
            </motion.div>

            {/* 大标题 */}
            <motion.h1
              variants={item}
              className="mt-7 whitespace-pre-line font-display text-hero text-ink"
            >
              {profile.headline}
            </motion.h1>

            {/* 简介 */}
            <motion.p variants={item} className="mt-7 max-w-prose-narrow text-lead text-slate-ink">
              {profile.intro}
            </motion.p>

            {/* 按钮组 */}
            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={scrollToWorks}>
                查看作品
                <ArrowRight />
              </button>
              <a href={`mailto:${profile.contact.email}`} className="btn-ghost">
                发邮件给我
              </a>
              {profile.contact.github && (
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-body-sm text-slate-soft transition-colors hover:text-brand"
                >
                  GitHub ↗
                </a>
              )}
            </motion.div>

            {/* 技术关键词条 */}
            <motion.div variants={item} className="mt-12 border-t border-line-soft pt-5">
              <Marquee items={marqueeItems} />
            </motion.div>
          </motion.div>

          {/* ===== 右：头像卡片 ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[380px] lg:mx-0"
          >
            <div className="card p-8 text-center shadow-card">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-brand-soft-gradient" />
              <div className="relative">
                <Avatar />
                <h2 className="mt-6 font-display text-card-title text-ink">{profile.name}</h2>
                <p className="mt-2 text-body-sm text-slate-soft">{profile.title}</p>

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-line-soft pt-6">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-brand" aria-hidden="true">
                    <path d="M8 14s5-4.2 5-7.5A5 5 0 0 0 3 6.5C3 9.8 8 14 8 14Z" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="8" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span className="font-mono text-meta text-slate-soft">{profile.location}</span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { k: '邮箱', v: profile.contact.email ? '可联系' : '—' },
                    { k: '仓库', v: profile.contact.github ? '公开' : '—' },
                    { k: '状态', v: '接单中' },
                  ].map((row) => (
                    <div key={row.k} className="rounded-xl bg-wash px-3 py-3">
                      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-faint">{row.k}</div>
                      <div className="mt-1 text-body-sm font-medium text-ink-2">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 悬浮小标签，增加科技感层次 */}
            <div className="absolute -left-3 top-10 hidden animate-float-slow rounded-pill border border-line bg-white px-4 py-2 shadow-soft lg:block">
              <span className="font-mono text-[11px] text-slate-soft">Available for work</span>
            </div>
            <div className="absolute -right-3 bottom-14 hidden animate-float-slow rounded-pill border border-brand-line bg-brand-soft px-4 py-2 shadow-soft [animation-delay:1.2s] lg:block">
              <span className="font-mono text-[11px] text-brand">Design × Code</span>
            </div>
          </motion.div>
        </div>

        {/* ===== 数据条 ===== */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-7">
              <dt className="font-display text-[clamp(28px,3.4vw,40px)] font-bold leading-none text-ink tnum">
                {s.value}
              </dt>
              <dd className="mt-3 text-body-sm text-slate-soft">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

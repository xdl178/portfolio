import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TextLoop from '../components/ui/TextLoop.jsx'
import DepthText from '../components/ui/DepthText.jsx'
import BorderGlow from '../components/ui/BorderGlow.jsx'
import CardSpread from '../components/ui/CardSpread.jsx'
import AccordionGallery from '../components/ui/AccordionGallery.jsx'
import DriftWall from '../components/ui/DriftWall.jsx'
import SkewedCarousel from '../components/ui/SkewedCarousel.jsx'
import BlurHighlight from '../components/ui/BlurHighlight.jsx'
import DepthCard from '../components/ui/DepthCard.jsx'
import ScrollReveal, { ScrollRevealItem } from '../components/ui/ScrollReveal.jsx'
import CountUp from '../components/ui/CountUp.jsx'
import Marquee from '../components/ui/Marquee.jsx'
import Contact from '../components/sections/Contact.jsx'
import { profile, stats, skills, works, capabilities, techWall, principles, aboutParagraphs, projectExperience, workExperience, marqueeItems } from '../data/content.js'

/* 能力图标 */
const icons = {
  design: <path d="M4 20V9.5L12 4l8 5.5V20M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  code: <path d="M9 7 4 12l5 5M15 7l5 5-5 5M13 4l-2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  ship: <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
}

/* ===================== 首屏 ===================== */
function Hero() {
  const sectionRef = useRef(null)
  const portraitRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const portrait = portraitRef.current
    if (!section || !portrait) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(portrait, { scale: 0.9, opacity: 0, y: 32 }, { scale: 1, opacity: 1, y: 0, duration: 1.3, ease: 'expo.out' })
      gsap.to(portrait, { y: '+=14', duration: 3.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.3 })
    }, section)

    const xTo = gsap.quickTo(portrait, 'x', { duration: 0.6, ease: 'power3.out' })
    const rotYTo = gsap.quickTo(portrait, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const rotXTo = gsap.quickTo(portrait, 'rotationX', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      xTo(px * 28)
      rotYTo(px * 7)
      rotXTo(-py * 5)
    }

    section.addEventListener('mousemove', onMove)
    return () => {
      section.removeEventListener('mousemove', onMove)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow-cool" />
      <div className="bg-grid-lines opacity-60 [mask-image:radial-gradient(75%_60%_at_50%_0%,black,transparent)]" />

      <div className="container pt-14 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* 左：文字 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-pill border border-brand-line bg-white/70 px-4 py-2 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              <span className="font-mono text-meta text-slate-soft">{profile.status}</span>
            </motion.div>

            {/* 巨型标题：DepthText 做纵深，下面用文字型标题保证可读性 */}
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 whitespace-pre-line font-display text-hero text-ink"
            >
              {profile.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-prose-narrow text-lead text-slate-ink"
            >
              {profile.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link to="/works" className="btn-primary">
                查看作品
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href={`mailto:${profile.contact.email}`} className="btn-ghost">
                发邮件给我
              </a>
              <Link to="/about" className="link-underline text-body-sm text-slate-soft">
                了解更多
              </Link>
            </motion.div>

            {/* 跑马灯词条 */}
            <div className="mt-12 border-t border-line-soft pt-5">
              <Marquee items={marqueeItems} />
            </div>
          </div>

          {/* 右：景深名片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[380px] lg:mx-0"
          >
            <div ref={portraitRef} className="transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
              <DepthCard variant="cobalt" depth={1.15} rotateAmount={9} glass>
                <div className="p-8 text-center">
                  <div className="relative mx-auto mb-6 w-fit">
                    <span className="pointer-events-none absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-brand/20" />
                    <span className="absolute -inset-[3px] rounded-full bg-brand-gradient opacity-90 blur-[1px]" />
                    <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-brand-soft font-display text-[36px] font-bold text-brand ring-4 ring-white">
                      {profile.avatarImage ? (
                        <img src={profile.avatarImage} alt={`${profile.name} 的头像`} className="h-full w-full object-cover" />
                      ) : (
                        profile.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  </div>

                  <h2 className="font-display text-card-title text-ink">{profile.name}</h2>
                  <p className="mt-2 text-body-sm text-slate-soft">{profile.title}</p>

                  <div className="mt-6 grid grid-cols-3 gap-2 border-t border-line-soft pt-6">
                    {[
                      { k: '邮箱', v: '可联系' },
                      { k: '仓库', v: '公开' },
                      { k: '状态', v: '接单中' },
                    ].map((row) => (
                      <div key={row.k} className="rounded-xl bg-wash px-2 py-2.5">
                        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-faint">{row.k}</div>
                        <div className="mt-1 text-body-sm font-medium text-ink-2">{row.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </DepthCard>
            </div>

            {/* 悬浮标签：避开头像区域，压在卡片左上角外侧 */}
            <div className="absolute -left-8 top-2 hidden animate-float-slow rounded-pill border border-line bg-white px-4 py-2 shadow-soft lg:block">
              <span className="font-mono text-[11px] text-slate-soft">Available for work</span>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden animate-float-slow rounded-pill border border-brand-line bg-brand-soft px-4 py-2 shadow-soft [animation-delay:1.2s] lg:block">
              <span className="font-mono text-[11px] text-brand">Design × Code</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 弯曲文字缎带 */}
      <div className="mt-16 md:mt-20">
        <TextLoop
          text={`${profile.name} — Design & Code — Portfolio`}
          shape="wave"
          speed={110}
          fontSize={44}
          curviness={120}
          ribbon
          ribbonColor="#4D6BFE"
          letterSpacing={3}
        />
      </div>
    </section>
  )
}

/* ===================== 数据条 ===================== */
function Stats() {
  const parse = (v) => {
    const num = parseFloat(String(v).replace(/[^\d.]/g, ''))
    const suffix = String(v).replace(/[\d.]/g, '')
    return { num, suffix }
  }

  return (
    <ScrollReveal className="container mt-20" stagger={0.09}>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-4">
        {stats.map((s) => {
          const { num, suffix } = parse(s.value)
          return (
            <ScrollRevealItem key={s.label} className="bg-white px-6 py-7">
              <dt className="font-display text-[clamp(28px,3.4vw,40px)] font-bold leading-none text-ink tnum">
                <CountUp from={0} to={num} duration={1.8} separator="" />
                <span className="text-brand">{suffix}</span>
              </dt>
              <dd className="mt-3 text-body-sm text-slate-soft">{s.label}</dd>
            </ScrollRevealItem>
          )
        })}
      </dl>
    </ScrollReveal>
  )
}

/* ===================== 能力（边框光晕卡） ===================== */
function Capabilities() {
  return (
    <section id="services" className="section-y bg-wash">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-4 max-w-prose-narrow font-display text-section text-ink">我能提供的三类协作方式</h2>
          </ScrollRevealItem>
        </ScrollReveal>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <BorderGlow glowColor="230 99 65" colors={['#4D6BFE', '#00C2FF', '#7C4DFF']} borderRadius={20}>
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {icons[c.icon]}
                      </svg>
                    </span>
                    <span className="font-mono text-[28px] font-bold leading-none text-line tnum">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-card-title text-ink">{c.title}</h3>
                  <p className="mt-3 text-body-sm text-slate-soft">{c.desc}</p>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================== 简介（模糊高亮文本） ===================== */
function ProfileSection() {
  return (
    <section id="about" className="section-y">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="mt-4 font-display text-section text-ink">关于我</h2>
            <div className="mt-8">
              <DepthText text={profile.name} fontSize="clamp(2.6rem,7vw,4.5rem)" layers={26} depth={2} autoOrbit />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {skills.slice(0, 3).flatMap((g) => g.items.slice(0, 4)).map((item) => (
                <span key={item} className="rounded-pill border border-line bg-white px-3 py-1 text-body-sm text-slate-ink">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <BlurHighlight
              text={aboutParagraphs.join(' ')}
              keywords={['独立开发者', '产品设计', '前端', '工程化', '上线']}
              size="large"
            />
            <Link to="/about" className="btn-ghost mt-8">
              看完整经历
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===================== 项目经历（卡片展开） ===================== */
function ProjectExperience() {
  const cards = projectExperience.map((p) => ({
    label: p.no,
    title: p.title,
    body: (
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand">{p.role} · {p.period}</div>
        <p className="mt-3 text-body-sm text-slate-soft">{p.summary}</p>
        <ul className="mt-4 space-y-2">
          {p.duties.slice(0, 2).map((d, i) => (
            <li key={i} className="flex gap-2 text-body-sm text-slate-ink">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    variant: p.accent === '#00C2FF' ? 'cyan' : p.accent === '#7C4DFF' ? 'violet' : 'cobalt',
  }))

  return (
    <section id="projects" className="section-y bg-wash">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <p className="eyebrow">Projects</p>
            <h2 className="mt-4 font-display text-section text-ink">项目经历</h2>
            <p className="mt-4 max-w-prose-narrow text-body text-slate-soft">
              点击卡片可以展开／收起，查看每个项目的职责与产出。
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
        <div className="mt-12">
          <CardSpread cards={cards} spreadAmount={96} rotateAmount={9} />
        </div>
      </div>
    </section>
  )
}

/* ===================== 工作经历 ===================== */
function WorkExperience() {
  return (
    <section id="experience" className="section-y">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <p className="eyebrow">Experience</p>
            <h2 className="mt-4 font-display text-section text-ink">工作经历</h2>
          </ScrollRevealItem>
        </ScrollReveal>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {workExperience.map((w, i) => (
            <motion.article
              key={w.company}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-card-title text-ink">{w.company}</h3>
                  <p className="mt-1 font-mono text-meta text-slate-faint">{w.companyEn}</p>
                </div>
                <span className="shrink-0 rounded-pill px-3 py-1 font-mono text-[11px]" style={{ background: 'rgba(77,107,254,0.08)', color: w.accent }}>
                  {w.period}
                </span>
              </div>

              <p className="mt-5 text-body-sm text-slate-soft">{w.summary}</p>

              <ul className="mt-5 space-y-2.5">
                {w.points.slice(0, 3).map((p, idx) => (
                  <li key={idx} className="flex gap-2 text-body-sm text-slate-ink">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-line-soft pt-5">
                {w.role && <span className="rounded-pill bg-mist px-3 py-1 font-mono text-[11px] text-slate-soft">{w.role}</span>}
                {w.tags.map((t) => (
                  <span key={t} className="rounded-pill bg-mist px-3 py-1 font-mono text-[11px] text-slate-soft">{t}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================== 精选作品（手风琴画廊） ===================== */
function FeaturedWorks() {
  const items = works.slice(0, 6).map((w, i) => ({
    label: w.title,
    link: `#/works/${w.slug}`,
    image: w.cover || undefined,
    alt: w.title,
    fallbackGradient: [
      'linear-gradient(135deg,#4D6BFE,#00C2FF)',
      'linear-gradient(135deg,#2440CC,#7C4DFF)',
      'linear-gradient(135deg,#00C2FF,#4D6BFE)',
      'linear-gradient(135deg,#7C4DFF,#4D6BFE)',
      'linear-gradient(135deg,#3A55E8,#00C2FF)',
      'linear-gradient(135deg,#0B1220,#4D6BFE)',
    ][i % 6],
  }))

  return (
    <section id="works" className="section-y bg-wash">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Selected Works</p>
                <h2 className="mt-4 font-display text-section text-ink">精选作品</h2>
                <p className="mt-4 max-w-prose-narrow text-body text-slate-soft">
                  鼠标悬停或按左右方向键切换，展开查看每个项目。
                </p>
              </div>
              <Link to="/works" className="btn-ghost shrink-0">
                查看全部作品
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>

        <div className="mt-12">
          <AccordionGallery items={items} height={480} expandRatio={0.5} grayscale={false} accentColor="#4D6BFE" textColor="#FFFFFF" overlayColor="#0B1220" />
        </div>
      </div>
    </section>
  )
}

/* ===================== 技术墙（飘移卡片墙） ===================== */
function TechWall() {
  const items = techWall.map((t, i) => ({
    title: t,
    label: String(i + 1).padStart(2, '0'),
  }))

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <p className="eyebrow">Toolbox</p>
            <h2 className="mt-4 font-display text-section text-ink">日常使用的技术栈</h2>
          </ScrollRevealItem>
        </ScrollReveal>
      </div>
      <div className="mt-10 h-[380px]">
        <DriftWall
          items={items}
          columns={6}
          tileWidth={190}
          tileHeight={120}
          tilt={14}
          turn={-12}
          speed={38}
          overlayColor="#DCE4FF"
        />
      </div>
    </section>
  )
}

/* ===================== 工作原则（倾斜轮播） ===================== */
function Principles() {
  return (
    <section className="section-y bg-wash">
      <div className="container">
        <ScrollReveal>
          <ScrollRevealItem>
            <p className="eyebrow">Principles</p>
            <h2 className="mt-4 font-display text-section text-ink">我的工作原则</h2>
            <p className="mt-4 max-w-prose-narrow text-body text-slate-soft">
              可以拖拽、滚轮或按方向键切换。
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </div>
      <div className="mt-10">
        <SkewedCarousel
          cards={principles}
          cardWidth={340}
          cardHeight={260}
          gap={28}
          fadeColor="#F6F8FC"
          indicators
          draggable
          ariaLabel="工作原则"
        />
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Capabilities />
      <ProfileSection />
      <ProjectExperience />
      <WorkExperience />
      <FeaturedWorks />
      <TechWall />
      <Principles />
      <Contact />
    </>
  )
}

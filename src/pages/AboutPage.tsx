import AboutCapabilities from '../components/AboutCapabilities'
import SectionHeader from '../components/SectionHeader'
import { profileFields } from '../data/profile'
import { works } from '../data/works'

/* 关于：刊头（标签行 + 两行巨字）→ 导读（序号 + 正文 + 统计卡）→ 能力 → 经历 */

const CONTACT_EMAIL = 'mailto:3112516515@qq.com'

export default function AboutPage() {
  const pages = works.reduce((total, work) => total + work.pageImages.length, 0)
  const originals = works.reduce((total, work) => total + work.originalImages.length, 0)
  const stats = [
    { tag: 'N·01', value: String(works.length).padStart(2, '0'), label: '件精选作品' },
    { tag: 'N·02', value: String(pages).padStart(2, '0'), label: '张设计页面' },
    { tag: 'N·03', value: String(originals).padStart(2, '0'), label: '张主要原稿' },
  ]

  return (
    <div className="bg-bg pb-28 pt-32 md:pb-44 md:pt-40">
      <header className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="rounded-full border border-paper/20 bg-paper/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Designer · 2026</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">About Me · 关于我 / The Designer</span>
        </div>

        <h1 className="mt-10 text-[clamp(2.8rem,11vw,8.4rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text-primary">
          <span className="block">关于</span>
          <span className="block text-gradient">我。</span>
        </h1>

        <div className="mt-14 grid gap-10 border-b border-paper/15 pb-14 md:mt-16 md:grid-cols-12 md:items-end md:gap-14 md:pb-16">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="font-mono text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-muted">01</span>
              <span aria-hidden="true" className="h-px w-10 bg-paper/25" />
              <span className="type-label text-[11px] text-muted">Intro · 章节导读</span>
            </div>
            <p className="mt-6 max-w-[52ch] text-base leading-8 text-muted">
              我是一名视觉与 UI/UX 设计师，工作覆盖原创 IP、品牌交互与 AI 产品官网。习惯从真实场景出发，把复杂的信息结构梳理成直觉可读的界面，并与开发一起把设计落到线上。
            </p>
            <p className="mt-4 max-w-[52ch] text-sm leading-7 text-muted">
              当前可接受新项目委托，方向包括品牌视觉系统、产品界面与动态影像。
            </p>
            <a href={CONTACT_EMAIL} className="group mt-8 inline-flex items-center gap-3 border-b border-accent pb-2 text-sm text-text-primary transition-colors hover:text-accent-strong">
              聊聊你的项目
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 md:col-span-5">
            {stats.map((stat) => (
              <div key={stat.tag} className="relative rounded-card border border-paper/15 bg-paper/[0.02] p-4 md:p-5">
                <span className="absolute right-3 top-3 font-mono text-[9px] tracking-[0.14em] text-muted">{stat.tag}</span>
                <p className="font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none text-text-primary">{stat.value}</p>
                <p className="mt-3 text-[11px] leading-5 text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <AboutCapabilities />

      <section className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16" aria-label="教育与工作经历">
        <SectionHeader index="03" label="经历 · BACKGROUND" title={<>一路走来的<span className="text-gradient whitespace-nowrap">坐标。</span></>} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-paper/10 bg-paper/10 md:grid-cols-2">
          <article className="bg-[rgb(var(--surface-card-rgb))] p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Education · 教育背景</p>
            <h3 className="mt-5 text-2xl font-semibold text-text-primary">{profileFields.school}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{profileFields.major} <span className="mx-2 text-accent">/</span> {profileFields.educationPeriod}</p>
          </article>
          <article className="bg-[rgb(var(--surface-card-rgb))] p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Experience · 工作经历</p>
            <h3 className="mt-5 text-2xl font-semibold text-text-primary">{profileFields.employer}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{profileFields.position} <span className="mx-2 text-accent">/</span> {profileFields.employmentPeriod}</p>
          </article>
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">以上字段为占位，待本人提供后回填</p>
      </section>
    </div>
  )
}

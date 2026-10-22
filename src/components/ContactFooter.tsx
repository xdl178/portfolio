import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

/* ============================================================
   ContactFooter · 联系 + 页脚
   - GSAP 无限跑马灯（全站仅此一处）
   - 邮箱 CTA + 社交 + 接单状态点
   ============================================================ */

const MARQUEE_TEXT = 'LET US BUILD TOGETHER'
const REPEAT = 6

const SOCIALS = [
  { label: 'Behance', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: '微博', href: '#' },
]

export default function ContactFooter() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = marqueeRef.current
    if (!el || reduce) return

    const ctx = gsap.context(() => {
      /* 轨道内容复制一份，位移 -50% 即无缝循环 */
      gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
    })

    return () => ctx.revert()
  }, [])

  const items = Array.from({ length: REPEAT }, (_, i) => i)
  const Half = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div className="flex flex-none" aria-hidden={ariaHidden}>
      {items.map((i) => (
        <span
          key={i}
          className="inline-flex items-center pr-10 font-mono text-[clamp(1.6rem,4.5vw,3.5rem)] font-semibold tracking-[0.06em] text-text-primary/85"
        >
          {MARQUEE_TEXT}
          <span aria-hidden="true" className="ml-10 inline-block h-2 w-2 rounded-[2px] bg-accent" />
        </span>
      ))}
    </div>
  )

  return (
    <footer id="contact" className="relative overflow-hidden pt-20 pb-10 md:pt-24 md:pb-12">
      {/* 顶部发丝线 + 光晕 */}
      <div className="hairline mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16" aria-hidden="true" />
      <span
        className="glow glow-brand"
        style={{
          width: '46rem',
          height: '30rem',
          left: '50%',
          bottom: '-18rem',
          transform: 'translateX(-50%)',
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* 跑马灯 */}
        <div className="overflow-hidden whitespace-nowrap py-10 md:py-14" aria-hidden="true">
          <div ref={marqueeRef} className="inline-flex will-change-transform">
            <Half />
            <Half ariaHidden />
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-[1240px] px-6 py-14 text-center md:px-10 md:py-20 lg:px-16">
          <h2 className="type-h2 mx-auto mb-10 max-w-3xl text-text-primary">
            有项目想<span className="text-gradient">聊聊</span>吗？
          </h2>
          <a href="mailto:hello@studio.example" className="btn btn-primary px-7 py-4 text-base">
            联系我们
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* 页脚栏 */}
        <div className="mx-auto max-w-[1240px] border-t border-white/10 px-6 pt-8 md:px-10 lg:px-16">
          {/* 快捷链接 */}
          <nav aria-label="页脚导航" className="mb-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { label: '首页 · Home', to: '/' },
              { label: '作品 · Works', to: '/works' },
              { label: '关于 · About', to: '/about' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-sm text-muted transition-colors duration-300 hover:text-accent"
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
                />
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-sm text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="pulse-dot h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm text-muted">接受新的合作</span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted/70">
            © {new Date().getFullYear()} ［工作室名称］
          </p>
        </div>
      </div>
    </footer>
  )
}

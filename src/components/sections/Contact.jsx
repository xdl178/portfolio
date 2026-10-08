import { motion } from 'framer-motion'
import TextLoop from '../ui/TextLoop.jsx'
import Ripple from '../ui/Ripple.jsx'
import { profile } from '../../data/content.js'

/** 联系区块：工作机会、合作、交流都走这里 */
export default function Contact() {
  const { email, github, wechat, x } = profile.contact
  const socials = [
    github && { label: 'GitHub', value: github.replace(/^https?:\/\//, ''), href: github },
    x && { label: 'X', value: x.replace(/^https?:\/\//, ''), href: x },
    wechat && { label: '微信', value: wechat, href: null },
  ].filter(Boolean)

  return (
    <section id="contact" className="section-y">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-card-lg border border-brand-line bg-brand-soft-gradient px-8 py-16 md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-tech/10 blur-3xl" />
          <div className="bg-grid-lines opacity-40" />

          <div className="relative text-center">
            <p className="eyebrow">Contact</p>
            <h2 className="mx-auto mt-4 max-w-prose-narrow font-display text-section text-ink">
              有想法想落地？直接发消息给我
            </h2>
            <p className="mx-auto mt-5 max-w-prose-narrow text-body text-slate-ink">
              占位：写一句你希望对方怎么联系你、你通常多久回复、以及你更愿意接哪类合作。
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Ripple
                as="link"
                href={`mailto:${email}`}
                className="btn-primary !text-white"
                variant="default"
              >
                {email}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Ripple>

              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="btn-ghost">
                  看我的 GitHub
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-brand-line pt-8">
                {socials.map((s) => (
                  <div key={s.label} className="text-left">
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">{s.label}</div>
                    <div className="mt-1 text-body-sm text-ink-2">
                      {s.href ? (
                        <a href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                          {s.value}
                        </a>
                      ) : (
                        s.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 底部弯曲文字：给页面收尾 */}
      <div className="mt-16">
        <TextLoop
          text="Let's build something — 一起做点东西"
          shape="wave"
          speed={130}
          fontSize={40}
          curviness={140}
          ribbon
          ribbonColor="#00C2FF"
          pauseOnHover
        />
      </div>
    </section>
  )
}

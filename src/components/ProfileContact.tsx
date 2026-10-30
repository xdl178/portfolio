import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Link } from 'react-router-dom'
import { profileFields } from '../data/profile'

const directions = ['视觉识别', '数字产品', '交互体验', '动态表达']

export default function ProfileContact() {
  const reduce = useReducedMotion()
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-paper/10 bg-bg py-28 md:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[600px] w-[600px] rounded-full bg-accent/[.045] blur-[110px]" />
      <div className="relative mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <div className="flex items-center gap-4"><span className="h-px w-12 bg-accent" /><span className="font-mono text-xs tracking-[.18em] text-muted">PROFILE / CONTACT</span></div>
        <motion.h2 id="contact-title" initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="mt-10 max-w-6xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[1.1] tracking-[-.065em] text-text-primary">关于我，<br /><span className="text-gradient">从这里开始联系。</span></motion.h2>
        <div className="mt-16 grid gap-12 border-t border-paper/15 pt-12 md:mt-24 md:grid-cols-12 md:gap-14 md:pt-16">
          <div className="md:col-span-5"><h3 className="mb-7 text-sm tracking-[.15em] text-muted">信息简介</h3><p className="max-w-[38ch] text-2xl leading-relaxed text-text-primary md:text-3xl">{profileFields.summary}</p><p className="mt-6 max-w-[48ch] text-sm leading-7 text-muted">关注从视觉语言到交互反馈的完整体验。个人背景与合作信息补充后会在此展示。</p><div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">{directions.map((item) => <span key={item} className="border-b border-paper/20 pb-2 text-sm text-muted">{item}</span>)}</div></div>
          <div className="md:col-span-7 md:pl-12 lg:pl-20"><h3 className="mb-7 text-sm tracking-[.15em] text-muted">联系信息</h3><dl className="space-y-0"><div className="grid gap-3 border-t border-paper/15 py-6 sm:grid-cols-[140px_1fr]"><dt className="text-sm text-muted">邮箱</dt><dd className="text-xl text-text-primary md:text-2xl">{profileFields.email}</dd></div><div className="grid gap-3 border-t border-paper/15 py-6 sm:grid-cols-[140px_1fr]"><dt className="text-sm text-muted">作品站</dt><dd className="text-xl text-text-primary md:text-2xl">{profileFields.website}</dd></div><div className="grid gap-3 border-y border-paper/15 py-6 sm:grid-cols-[140px_1fr]"><dt className="text-sm text-muted">所在地</dt><dd className="text-xl text-text-primary md:text-2xl">{profileFields.location}</dd></div></dl><p className="mt-7 text-sm leading-7 text-muted">联系信息待补充，当前不提供无效的邮箱或社交链接。</p><Link to="/works" className="mt-10 inline-flex min-h-11 items-center gap-3 border-b border-accent pb-2 text-sm text-text-primary transition-colors hover:text-accent">查看作品档案 <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>
  )
}

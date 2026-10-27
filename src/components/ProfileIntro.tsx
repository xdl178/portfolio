import { motion, useReducedMotion } from 'framer-motion'
import { profileFields } from '../data/profile'

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

function InfoGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-paper/12 pt-5">
      <h3 className="mb-6 inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.045] px-4 py-2 text-sm text-muted">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgb(var(--brand-rgb)/0.75)]" />{label}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="mb-2 text-xs tracking-[0.1em] text-muted">{label}</dt><dd className="break-words text-base leading-7 text-text-primary md:text-lg">{value}</dd></div>
}

export default function ProfileIntro() {
  const reduce = useReducedMotion()
  return (
    <section id="about-intro" aria-labelledby="profile-title" className="relative isolate overflow-hidden bg-bg py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="mx-auto max-w-[1380px] px-5 md:px-10 lg:px-16">
        <div className="relative mb-14 flex items-end gap-5 md:mb-20">
          <span aria-hidden="true" className="pointer-events-none absolute -top-10 left-[6.2rem] hidden font-mono text-[clamp(4rem,7vw,8.5rem)] font-semibold tracking-[-0.09em] text-paper/[0.045] md:block">ABOUT</span>
          <span className="font-mono text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-none tracking-[-0.09em] text-muted">01</span>
          <h2 id="profile-title" className="mb-1 border-l border-accent/60 pl-5 text-3xl font-semibold leading-none tracking-[-0.06em] text-text-primary md:text-5xl">关于<span className="text-accent">我</span></h2>
          <span aria-hidden="true" className="mb-2 ml-auto hidden font-mono text-xs tracking-[.2em] text-muted md:block">PERSONAL PROFILE</span>
        </div>

        <div className="grid gap-14 md:gap-20 lg:grid-cols-[minmax(0,.79fr)_minmax(0,1.21fr)] lg:items-start lg:gap-24">
          <motion.div initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .2 }} variants={reveal} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[450px] lg:max-w-none">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-card border border-paper/15 bg-surface-light shadow-[0_36px_100px_-58px_rgb(var(--brand-rgb)/0.4)]">
              <span aria-hidden="true" className="absolute inset-3 rounded-card border border-inverse-text/25" />
              <span aria-hidden="true" className="absolute left-7 top-7 font-mono text-xs tracking-[.16em] text-inverse-text">IMAGE / PENDING</span>
              <div className="flex flex-col items-center gap-4 text-inverse-text"><span aria-hidden="true" className="text-4xl font-light">＋</span><span className="text-sm tracking-[.18em]">照片待补充</span></div>
              <span aria-hidden="true" className="absolute bottom-7 right-7 font-mono text-xs text-inverse-text">4 : 5</span>
            </div>
            <p className="mt-5 font-mono text-xs tracking-[.14em] text-muted">01 / PROFILE IMAGE</p>
          </motion.div>

          <motion.div initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .12 }} variants={reveal} transition={{ duration: .75, delay: reduce ? 0 : .1, ease: [0.22, 1, 0.36, 1] }} className="space-y-10 pb-3 md:space-y-12">
            <InfoGroup label="基本信息">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 md:gap-x-7"><Field label="姓名" value={profileFields.name} /><Field label="所在地" value={profileFields.location} /><Field label="工作经验" value={profileFields.experience} /><Field label="邮箱" value={profileFields.email} /><Field label="作品站" value={profileFields.website} /></dl>
            </InfoGroup>
            <InfoGroup label="教育背景"><p className="mb-2 font-mono text-xs text-muted">{profileFields.educationPeriod}</p><p className="text-lg text-text-primary">{profileFields.school} <span className="mx-3 text-muted">/</span> {profileFields.major}</p></InfoGroup>
            <InfoGroup label="工作经历"><p className="mb-2 font-mono text-xs text-muted">{profileFields.employmentPeriod}</p><p className="text-lg text-text-primary">{profileFields.employer} <span className="mx-3 text-muted">/</span> {profileFields.position}</p></InfoGroup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

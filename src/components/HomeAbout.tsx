import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePointerGlow } from './PointerGlow'
import WorkTag from './WorkTag'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { profileFields, profileIntro } from '../data/profile'
import Badge from './Badge'
import SurfaceCard from './SurfaceCard'
import { useMotionTokens } from '../hooks/useMotionTokens'
import './SelectedWorks.css'
import './HomeAbout.css'

const tools = [
  { name: 'Figma', file: 'figma.svg' },
  { name: 'MasterGo', file: 'mastergo.ico' },
  { name: 'Adobe Photoshop', file: 'photoshop.svg' },
  { name: 'Adobe Illustrator', file: 'illustrator.svg' },
  { name: 'Adobe InDesign', file: 'indesign.svg' },
  { name: 'Blender', file: 'blender.svg' },
  { name: 'Adobe After Effects', file: 'aftereffects.svg' },
  { name: 'Adobe Premiere Pro', file: 'premierepro.svg' },
]

function Field({ label, value, wide = false, valueClassName }: { label: string; value: ReactNode; wide?: boolean; valueClassName?: string }) {
  return <div className={`home-about-field${wide ? ' home-about-field--wide' : ''}`}><dt>{label}</dt><dd className={valueClassName}>{value}</dd></div>
}

export default function HomeAbout() {
  const reduce = useReducedMotion()
  const tokens = useMotionTokens()
  const { ref, onPointerMove, onPointerLeave } = usePointerGlow()
  const reveal = reduce ? false : { opacity: 0, transform: 'translateY(20px)' }
  const visible = { opacity: 1, transform: 'none' }
  return (
    <section id="about-intro" className="home-section home-about relative bg-bg" aria-labelledby="home-about-title">
      <div className="home-about-container">
        <header className="selected-works-heading">
          <span className="selected-works-chapter" aria-hidden="true">01</span>
          <div className="selected-works-heading-copy">
            <span className="selected-works-exhibit" aria-hidden="true">ABOUT</span>
            <div className="selected-works-heading-row"><span className="selected-works-slash" aria-hidden="true">/</span><h2 id="home-about-title">关于<span className="text-accent">我</span></h2></div>
          </div>
        </header>
        <div className="home-about-layout">
          <motion.article ref={ref} data-pointer-glow data-glow-active="false" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="home-about-profile-card pointer-glow" aria-labelledby="home-about-name" initial={reveal} whileInView={visible} viewport={{ once: true, amount: .12 }} transition={reduce ? { duration: 0 } : tokens.reveal}>
            <div className="home-about-profile-top">
              <div data-profile-photo className="home-about-portrait" role="img" aria-label="个人照片占位，待提供照片" />
              <Badge>基本信息</Badge>
            </div>
            <h3 id="home-about-name" className="home-about-name">{profileFields.name}</h3>
            <p className="home-about-position">{profileFields.position} · {profileFields.employmentPeriod}</p>
            <div className="home-about-info">
              <div className="home-about-fields">
                <dl className="home-about-field-row home-about-field-row--triple"><Field label="姓名" value={profileFields.name} /><Field label="所在地" value={profileFields.location} /><Field label="工作经验" value={profileFields.experience} /></dl>
                <dl className="home-about-field-row home-about-field-row--double"><Field label="联系方式" value={profileFields.contact} /><Field label="邮箱" value={profileFields.email} /></dl>
                <dl className="home-about-field-row"><Field label="作品站" value={profileFields.website} wide /></dl>
                <dl className="home-about-field-row"><Field label="能力关键词" value={profileFields.keywords.split(' / ').map(keyword => <WorkTag key={keyword}>{keyword}</WorkTag>)} valueClassName="home-about-keywords" wide /></dl>
              </div>
            </div>
          </motion.article>
          <div data-profile-details className="home-about-details">
            <motion.div className="home-about-bio" initial={reveal} whileInView={visible} viewport={{ once: true, amount: .12 }} transition={reduce ? { duration: 0 } : tokens.reveal}>
              <h3 className="home-about-bio-heading">基本信息</h3>
              {profileIntro.map(paragraph => <p className="type-body" key={paragraph}>{paragraph}</p>)}
            </motion.div>
            <div className="home-about-skills">
              <h3 id="home-about-tools-title">Design Tools</h3>
              <ul className="home-about-skill-grid" role="list" aria-labelledby="home-about-tools-title">
                {tools.map((app, index) => <SurfaceCard as="li" key={app.name} index={index} data-profile-skill data-tool-reveal className="home-about-tool">
                  <img src={`${import.meta.env.BASE_URL}images/tools/${app.file}`} alt={app.name} width="36" height="36" loading="lazy" decoding="async" />
                  <span className="home-about-tool-name">{app.name}</span>
                </SurfaceCard>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

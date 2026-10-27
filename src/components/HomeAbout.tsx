import { motion, useReducedMotion } from 'framer-motion'
import { profileFields } from '../data/profile'
import Badge from './Badge'
import './SelectedWorks.css'
import './HomeAbout.css'

const tools = [
  { en: 'Interface Design', title: '界面设计', apps: [{ name: 'Figma', file: 'figma.svg' }, { name: 'MasterGo', file: 'mastergo.ico' }] },
  { en: 'Visual Design', title: '视觉设计', apps: [{ name: 'Adobe Photoshop', file: 'photoshop.svg' }, { name: 'Adobe Illustrator', file: 'illustrator.svg' }, { name: 'Adobe InDesign', file: 'indesign.svg' }, { name: 'Blender', file: 'blender.svg' }] },
  { en: 'Animation Design', title: '动效设计', apps: [{ name: 'Adobe After Effects', file: 'aftereffects.svg' }, { name: 'Adobe Premiere Pro', file: 'premierepro.svg' }] },
]

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={`home-about-field${wide ? ' home-about-field--wide' : ''}`}><dt>{label}</dt><dd>{value}</dd></div>
}

export default function HomeAbout() {
  const reduce = useReducedMotion()
  const reveal = reduce ? false : { opacity: 0, y: 20 }
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
        <motion.div className="home-about-layout" initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduce ? 0 : .65, ease: [0.22, 1, 0.36, 1] }}>
          <div data-profile-photo className="home-about-portrait" role="img" aria-label="个人照片占位，待提供照片" />
          <div data-profile-details className="home-about-details">
            <div className="home-about-info">
              <Badge as="h3">基本信息</Badge>
              <div className="home-about-fields">
                <dl className="home-about-field-row"><Field label="姓名" value={profileFields.name} /><Field label="所在地" value={profileFields.location} /><Field label="工作经验" value={profileFields.experience} /></dl>
                <dl className="home-about-field-row"><Field label="联系方式" value={profileFields.contact} /><Field label="邮箱" value={profileFields.email} /><Field label="作品站" value={profileFields.website} wide /></dl>
                <dl className="home-about-field-row"><Field label="能力关键词" value={profileFields.keywords} wide /></dl>
              </div>
            </div>
            <div className="home-about-skills">
              <Badge as="h3">专业技能</Badge>
              <div className="home-about-skill-grid">
                {tools.map(skill => (
                  <div data-profile-skill className="home-about-skill" key={skill.en}>
                    <div className="home-about-skill-label"><h4>{skill.en}</h4><p>{skill.title}</p></div>
                    <span className="home-about-skill-divider" aria-hidden="true">/</span>
                    <ul className="home-about-tools" aria-label={`${skill.title}软件`}>
                      {skill.apps.map(app => <li key={app.name} className="home-about-tool" title={app.name}><img src={`${import.meta.env.BASE_URL}images/tools/${app.file}`} alt={app.name} width="36" height="36" loading="lazy" decoding="async" /></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

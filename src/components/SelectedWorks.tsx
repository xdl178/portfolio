import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import PointerGlow from './PointerGlow'
import WorkTag from './WorkTag'
import { works } from '../data/works'
import { useMotionTokens } from '../hooks/useMotionTokens'
import SectionHeading from './SectionHeading'
import './SelectedWorks.css'

const DIRECTIONS: Record<string, string> = {
  ip: 'CHARACTER / VISUAL',
  brand: 'BRAND / INTERACTION',
  ai: 'PRODUCT / WEB',
}

export default function SelectedWorks() {
  const reduceMotion = useReducedMotion()
  const tokens = useMotionTokens()
  const reveal = reduceMotion ? false : { opacity: 0, y: 24 }
  const transition = reduceMotion ? { duration: 0 } : tokens.reveal

  return (
    <section id="work" aria-labelledby="selected-works-title" className="home-section selected-works relative bg-bg">
      <div className="container-home">
        <SectionHeading index="02" en="EXHIBIT" title={<>精选<span className="text-accent">作品</span></>} level="h2" id="selected-works-title" motionProps={{ initial: reveal, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition }} />

        <div className="selected-works-grid">
          {works.map((work, i) => (
            <motion.article key={work.id} className={`selected-work-card group ${i === 2 ? 'selected-work-card--wide' : ''}`} initial={reveal} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ ...transition, delay: reduceMotion ? 0 : (i % 2) * .06 }}>
              <PointerGlow>
                <Link to={`/works/${work.id}`} className="selected-work-link" aria-label={`查看 ${work.title}`}>
                  <img src={work.cover} alt="" loading="lazy" decoding="async" className="selected-work-cover" />
                  <span className="selected-work-scrim" aria-hidden="true" />
                  <div className="selected-work-copy">
                    <div className="selected-work-meta">
                      <span className="selected-work-index" aria-hidden="true">{work.serial}</span>
                      <span className="selected-work-category">{DIRECTIONS[work.category] ?? work.categoryLabel}</span>
                    </div>
                    <div className="selected-work-rule" aria-hidden="true" />
                    <h3>{work.title}</h3>
                  </div>
                  <div className="selected-work-bottom">
                    <ul data-work-tags className="selected-work-tags" aria-label="作品标签">
                      {work.tags.slice(0, 3).map(tag => <WorkTag as="li" key={tag}>{tag}</WorkTag>)}
                    </ul>
                    <span className="selected-work-arrow" aria-hidden="true">
                      <svg data-work-arrow viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                </Link>
              </PointerGlow>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

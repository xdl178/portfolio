import SectionHeader from './SectionHeader'
import SurfaceCard from './SurfaceCard'
import { aboutStrengths, aboutStrengthsIntro } from '../data/about'
import './AboutCapabilities.css'

export default function AboutCapabilities() {
  return (
    <section id="capabilities" data-about-section="strengths" className="container-page about-section about-strengths" aria-label="个人优势">
      <SectionHeader index="03" label="STRENGTHS · 个人优势" title={<><span className="block">CORE</span>{' '}<span className="block text-accent">STRENGTHS.</span></>} action={<p className="about-strengths-intro">{aboutStrengthsIntro}</p>} />
      <ul className="about-strengths-grid" role="list">
        {aboutStrengths.map((item, index) => (
          <SurfaceCard as="li" key={item.no} index={index} glow className="about-strength-card" data-about-strength>
            <div className="about-strength-top"><span className="about-strength-number" aria-hidden="true">{item.no}</span><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div>
            <h3>{item.title}</h3><p className="about-strength-en">{item.titleEn}</p>
            <p className="about-strength-summary">{item.summary}</p>
            <ul className="about-strength-points">{item.points.map(point => <li key={point}>{point}</li>)}</ul>
          </SurfaceCard>
        ))}
      </ul>
    </section>
  )
}

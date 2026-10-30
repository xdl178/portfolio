import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SectionHeading from './SectionHeading'
import './Practice.css'

const projects = [
  { category: '项目方向待补充', title: '项目名称待补充 01', subtitle: '设计目标待补充', description: '项目介绍待补充。可在此填写项目背景、设计过程与交付成果。', tags: '项目标签待补充' },
  { category: '项目方向待补充', title: '项目名称待补充 02', subtitle: '设计目标待补充', description: '项目介绍待补充。可在此填写业务场景、职责范围与协作方式。', tags: '项目标签待补充' },
  { category: '项目方向待补充', title: '项目名称待补充 03', subtitle: '设计目标待补充', description: '项目介绍待补充。可在此填写体验目标、方案思路与复盘总结。', tags: '项目标签待补充' },
]

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Reference-inspired scroll light tree; no fabricated jobs or dates. */
export default function Practice() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const tree = root.current?.querySelector<HTMLElement>('[data-career-tree]')
    if (!tree) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(tree, { '--career-progress': 0 }, {
        '--career-progress': 1,
        ease: 'none',
        scrollTrigger: { trigger: tree, start: 'top 75%', end: 'bottom 55%', scrub: .35, invalidateOnRefresh: true },
      })
      tree.querySelectorAll<HTMLElement>('[data-career-entry]').forEach(entry => {
        gsap.fromTo(entry, { opacity: .2, y: 24 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: entry, start: 'top 90%', end: 'top 62%', scrub: .35 },
        })
      })
    })
    let disposed = false
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; mm.revert() }
  }, { scope: root })

  return (
    <section ref={root} id="practice" aria-labelledby="career-title" className="home-section career-section relative bg-bg">
      <div className="career-container">
        <SectionHeading index="03" en="EXPERIENCE" title={<>工作<span className="text-accent">经验</span></>} level="h2" id="career-title" className="career-header" />
        <div data-career-tree className="career-tree">
          <div className="career-rail" aria-hidden="true">
            <div className="career-rail-fill" />
            <span className="career-tip" />
          </div>
          <ol className="career-entries" aria-label="项目经历">
            {projects.map((item, index) => (
              <li data-career-entry className="career-entry" key={item.title}>
                <div className="career-identity">
                  <div className="career-role">
                    <p className="career-category">{item.category}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="career-sequence" aria-hidden="true">0{index + 1}</span>
                </div>
                <div className="career-description">
                  <h4>{item.subtitle}</h4>
                  <p>{item.description}</p>
                  <p className="career-skills">{item.tags}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

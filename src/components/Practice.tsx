import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import './SelectedWorks.css'
import './Practice.css'

const projects = [
  { category: '公共空间 · 体感交互', title: '深圳前湾公园', subtitle: '让身体成为游戏的交互方式', description: '面向亲子家庭与年轻游客，设计连接户外互动大屏、移动端 H5 与网页端的运动体验。', tags: '游戏 IP / 界面系统 / 动作反馈' },
  { category: '智能体测 · 健康终端', title: '长沙智谷', subtitle: '让复杂体测更易理解', description: '围绕注册、检测和结果查看的完整流程，为自助体测终端建立清晰的引导与反馈机制。', tags: '数据可视化 / 引导动效 / 体验测试' },
  { category: '园区智能体 · 数字服务', title: '北京博大公园', subtitle: '让园区服务触手可及', description: '结合园区导览与信息服务场景，构建跨设备一致的数字化体验。', tags: '服务设计 / 界面规范 / 数字体验' },
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
        <header className="selected-works-heading career-header">
          <span className="selected-works-chapter" aria-hidden="true">03</span>
          <div className="selected-works-heading-copy">
            <span className="selected-works-exhibit" aria-hidden="true">EXPERIENCE</span>
            <div className="selected-works-heading-row"><span className="selected-works-slash" aria-hidden="true">/</span><h2 id="career-title">工作<span className="text-accent">经验</span></h2></div>
          </div>
        </header>
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
        <div className="career-footer"><Link to="/about">了解我的工作方式 <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  )
}

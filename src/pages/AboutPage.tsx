import AboutCapabilities from '../components/AboutCapabilities'
import FooterNavLink from '../components/FooterNavLink'
import Badge from '../components/Badge'
import SectionHeader from '../components/SectionHeader'
import SectionHeading from '../components/SectionHeading'
import SurfaceCard from '../components/SurfaceCard'
import { aboutContact, aboutIntro, aboutMetrics, aboutStatement } from '../data/about'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <div data-about-page className="about-page relative min-h-[100dvh] bg-bg pb-28 pt-32 md:pb-44 md:pt-40">
      <div className="container-page">
        <div data-about-header>
          <div className="flex flex-wrap items-center justify-between gap-4"><Badge>Designer · 2026</Badge></div>
          <h1 id="about-page-title" className="mt-10 whitespace-nowrap text-center text-[clamp(2.8rem,11vw,8.4rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text-primary">关于<span className="text-gradient">我</span></h1>
          <div className="mt-14 grid gap-10 border-b border-paper/15 pb-14 md:mt-16 md:grid-cols-12 md:items-end md:gap-14 md:pb-16">
            <div data-about-intro className="md:col-span-7">
              <SectionHeading index="01" en="INTRO" title={<>章节<span className="text-accent">导读</span></>} level="h2" id="about-intro-title" />
              {aboutIntro.map(paragraph => <p className="mt-6 max-w-[52ch] text-base leading-8 text-muted" key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="grid grid-cols-2 gap-3 md:col-span-5" aria-label="个人经历概览">
              {aboutMetrics.map((stat, index) => <SurfaceCard data-about-stat key={stat.tag} index={index}>
                <span data-stat-tag className="block text-right font-mono text-xs leading-[18px] tracking-[0.14em] text-muted">{stat.tag}</span>
                <p data-stat-value className="mt-2 font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none text-text-primary">{stat.value}{stat.suffix && <span className="ml-1 text-sm">{stat.suffix}</span>}</p>
                <p data-stat-label className="mt-3 text-balance text-xs leading-5 text-muted">{stat.label}</p>
              </SurfaceCard>)}
            </div>
          </div>
        </div>

        <section className="about-section about-statement" aria-label="个人宣言">
          <SurfaceCard glow className="about-statement-card">
            <div className="about-statement-meta"><Badge>Statement</Badge><span className="about-statement-label">Designer’s Statement · 个人宣言</span></div>
            <h2>{aboutStatement.title}</h2><p>{aboutStatement.text}</p>
          </SurfaceCard>
        </section>

      </div>

      <AboutCapabilities />

      <section data-about-section="contact" className="container-page about-section" aria-label="个人联系方式">
        <SectionHeader index="03" en="CONTACT" title={<>个人<span className="text-accent">联系方式</span></>} id="about-contact-title" subtitle="随时欢迎交流设计、项目合作与工作机会" />
        <div className="about-contact-grid">
          <div className="about-contact-intro">
            <p>{aboutContact.intro}</p>
            <FooterNavLink to="/works" label="浏览我的作品集" className="about-browse" />
            <dl className="about-location-grid">
              {[{label:'Location · 现居城市',value:aboutContact.location,detail:aboutContact.locationDetail},{label:'Availability · 入职时间',value:aboutContact.availability,detail:aboutContact.availabilityDetail}].map((item, index)=><SurfaceCard key={item.label} index={index} className="about-location-card"><dt className="about-meta">{item.label}</dt><dd>{item.value}<span className="about-location-detail">{item.detail}</span></dd></SurfaceCard>)}
            </dl>
          </div>
          <div className="about-contact-channels">
            {[{label:'01 · EMAIL',title:'邮箱联系',value:aboutContact.email},{label:'02 · PHONE',title:'电话联系',value:aboutContact.phoneDisplay}].map((channel,index)=><SurfaceCard glow key={channel.label} index={index} className="about-contact-channel">
              <div className="about-contact-target">
                <span className="about-meta">{channel.label}</span><h3>{channel.title}</h3><p className="about-contact-value">{channel.value}</p>
              </div>
            </SurfaceCard>)}
            <SurfaceCard glow data-about-contact-info className="about-contact-info" index={2}>
              <p className="about-meta">03 · SOCIAL / INFO</p><h3>更多信息</h3>
              <dl>{aboutContact.info.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
              <p className="about-contact-response">{aboutContact.response}</p>
            </SurfaceCard>
          </div>
        </div>
      </section>
    </div>
  )
}

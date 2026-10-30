import AboutCapabilities from '../components/AboutCapabilities'
import ActionButton from '../components/ActionButton'
import Badge from '../components/Badge'
import SectionHeader from '../components/SectionHeader'
import SurfaceCard from '../components/SurfaceCard'
import WorkTag from '../components/WorkTag'
import { aboutAwards, aboutContact, aboutIntro, aboutMetrics, aboutStatement } from '../data/about'
import { scrollToContact } from '../utils/scrollToContact'
import './AboutPage.css'

const Arrow = () => <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>

export default function AboutPage() {
  return (
    <div data-about-page className="about-page relative min-h-[100dvh] bg-bg pb-28 pt-32 md:pb-44 md:pt-40">
      <div className="container-page">
        <header data-about-header>
          <div className="flex flex-wrap items-center justify-between gap-4"><Badge>Designer · 2026</Badge></div>
          <h1 className="mt-10 whitespace-nowrap text-center text-[clamp(2.8rem,11vw,8.4rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text-primary">关于<span className="text-gradient">我</span></h1>
          <div className="mt-14 grid gap-10 border-b border-paper/15 pb-14 md:mt-16 md:grid-cols-12 md:items-end md:gap-14 md:pb-16">
            <div data-about-intro className="md:col-span-7">
              <div className="flex items-center gap-4"><span aria-hidden="true" className="font-mono text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-muted">01</span><span aria-hidden="true" className="h-px w-10 bg-paper/25" /><span className="type-label text-xs text-muted">Intro · 章节导读</span></div>
              {aboutIntro.map(paragraph => <p className="mt-6 max-w-[52ch] text-base leading-8 text-muted" key={paragraph}>{paragraph}</p>)}
              <ActionButton variant="text" onClick={scrollToContact} className="mt-6">聊聊你的项目</ActionButton>
            </div>
            <div className="grid grid-cols-2 gap-3 md:col-span-5" aria-label="个人经历概览">
              {aboutMetrics.map((stat, index) => <SurfaceCard data-about-stat key={stat.tag} index={index}>
                <span data-stat-tag className="block text-right font-mono text-xs leading-[18px] tracking-[0.14em] text-muted">{stat.tag}</span>
                <p data-stat-value className="mt-2 font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none text-text-primary">{stat.value}{stat.suffix && <span className="ml-1 text-sm">{stat.suffix}</span>}</p>
                <p data-stat-label className="mt-3 text-balance text-xs leading-5 text-muted">{stat.label}</p>
              </SurfaceCard>)}
            </div>
          </div>
        </header>

        <section className="about-section about-statement" aria-label="个人宣言">
          <SurfaceCard glow className="about-statement-card">
            <div className="about-statement-meta"><Badge>Statement</Badge><span className="about-statement-label">Designer’s Statement · 个人宣言</span></div>
            <h2>{aboutStatement.title}</h2><p>{aboutStatement.text}</p>
          </SurfaceCard>
        </section>

        <section data-about-section="awards" className="about-section" aria-label="个人获奖经历">
          <SectionHeader index="02" label="AWARDS & HONORS · 个人获奖经历" title={<>AWARDS<span className="text-accent">.</span></>} subtitle={`共 ${aboutAwards.length} 项重要设计奖项 · 国家级 × 国际`} />
          <ul className="about-awards-grid" role="list">
            {aboutAwards.map((award, index) => <SurfaceCard as="li" glow data-about-award key={award.no} index={index} className="about-award-card">
              <div className="about-award-top"><span className="about-award-number" aria-hidden="true">{award.no}</span><WorkTag>{award.tier}</WorkTag></div>
              <h3>{award.name}</h3>
              <div className="about-award-organization"><p className="about-meta">Awarded by · 主办单位</p><p>{award.org}</p></div>
              <div className="about-award-footer"><span>{award.date}</span><Badge>Honored</Badge></div>
            </SurfaceCard>)}
          </ul>
        </section>
      </div>

      <AboutCapabilities />

      <section data-about-section="contact" className="container-page about-section" aria-label="个人联系方式">
        <SectionHeader index="04" label="CONTACT · 个人联系方式" title={<>LET’S <span className="text-accent">TALK.</span></>} subtitle="随时欢迎交流设计、项目合作与工作机会" />
        <div className="about-contact-grid">
          <div className="about-contact-intro">
            <p>{aboutContact.intro}</p>
            <ActionButton as="link" to="/works" size="regular" className="about-browse">浏览我的作品集</ActionButton>
            <dl className="about-location-grid">
              {[{label:'Location · 现居城市',value:aboutContact.location,detail:aboutContact.locationDetail},{label:'Availability · 入职时间',value:aboutContact.availability,detail:aboutContact.availabilityDetail}].map((item, index)=><SurfaceCard key={item.label} index={index} className="about-location-card"><dt className="about-meta">{item.label}</dt><dd>{item.value}<span className="about-location-detail">{item.detail}</span></dd></SurfaceCard>)}
            </dl>
          </div>
          <div className="about-contact-channels">
            {[{label:'01 · EMAIL',title:'邮箱联系',value:aboutContact.email,href:`mailto:${aboutContact.email}`,action:'点击发送邮件 · SEND MAIL'},{label:'02 · PHONE',title:'电话联系',value:aboutContact.phoneDisplay,href:`tel:${aboutContact.phone}`,action:'点击直接拨打 · CALL ME'}].map((channel,index)=><SurfaceCard glow key={channel.label} index={index} className="about-contact-channel">
              <a className="about-contact-target" href={channel.href}>
                <span className="about-meta">{channel.label}</span><h3>{channel.title}</h3><p className="about-contact-value">{channel.value}</p>
                <span className="about-contact-link-footer"><span>{channel.action}</span><Arrow /></span>
              </a>
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

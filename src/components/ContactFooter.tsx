import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLocation } from 'react-router-dom'
import { profileFields, profileLinks } from '../data/profile'
import type { ContactChannel } from '../utils/contactChannels'
import { scrollToContact } from '../utils/scrollToContact'
import BackToTop from './BackToTop'
import Badge from './Badge'
import FooterNavLink from './FooterNavLink'
import { useMotionTokens } from '../hooks/useMotionTokens'
import './ContactFooter.css'

function ChannelIcon({ id }: { id: ContactChannel['id'] }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {id === 'email' ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></> : id === 'phone' ? <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" /> : <><path d="M14 3h7v7m0-7L10 14" /><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>}
  </svg>
}

export default function ContactFooter() {
  const reduce = useReducedMotion()
  const tokens = useMotionTokens()
  const { pathname } = useLocation()
  const channels = [
    { id: 'email', label: 'Email', value: profileFields.email },
    { id: 'phone', label: 'Phone', value: profileFields.contact },
    { id: 'behance', label: 'Behance', value: profileLinks.behance || 'Behance 主页待补充' },
  ] as const
  const backTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' })
  const reveal = reduce ? false : { opacity: 0, transform: 'translateY(24px)' }
  const visible = { opacity: 1, transform: 'none' }

  return (
    <footer id="footer-sec" className="contact-footer" aria-labelledby="footer-title">
      <div className="contact-footer-inner">
        <motion.div className="contact-footer-cta" data-footer-reveal initial={reveal} whileInView={visible} viewport={{ once: true, amount: .2 }} transition={tokens.footer}>
          <Badge className="contact-footer-badge">视觉 · 界面 · 动效</Badge>
          <h2 id="footer-title" className="contact-footer-title type-h2">Let's create something amazing together</h2>
          <p className="contact-footer-description type-body">Open to full-time roles, freelance projects, and creative collaborations.</p>
          <nav aria-label="页脚导航" className="contact-footer-nav">
            <FooterNavLink label="首页" to="/" onClick={() => { if (pathname === '/') backTop() }} />
            <FooterNavLink label="精选作品" to="/works" />
            <FooterNavLink label="关于我" to="/about" />
            <FooterNavLink label="联系" onClick={scrollToContact} />
          </nav>
        </motion.div>
        <motion.section id="footer-channels" className="contact-footer-channels" aria-label="联系通道" tabIndex={-1} data-footer-reveal initial={reveal} whileInView={visible} viewport={{ once: true, amount: .2 }} transition={{ ...tokens.footer, delay: .08 }}>
          <h3 id="footer-channels-title" className="sr-only">联系通道</h3>
          <div className="contact-grid" role="list" aria-labelledby="footer-channels-title">
            {channels.map(channel => <div key={channel.id} data-footer-channel className="contact-item" role="listitem">
              <span className="contact-icon"><ChannelIcon id={channel.id} /></span>
              <div className="contact-info"><span className="contact-label">{channel.label}</span><span className="contact-value">{channel.value}</span></div>
            </div>)}
          </div>
        </motion.section>
        <p className="contact-footer-copyright">© {new Date().getFullYear()} DESIGN PORTFOLIO · ALL RIGHTS RESERVED</p>
      </div>
      <BackToTop onClick={backTop} />
    </footer>
  )
}

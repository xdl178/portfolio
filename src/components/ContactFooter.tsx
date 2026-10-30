import { useState, type FocusEvent, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Link, useLocation } from 'react-router-dom'
import { profileFields, profileLinks } from '../data/profile'
import type { ContactChannel } from '../utils/contactChannels'
import { scrollToContact } from '../utils/scrollToContact'
import BackToTop from './BackToTop'
import Badge from './Badge'
import { useMotionTokens } from '../hooks/useMotionTokens'
import './ContactFooter.css'

function ChannelIcon({ id }: { id: ContactChannel['id'] }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {id === 'email' ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></> : id === 'phone' ? <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" /> : <><path d="M14 3h7v7m0-7L10 14" /><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>}
  </svg>
}

// Stefan H reference: three whole rows, opposite vertical travel, no stagger.
const navSpring = { type: 'spring' as const, stiffness: 500, damping: 60, mass: 1 }
const navRows = [0, 1, 2] as const
const twoRows = '-66.666667%'

function FooterNavItem({ label, to, onClick, reduce, canHover }: {
  label: string; to?: string; onClick?: () => void; reduce: boolean; canHover: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = !reduce && canHover && (hovered || focused)
  const transition = reduce ? { duration: 0 } : navSpring
  const props = {
    className: 'footer-nav-link',
    'aria-label': label,
    onClick,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHovered(true) },
    onPointerLeave: () => setHovered(false),
    onPointerDown: () => setFocused(false),
    onFocus: (event: FocusEvent<HTMLElement>) => setFocused(event.currentTarget.matches(':focus-visible')),
    onBlur: () => setFocused(false),
  }
  const content = <>
    <span className="footer-nav-roll footer-nav-text" aria-hidden="true">
      <motion.span className="footer-nav-track" initial={false} animate={{ y: active ? twoRows : '0%' }} transition={transition}>
        {navRows.map(row => <span key={row} className="footer-nav-copy" data-nav-copy={row === 0 ? 'base' : 'duplicate'}>{label}</span>)}
      </motion.span>
    </span>
    <span className="footer-nav-roll footer-nav-arrow" aria-hidden="true">
      <motion.span className="footer-nav-track" initial={false} animate={{ y: active ? '0%' : twoRows }} transition={transition}>
        {navRows.map(row => <span key={row} className="footer-nav-copy" data-nav-copy={row === 2 ? 'base' : 'duplicate'}><svg viewBox="0 0 256 256" focusable="false"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" /></svg></span>)}
      </motion.span>
    </span>
  </>
  return to ? <Link {...props} to={to}>{content}</Link> : <button {...props} type="button">{content}</button>
}

export default function ContactFooter() {
  const reduce = useReducedMotion()
  const canHover = !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches
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
            <FooterNavItem label="首页" to="/" reduce={reduce} canHover={canHover} onClick={() => { if (pathname === '/') backTop() }} />
            <FooterNavItem label="精选作品" to="/works" reduce={reduce} canHover={canHover} />
            <FooterNavItem label="关于我" to="/about" reduce={reduce} canHover={canHover} />
            <FooterNavItem label="联系" reduce={reduce} canHover={canHover} onClick={scrollToContact} />
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

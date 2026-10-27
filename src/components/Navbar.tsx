import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/works', label: '精选作品' },
  { to: '/about', label: '关于我' },
] as const

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 80))
  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      <nav aria-label="主导航" data-scrolled={scrolled} className="glass glass-nav inline-flex items-center gap-1 rounded-full p-1.5 pl-2">
        <Link to="/" aria-label="返回首页" className="group relative h-9 w-9 flex-none rounded-full transition-transform duration-300 hover:scale-110">
          <span aria-hidden="true" className="grad-accent absolute inset-0 rounded-full transition-transform duration-500 group-hover:rotate-180" />
          <span aria-hidden="true" className="absolute inset-[1.5px] grid place-items-center rounded-full bg-bg"><span className="font-mono text-[11px] font-semibold tracking-wider text-text-primary">XD</span></span>
        </Link>
        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-paper/10 sm:block" />
        <ul className="flex items-center">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} aria-current={isActive(link.to) ? 'page' : undefined} className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-xs transition-colors duration-200 sm:px-4 sm:text-[13px] ${isActive(link.to) ? 'text-text-primary' : 'text-muted hover:text-text-primary'}`}>
                {isActive(link.to) && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-paper/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative z-10">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-paper/10 sm:block" />
        <a href="mailto:3112516515@qq.com" className="btn btn-outline whitespace-nowrap px-3 py-2 text-xs sm:px-4 sm:text-[13px]">联系我 <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  )
}

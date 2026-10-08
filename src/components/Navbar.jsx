import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, navLinks } from '../data/content.js'
import { useLenis } from '../hooks/useSmoothScroll.jsx'

/** 品牌 Logo：渐变方块 + 文字 */
function Logo({ onNavigate }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${profile.name} 首页`} onClick={onNavigate}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-mono text-meta font-bold text-white shadow-brand-soft transition-transform duration-300 group-hover:scale-105">
        {profile.logoText}
      </span>
      <span className="font-display text-body font-semibold tracking-tight text-ink">
        {profile.name}
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const lenis = useLenis()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 移动端菜单的收起统一在点击处理里做（不放进 effect，避免多余的一次渲染）
  const closeMenu = () => setOpen(false)

  const go = (link) => {
    setOpen(false)
    if (link.type === 'route') {
      navigate(link.to)
      lenis?.scrollTo(0, { duration: 1 })
      return
    }
    // 锚点：先回到首页，再滚到目标区块
    const id = link.to.split('#')[1]
    const scrollToId = () => {
      if (lenis) lenis.scrollTo(`#${id}`, { offset: -88, duration: 1.2 })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(scrollToId, 120)
    } else {
      scrollToId()
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full border-b transition-all duration-500 ease-out-expo ${
          scrolled
            ? 'border-line-soft bg-white/80 shadow-nav backdrop-blur-xl'
            : 'border-transparent bg-white/0'
        }`}
      >
        <nav className="container flex h-[76px] items-center justify-between">
          <Logo onNavigate={closeMenu} />

          {/* 桌面端导航 */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active =
                link.type === 'route' &&
                (link.to === '/' ? location.pathname === '/' && !location.hash : location.pathname === link.to)
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => go(link)}
                  className={`relative rounded-pill px-4 py-2 text-body-sm transition-colors ${
                    active ? 'text-brand' : 'text-slate-soft hover:text-ink-2'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-pill bg-brand-soft"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.contact.email}`}
              className="btn-primary hidden !px-5 !py-2.5 md:inline-flex"
            >
              联系我
            </a>

            {/* 移动端汉堡 */}
            <button
              type="button"
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink-2 md:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${
                    open ? 'top-1/2 rotate-45' : 'top-0.5'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-current transition-all duration-300 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${
                    open ? 'top-1/2 -rotate-45' : 'bottom-0.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.div>

      {/* 移动端下拉面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-4 mt-2 overflow-hidden rounded-card border border-line bg-white/95 p-2 shadow-card backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => go(link)}
                className="block w-full rounded-xl px-4 py-3 text-left text-body text-ink-2 transition-colors hover:bg-wash hover:text-brand"
              >
                {link.label}
              </button>
            ))}
            <a
              href={`mailto:${profile.contact.email}`}
              className="mt-1 block rounded-xl bg-brand px-4 py-3 text-center text-body font-medium text-white"
            >
              联系我
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

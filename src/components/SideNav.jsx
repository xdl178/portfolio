import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, profile } from '../data/content.js'
import { useLenis } from '../hooks/useSmoothScroll.jsx'

/**
 * 侧边导航：桌面端固定在右侧的竖排章节指示器。
 * 滚动时高亮当前区块（首页用 id 监听，其它页面按路由高亮）。
 */
export default function SideNav() {
  const [active, setActive] = useState('')
  const [visible, setVisible] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const lenis = useLenis()

  const sectionIds = navLinks.filter((l) => l.type === 'anchor').map((l) => l.to.split('#')[1])
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 监听首页各区块的可见性，决定高亮项
  useEffect(() => {
    if (!isHome) {
      const current = navLinks.find((l) => l.type === 'route' && l.to === location.pathname)
      setActive(current ? current.label : '')
      return undefined
    }

    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!targets.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) {
          const link = navLinks.find((l) => l.to.endsWith(`#${hit.target.id}`))
          if (link) setActive(link.label)
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] },
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, location.pathname])

  const go = (link) => {
    if (link.type === 'route') {
      navigate(link.to)
      lenis?.scrollTo(0, { duration: 1 })
      return
    }
    const id = link.to.split('#')[1]
    if (!isHome) {
      navigate('/')
      setTimeout(() => lenis?.scrollTo(`#${id}`, { offset: -88, duration: 1.2 }), 140)
    } else {
      lenis?.scrollTo(`#${id}`, { offset: -88, duration: 1.2 })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
          aria-label="章节导航"
        >
          <ul className="flex flex-col items-end gap-3">
            {navLinks.map((link) => {
              const isActive = active === link.label
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => go(link)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-center gap-3"
                  >
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ${
                        isActive
                          ? 'text-brand opacity-100'
                          : 'text-slate-faint opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {link.label}
                    </span>
                    <span
                      className={`block rounded-full transition-all duration-400 ease-out-expo ${
                        isActive
                          ? 'h-[2px] w-7 bg-brand'
                          : 'h-[2px] w-3.5 bg-line group-hover:w-5 group-hover:bg-brand-line'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 text-right">
            <span className="font-mono text-[10px] text-slate-faint">{profile.name}</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

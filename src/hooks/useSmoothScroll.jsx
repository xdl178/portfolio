import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'

const LenisContext = createContext(null)

/**
 * 全站平滑滚动（Lenis）。
 * 同时负责 #锚点 的平滑跳转：HashRouter 下锚点不能用原生 behavior:'smooth'，
 * 必须交给 Lenis 接管，否则会跳变。
 *
 * 实例同时挂到 window.__lenis，方便非 React 代码（滚动进度条、回到顶部）复用。
 */
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let instance = null
    if (!prefersReduced) {
      instance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      const raf = (time) => {
        instance.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)
      window.__lenis = instance
      setLenis(instance)
    }

    // 锚点点击统一交给 Lenis（HashRouter 下原生平滑滚动不生效）
    const onAnchorClick = (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null
      if (!a) return
      const hash = a.getAttribute('href')
      // 只有真正的页内锚点（#about 这种）才拦截；#/works 这种路由链接放行
      if (!hash || hash.length < 2 || hash.startsWith('#/')) return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      if (instance) instance.scrollTo(el, { offset: -88, duration: 1.2 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (instance) {
        instance.destroy()
        delete window.__lenis
      }
      setLenis(null)
    }
  }, [])

  // hash 变化时滚到对应区块（例如 /#about）
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      const idx = hash.indexOf('#', 1)
      if (idx === -1) return
      const id = hash.slice(idx + 1)
      if (!id) return
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (!el) return
        if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.2 })
        else el.scrollIntoView({ behavior: 'smooth' })
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** 组件里拿到 Lenis 实例做自定义滚动，例如 lenis.scrollTo(el) */
export function useLenis() {
  return useContext(LenisContext)
}

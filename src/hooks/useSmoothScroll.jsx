import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'

const LenisContext = createContext(null)

/**
 * 全站平滑滚动（Lenis）。
 * 同时负责 #锚点 的平滑跳转：HashRouter 下锚点不能用原生 behavior:'smooth'，
 * 必须交给 Lenis 接管，否则会跳变。
 */
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // 用户系统里开了「减少动态效果」就不启用平滑滚动，尊重可访问性设置
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return undefined

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const raf = (time) => {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)
    setLenis(instance)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // hash 变化时滚到对应区块（例如 /#about）
  useEffect(() => {
    if (!lenis) return undefined

    const scrollToHash = () => {
      const hash = window.location.hash
      const idx = hash.indexOf('#', 1)
      if (idx === -1) return
      const id = hash.slice(idx + 1)
      if (!id) return
      // 等路由把目标区块渲染出来
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) lenis.scrollTo(el, { offset: -88, duration: 1.2 })
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

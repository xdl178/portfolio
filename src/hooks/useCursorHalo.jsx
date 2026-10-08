import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * GSAP 自定义光标跟随（CursorHalo）
 * ------------------------------------------------------------
 * 两个元素：
 *   1. 中心实心点  —— 用 gsap.set 立即跟随，无延迟，保证点击手感精准
 *   2. 外圈光晕环  —— 用 gsap.quickTo 做带缓动的跟随，产生"拖尾"感
 *
 * 交互增强：悬停到 a / button / [data-cursor] 上时，光晕放大并显形；
 * 按下鼠标时整体缩小，形成按压反馈。
 *
 * 只在「有精确指针」的设备上启用（桌面 / 触控板），触屏设备自动跳过。
 * 元素带 data-cursor="off"，CSS 里会据此隐藏系统光标。
 */
export function useCursorHalo() {
  const dotRef = useRef(null)
  const haloRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(any-pointer: fine)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || prefersReduced) return undefined

    const dot = dotRef.current
    const halo = haloRef.current
    if (!dot || !halo) return undefined

    document.documentElement.classList.add('cursor-halo-active')

    gsap.set([dot, halo], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dotX = gsap.quickSetter(dot, 'x', 'px')
    const dotY = gsap.quickSetter(dot, 'y', 'px')
    const haloX = gsap.quickTo(halo, 'x', { duration: 0.55, ease: 'power3' })
    const haloY = gsap.quickTo(halo, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e
      dotX(x)
      dotY(y)
      haloX(x)
      haloY(y)
      if (!visible) {
        visible = true
        gsap.to([dot, halo], { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }
    }

    const onEnterWindow = () => gsap.to([dot, halo], { opacity: 1, duration: 0.25 })
    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, halo], { opacity: 0, duration: 0.25 })
    }

    // 悬停可交互元素时放大光晕
    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target.closest('a, button, [data-cursor="hover"]') : null
      if (target) {
        gsap.to(halo, {
          scale: 2.1,
          backgroundColor: 'rgba(77,107,254,0.14)',
          borderColor: 'rgba(77,107,254,0.55)',
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(dot, { scale: 0.45, duration: 0.3, ease: 'power3.out' })
      } else {
        gsap.to(halo, {
          scale: 1,
          backgroundColor: 'rgba(77,107,254,0.08)',
          borderColor: 'rgba(77,107,254,0.30)',
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power3.out' })
      }
    }

    const onDown = () => gsap.to([dot, halo], { scale: 0.78, duration: 0.18, ease: 'power2.out' })
    const onUp = () => gsap.to([dot, halo], { scale: 1, duration: 0.25, ease: 'power2.out' })

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseenter', onEnterWindow)
    window.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      document.documentElement.classList.remove('cursor-halo-active')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseenter', onEnterWindow)
      window.removeEventListener('mouseleave', onLeaveWindow)
      gsap.killTweensOf([dot, halo])
    }
  }, [])

  return { dotRef, haloRef }
}

/** 光晕本体，挂在 App 根部，fixed 定位、不吃鼠标事件 */
export function CursorHalo({ dotRef, haloRef }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true" data-cursor="off">
      <div
        ref={haloRef}
        data-cursor="off"
        className="fixed left-0 top-0 h-10 w-10 rounded-full border border-brand/30 bg-brand/[0.08]"
      />
      <div
        ref={dotRef}
        data-cursor="off"
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-brand"
      />
    </div>
  )
}

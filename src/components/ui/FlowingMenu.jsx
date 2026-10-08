import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

import './FlowingMenu.css'

/* ============================================================
   FlowingMenu · 流动菜单
   - 每一行是一条可点击导航项，静态时是三层信息：
     主标题 / 副标题（角色·周期）/ 标签
   - 鼠标从行内偏上还是偏下的位置进入，决定跑马灯覆盖层
     从上沿或下沿切入；hover 期间内容无缝横向流动，移出时从原侧滑走
   - 覆盖层底色取 item.accent（默认科技青），文字用主题墨蓝黑保证对比度；
     图片缺省时渲染品牌蓝→科技青的渐变药丸占位
   - 无障碍：锚点本身可 Tab 聚焦，聚焦时同样展开覆盖层；
     尊重 prefers-reduced-motion（不自动流动、切换即时完成）
   ============================================================ */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** 距离平方，用来判断鼠标更靠近上沿还是下沿（省一次开方） */
function distMetric(x, y, x2, y2) {
  const xDiff = x - x2
  const yDiff = y - y2
  return xDiff * xDiff + yDiff * yDiff
}

/** 鼠标位置更靠近哪条边，决定覆盖层从哪一侧切入 */
function findClosestEdge(mouseX, mouseY, width, height) {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0)
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height)
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
}

/** 监听系统「减少动态效果」偏好，随时切换 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(REDUCED_MOTION_QUERY).matches
      : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mql = window.matchMedia(REDUCED_MOTION_QUERY)
    const handleChange = (event) => setReduced(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

function FlowingMenu({
  items = [],
  speed = 14,
  textColor = '#0B1220',
  bgColor = '#FFFFFF',
  borderColor = '#E2E8F0',
}) {
  return (
    <div className="flowing-menu menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  )
}

function MenuItem({
  link = '#',
  text,
  subtitle,
  tags = [],
  image,
  accent = '#00C2FF',
  speed,
  textColor,
  borderColor,
}) {
  const itemRef = useRef(null)
  const marqueeRef = useRef(null)
  const marqueeInnerRef = useRef(null)
  const animationRef = useRef(null)
  const [repetitions, setRepetitions] = useState(4)
  const reducedMotion = usePrefersReducedMotion()

  // 减少动态效果时，切入/切出都瞬时完成
  const animationDefaults = { duration: reducedMotion ? 0 : 0.6, ease: 'expo' }

  // 跑马灯配色：底色取 item.accent，文字用主题墨蓝黑
  const marqueeBgColor = accent
  const marqueeTextColor = '#0B1220'

  // 重复份数：至少铺满一屏，横向流动才不会露白
  useEffect(() => {
    const inner = marqueeInnerRef.current
    const calculateRepetitions = () => {
      if (!inner) return
      const marqueeContent = inner.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / Math.max(contentWidth, 1)) + 2
      setRepetitions((prev) => (prev === Math.max(4, needed) ? prev : Math.max(4, needed)))
    }

    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)

    // 容器自身尺寸变化（侧栏收放、字号切换）也要重算
    let observer
    if (typeof ResizeObserver !== 'undefined' && inner) {
      observer = new ResizeObserver(calculateRepetitions)
      observer.observe(inner)
    }

    return () => {
      window.removeEventListener('resize', calculateRepetitions)
      if (observer) observer.disconnect()
    }
  }, [text, image])

  // 横向无限流动
  useEffect(() => {
    if (reducedMotion) {
      if (animationRef.current) {
        animationRef.current.kill()
        animationRef.current = null
      }
      if (marqueeInnerRef.current) gsap.set(marqueeInnerRef.current, { x: 0 })
      return undefined
    }

    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return
      if (animationRef.current) animationRef.current.kill()
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      })
    }

    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
        animationRef.current = null
      }
    }
  }, [text, image, repetitions, speed, reducedMotion])

  /** 展开 / 收起覆盖层；不传事件时（键盘聚焦）按行中心判断方向 */
  const animateOverlay = (ev, show) => {
    const item = itemRef.current
    const marquee = marqueeRef.current
    const inner = marqueeInnerRef.current
    if (!item || !marquee || !inner) return

    const rect = item.getBoundingClientRect()
    const hasPointer =
      ev && typeof ev.clientX === 'number' && typeof ev.clientY === 'number'
    const x = hasPointer ? ev.clientX - rect.left : rect.width / 2
    const y = hasPointer ? ev.clientY - rect.top : rect.height / 2
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    const offset = edge === 'top' ? '-101%' : '101%'
    const innerOffset = edge === 'top' ? '101%' : '-101%'
    const timeline = gsap.timeline({ defaults: animationDefaults })

    if (show) {
      timeline
        .set(marquee, { y: offset }, 0)
        .set(inner, { y: innerOffset }, 0)
        .to([marquee, inner], { y: '0%' }, 0)
    } else {
      timeline.to(marquee, { y: offset }, 0).to(inner, { y: innerOffset }, 0)
    }
  }

  const handleMouseEnter = (ev) => animateOverlay(ev, true)
  const handleMouseLeave = (ev) => animateOverlay(ev, false)
  // 键盘 Tab 聚焦时同样展开，避免只有鼠标可用
  const handleFocus = () => animateOverlay(null, true)
  const handleBlur = () => animateOverlay(null, false)

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ color: textColor }}
      >
        <span className="menu__item-title">{text}</span>
        {subtitle && <span className="menu__item-sub">{subtitle}</span>}
        {tags.length > 0 && (
          <span className="menu__item-tags">
            {tags.map((t) => (
              <span key={t} className="menu__item-tag" style={{ borderColor }}>
                {t}
              </span>
            ))}
          </span>
        )}
      </a>

      <div
        className="marquee"
        ref={marqueeRef}
        aria-hidden="true"
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef}>
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div
                  className="marquee__img"
                  style={image ? { backgroundImage: `url("${image}")` } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowingMenu

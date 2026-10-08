import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'

import './AccordionGallery.css'

/* 没有图片时的默认条目：只给标签，画面由 CSS 冷色渐变兜底 */
const DEFAULT_ITEMS = [
  { label: 'Canyon', link: '#' },
  { label: 'Ridgeline', link: '#' },
  { label: 'Falls', link: '#' },
  { label: 'Harbour', link: '#' },
  { label: 'Skyline', link: '#' },
]

/* 冷色渐变占位，保证每块面板都不一样，且不依赖任何外部图片 */
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #4D6BFE 0%, #00C2FF 100%)',
  'linear-gradient(135deg, #2440CC 0%, #7C4DFF 100%)',
  'linear-gradient(135deg, #00C2FF 0%, #4D6BFE 100%)',
  'linear-gradient(135deg, #7C4DFF 0%, #4D6BFE 100%)',
  'linear-gradient(135deg, #3A55E8 0%, #00C2FF 100%)',
]

/**
 * AccordionGallery —— 可展开的手风琴图片画廊
 *
 * 行为：
 *   - GSAP 时间轴同时驱动 flexGrow（当前项放大）、非当前项的透视旋转（tilt）、
 *     图片视差位移（parallax）、灰度/压暗以及标签条 + 文字的淡入。
 *   - ResizeObserver 监听容器尺寸，实时重算可视媒体宽度并重新布局。
 *   - 键盘：左右 / 上下方向键在面板间循环切换（tabIndex 可聚焦，focus 即激活）。
 *   - orientation="vertical" 时改为纵向排列、按 rotateX 倾斜、纵向视差。
 *   - prefers-reduced-motion: reduce 时所有补间时长归零，只做状态切换。
 *
 * props（与参考实现保持一致）：
 *   items, defaultIndex, accentColor, overlayColor, textColor, height, gap, radius,
 *   expandRatio, orientation, duration, ease, parallax, tilt, stagger, trigger,
 *   showLabels, grayscale, className
 */
const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  accentColor = '#4D6BFE',
  overlayColor = '#0B1220',
  textColor = '#FFFFFF',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
}) => {
  const rootRef = useRef(null)
  const panelRefs = useRef([])
  const mediaRefs = useRef([])
  const barRefs = useRef([])
  const textRefs = useRef([])
  const tlRef = useRef(null)
  const firstRunRef = useRef(true)
  const mediaSizeRef = useRef(320)

  const vertical = orientation === 'vertical'
  const count = items.length
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)))

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const applyLayout = useCallback(
    (animate) => {
      const panels = panelRefs.current
      if (!panels.length) return

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9)
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1
      const mediaSize = mediaSizeRef.current

      tlRef.current?.kill()
      const dur = animate && !prefersReduced ? duration : 0
      const tl = gsap.timeline()

      panels.forEach((panel, i) => {
        if (!panel) return
        const isActive = i === active
        const media = mediaRefs.current[i]
        const bar = barRefs.current[i]
        const text = textRefs.current[i]

        const rot = isActive ? 0 : i < active ? tilt : -tilt
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot }

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0)

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i))
          const shift = drift * parallax * mediaSize * 0.06
          const gray = grayscale ? (isActive ? 0 : 1) : 0
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0
          )
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0)
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0)
          }
        }
      })

      tlRef.current = tl
    },
    [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger, prefersReduced]
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    /* 容器尺寸变化时重新量算媒体尺寸（取当前展开列宽作为基准） */
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = vertical ? rect.height : rect.width
      const usable = Math.max(total - gap * (count - 1), 120)
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22)
      mediaSizeRef.current = size
      el.style.setProperty('--ag-media-size', `${size}px`)
      applyLayout(!firstRunRef.current)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [applyLayout, gap, count, expandRatio, vertical])

  useEffect(() => {
    applyLayout(!firstRunRef.current)
    firstRunRef.current = false
  }, [applyLayout])

  useEffect(
    () => () => {
      tlRef.current?.kill()
    },
    []
  )

  const handleEnter = (i) => {
    if (trigger === 'hover') setActive(i)
  }

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault()
      setActive(i)
    }
  }

  /* 方向键在面板间循环切换，横向纵向都同时接受 ←→ 与 ↑↓ */
  const handleKeyDown = (i, e) => {
    if (count < 2) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i + 1) % count)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i - 1 + count) % count)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active
        const Tag = item.link ? 'a' : 'div'
        /* 先按序号给渐变，图片加载失败时再换成当前序号的渐变 */
        const fallback =
          item.fallbackGradient || PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]

        return (
          <Tag
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el) => {
                  mediaRefs.current[i] = el
                }}
              >
                {'image' in item && item.image ? (
                  <img
                    src={item.image}
                    alt={item.alt || item.label || ''}
                    draggable="false"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
                <span className="ag-panel__placeholder" style={{ backgroundImage: fallback }} aria-hidden="true">
                  <span className="ag-panel__glyph tnum">{String(i + 1).padStart(2, '0')}</span>
                </span>
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(el) => {
                    barRefs.current[i] = el
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(el) => {
                    textRefs.current[i] = el
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        )
      })}
    </div>
  )
}

export default AccordionGallery

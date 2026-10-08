import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import './CardSpread.css'

/* ============================================================================
 * CardSpread —— 卡片展开（扇形 / 层叠）
 * ----------------------------------------------------------------------------
 * 一叠卡片默认收拢成摞，鼠标悬停或键盘聚焦时向两侧展开成扇形；
 * 每张卡按序号做交错入场（stagger），点击 / 回车把某张卡翻转置前（放大 + 上浮）。
 *
 * 交互与可访问性：
 *   - 鼠标：mouseenter / mouseleave 展开与收拢
 *   - 键盘：Tab 聚焦即展开；← →（水平）/ ↑ ↓（垂直）在卡片间移动焦点；
 *           Home / End 跳到首尾；Enter / 空格 置前；Esc 收拢
 *   - prefers-reduced-motion：去掉弹性回弹与交错延迟，只做短促的淡入位移
 *   - ResizeObserver：容器尺寸变化后按新宽度重算展开量，避免窄屏溢出
 *   - 卡片容器加 isolation 建立独立层叠上下文，active 卡的 z-index 不会盖住页面其它内容
 * ========================================================================== */

/** 读取系统的“减少动态效果”偏好 */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CardSpread = ({
  cards = [],
  spreadAmount = 80,
  rotateAmount = 12,
  direction = 'horizontal',
  className = '',
}) => {
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  /* 窄屏时自动收窄展开量，否则卡片会超出视口 */
  const [compact, setCompact] = useState(false)
  const [reduced, setReduced] = useState(prefersReducedMotion)

  const list = Array.isArray(cards) ? cards : []

  /* 监听“减少动态效果”偏好的变化 */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  /* 用 ResizeObserver 观察牌堆宽度，窄屏（< 900px）走紧凑展开 */
  useEffect(() => {
    const deck = containerRef.current?.querySelector('.card-spread__deck')
    if (!deck || typeof ResizeObserver === 'undefined') return undefined

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width ?? deck.clientWidth
      setCompact(width < 900)
    })
    ro.observe(deck)
    return () => ro.disconnect()
  }, [])

  const step = Math.max(0, spreadAmount) * (compact ? 0.55 : 1)
  const turn = Math.max(0, rotateAmount) * (compact ? 0.7 : 1)
  const isHorizontal = direction !== 'vertical'

  /* 按序号算出“展开后在牌堆里的位置”（收拢态 = 全 0） */
  const poseFor = useCallback(
    (index, total) => {
      const offset = index - (total - 1) / 2
      return {
        x: isHorizontal ? offset * step : 0,
        y: isHorizontal ? 0 : offset * step,
        rotate: -offset * turn,
      }
    },
    [isHorizontal, step, turn],
  )

  /* ===== 展开 / 收拢：悬停与聚焦共用 ===== */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    /* 每次同步前清掉已卸载卡片留下的空位，避免动画作用于陈旧节点 */
    cardRefs.current.length = list.length
    cardRefs.current = cardRefs.current.filter(Boolean)

    const setDeckActive = (on) => {
      const deck = container.querySelector('.card-spread__deck')
      if (deck) deck.style.zIndex = on ? 40 : ''
    }

    const openCards = () => {
      setIsOpen(true)
      setDeckActive(true)
      const els = cardRefs.current.filter(Boolean)
      els.forEach((card, i) => {
        const { x, y, rotate } = poseFor(i, els.length)
        gsap.to(card, {
          x,
          y,
          rotate,
          zIndex: i + 1,
          scale: 1,
          /* 交错：越靠后的卡越晚一点起步，形成扇形铺开的节奏 */
          delay: reduced ? 0 : i * 0.05,
          duration: reduced ? 0.18 : 0.7,
          ease: reduced ? 'power1.out' : 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        })
      })
    }

    const closeCards = () => {
      setIsOpen(false)
      setDeckActive(false)
      const els = cardRefs.current.filter(Boolean)
      els.forEach((card, i) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotate: 0,
          zIndex: i + 1,
          scale: 1,
          delay: 0,
          duration: reduced ? 0.16 : 0.5,
          ease: reduced ? 'power1.out' : 'power3.inOut',
          overwrite: 'auto',
        })
      })
    }

    container.addEventListener('mouseenter', openCards)
    container.addEventListener('mouseleave', closeCards)
    container.addEventListener('focusin', openCards)
    container.addEventListener('focusout', closeCards)

    return () => {
      container.removeEventListener('mouseenter', openCards)
      container.removeEventListener('mouseleave', closeCards)
      container.removeEventListener('focusin', openCards)
      container.removeEventListener('focusout', closeCards)
      cardRefs.current.forEach((card) => {
        if (card) gsap.killTweensOf(card)
      })
    }
  }, [poseFor, reduced, list.length])

  /* ===== 点击 / 回车：把某张卡翻转置前 ===== */
  const handleCardClick = (index) => {
    const els = cardRefs.current.filter(Boolean)
    setActiveIndex(index)

    const deck = containerRef.current?.querySelector('.card-spread__deck')
    if (deck) deck.style.zIndex = '40'

    els.forEach((card, i) => {
      const isActive = i === index
      const { x, y, rotate } = poseFor(i, els.length)
      gsap.to(card, {
        x: isActive ? 0 : x,
        y: isActive ? (reduced ? -12 : -40) : y,
        rotate: isActive ? 0 : rotate,
        scale: isActive ? 1.15 : 1,
        zIndex: isActive ? 100 : i + 1,
        delay: 0,
        duration: reduced ? 0.18 : 0.6,
        ease: reduced ? 'power1.out' : 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      })
    })
  }

  /* ===== 方向键在卡片间移动焦点（焦点移动会触发 focusin → 展开） ===== */
  const handleArrowNav = (e) => {
    const els = cardRefs.current.filter(Boolean)
    if (!els.length) return

    const key = e.key
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
    if (![prevKey, nextKey, 'Home', 'End', 'Escape'].includes(key)) return

    /* Esc 收拢并让容器失焦 */
    if (key === 'Escape') {
      e.preventDefault()
      containerRef.current?.blur()
      return
    }

    /* 用 DOM 顺序定位，避免焦点在装饰性元素上时算错下标 */
    const current = els.indexOf(document.activeElement)
    if (current < 0) return

    let target = current
    if (key === prevKey) target = current - 1
    else if (key === nextKey) target = current + 1
    else if (key === 'Home') target = 0
    else if (key === 'End') target = els.length - 1

    target = (target + els.length) % els.length
    e.preventDefault()
    els[target]?.focus()
  }

  /* 卸载时清理所有补间 */
  useEffect(
    () => () => {
      cardRefs.current.forEach((card) => {
        if (card) gsap.killTweensOf(card)
      })
    },
    [],
  )

  const setRef = (index) => (el) => {
    cardRefs.current[index] = el
  }

  const hasCards = list.length > 0

  return (
    <div
      ref={containerRef}
      className={`card-spread ${isOpen ? 'card-spread--open' : ''} ${className}`.trim()}
      style={{ perspective: '1200px' }}
      role="group"
      aria-label="卡片展开"
      onKeyDown={handleArrowNav}
    >
      <div className="card-spread__deck">
        {list.map((card, i) => (
          <div
            key={i}
            ref={setRef(i)}
            className={`card-spread__card card-spread__card--${card?.variant || 'default'} ${
              i === activeIndex ? 'card-spread__card--active' : ''
            }`.trim()}
            style={{ zIndex: i + 1 }}
            onClick={() => handleCardClick(i)}
            role="button"
            tabIndex={0}
            aria-label={card?.title ? `展开卡片：${card.title}` : `卡片 ${i + 1}`}
            aria-pressed={i === activeIndex}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick(i)
              }
            }}
          >
            {/* 装饰层：冷光 / 细扫描线 / 悬停辉光 */}
            <div className="card-spread__noise" aria-hidden="true" />
            <div className="card-spread__scanlines" aria-hidden="true" />
            <div className="card-spread__glow" aria-hidden="true" />

            <div className="card-spread__content">
              {card?.label && (
                <div className="card-spread__label">
                  <span className="card-spread__dot" aria-hidden="true" />
                  <span className="card-spread__label-text">{card.label}</span>
                </div>
              )}
              {card?.title && <h3 className="card-spread__title">{card.title}</h3>}
              <div className="card-spread__body">{card?.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-spread__hint" aria-hidden="true">
        <span>{hasCards ? '悬停展开 · 点击置前' : '暂无卡片'}</span>
      </div>
    </div>
  )
}

export default CardSpread

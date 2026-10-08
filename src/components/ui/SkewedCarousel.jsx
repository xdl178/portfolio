import { useRef, useEffect, useState, useCallback } from 'react'
import './SkewedCarousel.css'

/**
 * SkewedCarousel · 倾斜卡片 3D 轮播
 * ------------------------------------------------------------
 * 卡片在轨道上连续位移，并根据「相对容器中心的偏移量」做 skewY + scale 变换：
 * 越靠近中心 → 越大越正、层级越高；越靠两端 → 越小越倾斜、越淡。
 *
 * 交互
 *  - 拖拽横向拖动轨道，松手后吸附到最近一张卡片
 *  - 滚轮仅在横向滚动（deltaX）时切换，纵向滚动仍然交给页面，不劫持
 *  - 点击卡片：置前放大，再次点击复位
 *  - 悬停暂停（pauseOnHover）；鼠标移出时恢复
 *  - 方向键 ←/→ 切换卡片（需先聚焦组件，避免抢走页面滚动）
 *  - indicators 打开时显示指示点，点击可定位到对应卡片
 *  - autoplay 打开时按间隔自动切换（间隔 = 2.6s 与 speed 的较大值）
 *  - 尊重 prefers-reduced-motion：自动位移与自动播放全部停用，只保留手动交互
 *
 * 无障碍
 *  - 容器 role="group" + aria-roledescription="carousel" + aria-label
 *  - 指示点为真实 button，带 aria-label / aria-current
 *  - 键盘方向键支持，底部有 sr-only 的操作提示
 *
 * 放在浅灰区块（bg-wash / bg-mist）上时，传 fadeColor="#F6F8FC" 让两端淡出更贴合。
 */
const SkewedCarousel = ({
  cards = [],
  speed = 60,
  skewAmount = 14,
  scaleAt = 0.7, // 边缘最小缩放
  cardWidth = 360,
  cardHeight = 480,
  gap = 32,
  direction = 'left',
  className = '',
  pauseOnHover = true,
  showFade = true,
  /* ===== 以下为交互增强项，默认值与参考行为保持一致（关闭） ===== */
  indicators = false,
  autoplay = false,
  autoplayInterval = 2600,
  draggable = true,
  ariaLabel = '倾斜卡片轮播',
  fadeColor,
}) => {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const positionRef = useRef(0) // 当前位移（等价于 track.scrollLeft）
  const pausedRef = useRef(false)
  const activeRef = useRef(null)
  const rafRef = useRef(null)
  const loopWidthRef = useRef(0) // 一份卡片的宽度（含间距）
  const topsRef = useRef([]) // 每张卡片相对 track 的布局位置与宽度
  const dragRef = useRef({ active: false, startX: 0, startPos: 0, moved: false })
  const centeringRef = useRef({ active: false, from: 0, to: 0, start: 0, duration: 0 })
  const holdRef = useRef(0) // 手动交互后的停留截止时间戳
  const trackLeftRef = useRef(0) // 上一帧轨道的实际左边界，吸附定位时用它换算目标位移
  const containerOffsetRef = useRef(0) // 容器相对 offsetParent 的布局位移，测量时记录一次
  const dragEndRef = useRef(0) // 拖拽结束时间戳，用来过滤拖拽后补发的 click

  const count = cards.length
  // 复制 3 份实现无缝循环
  const items = count > 0 ? [...cards, ...cards, ...cards] : []

  /* 把一份循环的宽度、以及每张卡片相对轨道的布局位置量出来。
     用 offsetLeft 而不是 getBoundingClientRect，因为卡片带着 skew/scale，
     取视觉矩形会把变换量算进去。 */
  const measureCards = useCallback(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track) return
    // 容器相对其 offsetParent 的位移只在这里量一次，避免每帧读布局
    if (container) containerOffsetRef.current = container.offsetLeft
    let padLeft = 0
    try {
      padLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0
    } catch {
      padLeft = 0
    }
    topsRef.current = cardRefs.current.map((card) =>
      card ? { left: padLeft + card.offsetLeft, width: card.offsetWidth } : { left: 0, width: 0 },
    )
    // 第二份的第一张卡片起点 = 一份卡片的整体宽度（含尾随间距）
    const second = topsRef.current[count]
    if (second && second.left > 0) loopWidthRef.current = second.left
    else loopWidthRef.current = track.scrollWidth / 3 || 0
  }, [count])

  /* 把位移折算回一份循环内，避免无限累加后数值溢出 */
  const normalize = useCallback((value) => {
    const width = loopWidthRef.current
    if (!width) return value
    return ((value % width) + width) % width
  }, [])

  /* 当前离容器中心最近的真实索引（用于指示点与自动播放的推进基准） */
  const nearestIndex = useCallback(() => {
    if (!count || !topsRef.current.length || !trackRef.current) return 0
    const rows = topsRef.current
    const cardWidthRef = rows[0]?.width || 0
    const container = containerRef.current
    const trackLeft = trackLeftRef.current
    const viewportCenter = (container?.clientWidth || 0) / 2
    let best = 0
    let bestDistance = Infinity
    for (let i = 0; i < count; i += 1) {
      const center = rows[i].left + cardWidthRef / 2 - trackLeft
      const distance = Math.abs(center - viewportCenter)
      if (distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    }
    return best
  }, [count])

  /* 平滑定位到某张真实卡片（同卡片的三份副本取离当前位置最近的那份，位移最短） */
  const centerOn = useCallback(
    (realIndex) => {
      if (!count) return
      const rows = topsRef.current
      const cardWidthRef = rows[0]?.width || 0
      const container = containerRef.current
      const viewportCenter = (container?.clientWidth || 0) / 2
      const trackLeft = trackRef.current?.getBoundingClientRect().left || 0
      let best = null
      for (let copy = 0; copy < 3; copy += 1) {
        const index = copy * count + realIndex
        const row = rows[index]
        if (!row) continue
        // 卡片中心相对轨道原点的距离，再换算成需要的位移量
        const center = row.left + cardWidthRef / 2
        const target = center - viewportCenter + trackLeft
        const distance = Math.abs(target - positionRef.current)
        if (!best || distance < best.distance) best = { target, distance }
      }
      if (!best) return
      const distance = best.target - positionRef.current
      if (Math.abs(distance) < 1) return
      centeringRef.current = {
        active: true,
        from: positionRef.current,
        to: positionRef.current + distance,
        start: performance.now(),
        duration: Math.min(0.85, 0.3 + Math.abs(distance) / 1800),
      }
    },
    [count],
  )

  /* 每帧计算每张卡片相对容器中心的偏移，应用 skew + scale。
     只用缓存的布局数值 + scrollLeft，不每帧读 getBoundingClientRect，避免强制重排。 */
  const updateCards = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const width = track.clientWidth
    if (!width) return

    const rows = topsRef.current
    const cardWidthRef = rows[0]?.width || 0
    const trackLeft = containerOffsetRef.current + track.offsetLeft - track.scrollLeft
    trackLeftRef.current = trackLeft
    const viewportCenter = width / 2
    const active = activeRef.current

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const row = rows[i]
      if (!row) return
      const cardCenter = row.left + cardWidthRef / 2 - trackLeft
      // 归一化偏移：-1(最左) → 0(中心) → 1(最右)
      const norm = (cardCenter - viewportCenter) / (width / 2)
      const clamped = Math.max(-1, Math.min(1, norm))
      const intensity = Math.abs(clamped)
      const realIndex = i % count
      const isActive = active === realIndex

      // 激活卡片：放大置前、不透明、不倾斜
      const skewY = isActive || reducedMotion ? 0 : -clamped * skewAmount
      const scale = isActive ? 1.12 : 1 - intensity * (1 - scaleAt)
      const opacity = isActive ? 1 : 1 - intensity * 0.35
      const z = isActive ? 200 : Math.round((1 - intensity) * 100)

      card.style.transform = `translateZ(0) skewY(${skewY}deg) scale(${scale})`
      card.style.opacity = opacity
      card.style.zIndex = z
    })
  }, [skewAmount, scaleAt, count, reducedMotion])

  // 同步暂停状态到 ref，避免重启 RAF 循环
  useEffect(() => {
    pausedRef.current = isPaused
  }, [isPaused])

  // 同步激活索引到 ref
  useEffect(() => {
    activeRef.current = activeIndex
  }, [activeIndex])

  // 系统是否偏好减少动效
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  // 单一持久 RAF 循环：滚动 + 吸附动画 + 每帧 skew/scale
  useEffect(() => {
    const step = () => {
      const track = trackRef.current
      if (track) {
        const now = performance.now()
        const centering = centeringRef.current

        if (centering.active) {
          // 吸附动画：指数缓出，结束时把位移收进一份循环内
          const progress = centering.duration > 0 ? (now - centering.start) / (centering.duration * 1000) : 1
          if (progress >= 1) {
            positionRef.current = normalize(centering.to)
            centering.active = false
          } else {
            const eased = 1 - (1 - progress) ** 3
            positionRef.current = normalize(centering.from + (centering.to - centering.from) * eased)
          }
        } else if (!reducedMotion && !pausedRef.current && !dragRef.current.active && count > 0) {
          const delta = speed / 60
          positionRef.current = normalize(positionRef.current + (direction === 'left' ? delta : -delta))
        }

        track.style.transform = `translateX(${-positionRef.current}px)`
        updateCards()
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, direction, count, reducedMotion, updateCards, normalize])

  // 尺寸变化 / 卡片数量变化后重新测量并重绘
  useEffect(() => {
    measureCards()
    updateCards()
    const container = containerRef.current
    if (!container) return undefined
    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measureCards()
        updateCards()
      })
      observer.observe(container)
    }
    const onResize = () => {
      measureCards()
      updateCards()
    }
    window.addEventListener('resize', onResize)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [measureCards, updateCards, items.length])

  // 自动播放：推进到下一张卡片（拖拽 / 悬停暂停 / 减少动效时跳过）
  useEffect(() => {
    if (!autoplay || reducedMotion || !count) return undefined
    const interval = Math.max(1200, autoplayInterval)
    const timer = window.setInterval(() => {
      if (pausedRef.current || dragRef.current.active) return
      // 用户刚手动定位过，给一点停留时间
      if (performance.now() < holdRef.current) return
      const next = (nearestIndex() + 1) % count
      setActiveIndex(next)
      centerOn(next)
    }, interval)
    return () => window.clearInterval(timer)
  }, [autoplay, autoplayInterval, reducedMotion, count, nearestIndex, centerOn])

  // 仅在横向滚动意图下才接管滚轮，纵向滚动照常交给页面，不劫持
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const onWheel = (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      centeringRef.current.active = false
      holdRef.current = performance.now() + 1400
      positionRef.current = normalize(positionRef.current + event.deltaX)
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [normalize])

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }
  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false)
    dragRef.current.active = false
  }

  // 点击卡片 → 置前并放大，再次点击复位
  const handleCardClick = (i) => {
    // 拖拽刚结束的 150ms 内忽略点击（浏览器会在拖拽后补发 click）
    if (performance.now() - dragEndRef.current < 150) return
    if (dragRef.current.moved) return
    const next = activeIndex === i ? null : i
    setActiveIndex(next)
    holdRef.current = performance.now() + 1600
    updateCards()
  }

  /* ===== 拖拽 ===== */
  const handlePointerDown = (event) => {
    if (!draggable) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startPos: positionRef.current,
      moved: false,
    }
    centeringRef.current.active = false
    holdRef.current = performance.now() + 1800
    setIsDragging(true)
    dragRef.current.moved = false
    // 捕获指针，鼠标移出容器后也能继续拖动
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* 某些浏览器不支持指针捕获，忽略即可 */
    }
    // 让容器拿到焦点，方向键才可用
    containerRef.current?.focus({ preventScroll: true })
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag.active) return
    const delta = event.clientX - drag.startX
    if (!drag.moved && Math.abs(delta) > 4) drag.moved = true
    positionRef.current = normalize(drag.startPos - delta)
  }

  const endDrag = (event) => {
    const drag = dragRef.current
    try {
      event?.currentTarget?.releasePointerCapture(event.pointerId)
    } catch {
      /* 未捕获时释放会抛错，忽略 */
    }
    if (!drag.active) return
    drag.active = false
    setIsDragging(false)
    dragEndRef.current = performance.now()
    if (drag.moved) centerOn(nearestIndex())
  }

  // 鼠标在容器外抬起时补一次收尾，避免卡在拖拽状态
  useEffect(() => {
    const onWindowPointerUp = () => {
      if (!dragRef.current.active) return
      const moved = dragRef.current.moved
      dragRef.current.active = false
      // 在容器外抬起不会产生卡片 click，标记可以直接清掉
      dragRef.current.moved = false
      setIsDragging(false)
      dragEndRef.current = performance.now()
      if (moved) centerOn(nearestIndex())
    }
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)
    return () => {
      window.removeEventListener('pointerup', onWindowPointerUp)
      window.removeEventListener('pointercancel', onWindowPointerUp)
    }
  }, [centerOn, nearestIndex])

  /* 滚轮 / 拖拽后仍保留键盘可达性：←/→ 切换卡片 */
  const handleKeyDown = (event) => {
    if (!count) return
    const tag = event.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const step = event.key === 'ArrowRight' ? 1 : -1
    const current = activeIndex ?? nearestIndex()
    const next = (current + step + count) % count
    setActiveIndex(next)
    holdRef.current = performance.now() + 1600
    centerOn(next)
  }

  const handleDotClick = (i) => {
    setActiveIndex(i)
    holdRef.current = performance.now() + 1600
    centerOn(i)
  }

  return (
    <div
      ref={containerRef}
      className={`skewed-carousel${isDragging ? ' skewed-carousel--dragging' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      style={{
        '--sc-card-w': `${cardWidth}px`,
        '--sc-card-h': `${cardHeight}px`,
        '--sc-gap': `${gap}px`,
        ...(fadeColor ? { '--sc-fade-bg': fadeColor } : null),
      }}
    >
      {showFade && (
        <>
          <div className="skewed-carousel__fade skewed-carousel__fade--left" aria-hidden="true" />
          <div className="skewed-carousel__fade skewed-carousel__fade--right" aria-hidden="true" />
        </>
      )}

      <div className="skewed-carousel__viewport">
        <div ref={trackRef} className="skewed-carousel__track">
          {items.map((card, i) => {
            const realIndex = i % count
            const isActive = activeIndex === realIndex
            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className={`skewed-carousel__card${
                  card.variant ? ` skewed-carousel__card--${card.variant}` : ''
                }${isActive ? ' skewed-carousel__card--active' : ''}`}
                onClick={() => handleCardClick(realIndex)}
                aria-hidden={i >= count ? 'true' : undefined}
                tabIndex={-1}
              >
                <div className="skewed-carousel__noise" aria-hidden="true" />
                <div className="skewed-carousel__scanlines" aria-hidden="true" />
                <div className="skewed-carousel__glow" aria-hidden="true" />
                <div className="skewed-carousel__content">
                  <div className="skewed-carousel__label">
                    <span className="skewed-carousel__dot" aria-hidden="true" />
                    <span className="skewed-carousel__label-text">{card.label}</span>
                  </div>
                  <h3 className="skewed-carousel__title">{card.title}</h3>
                  <div className="skewed-carousel__body">{card.body}</div>
                  <div className="skewed-carousel__index">
                    {String(realIndex + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {indicators && count > 0 && (
        <div className="skewed-carousel__dots" role="group" aria-label="轮播导航">
          {cards.map((card, i) => (
            <button
              key={card.title ?? i}
              type="button"
              className={`skewed-carousel__dot-btn${
                activeIndex === i ? ' skewed-carousel__dot-btn--active' : ''
              }`}
              aria-label={`切换到第 ${i + 1} 张：${card.title ?? ''}`}
              aria-current={activeIndex === i ? 'true' : undefined}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>
      )}

      <span className="sr-only">
        使用左右方向键切换卡片，也可以用鼠标拖拽或横向滚轮浏览。
      </span>
    </div>
  )
}

export default SkewedCarousel

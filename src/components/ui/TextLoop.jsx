import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TextLoop.css'

/**
 * TextLoop —— 让一段文字沿 SVG 路径无限循环流动的装饰性文本组件。
 *
 * 行为要点：
 * 1. 先用一个隐藏的 <text> 量出「一个单元」的宽度，再用 path.getTotalLength()
 *    得到路径总长，据此算出需要重复多少份才能铺满整条路径。
 * 2. 同一份文字渲染两条 <textPath>（一前一后，偏移量相差一个路径长度），
 *    用 gsap 匀速推进 startOffset，形成无缝循环（不会出现首尾接缝）。
 * 3. 字体加载完成（document.fonts.ready）后重新量一次，避免用到回退字体的错误宽度。
 * 4. pauseOnHover 时指针移入暂停、移出继续；speed <= 0 或系统开启
 *    prefers-reduced-motion 时静态停在起点，不做动画。
 */

const VIEW_W = 1200
const EDGE_PAD = 6

/* 本站是白底深字，参考实现的默认值（白字 / 紫色缎带）在浅色主题下不可见，
   这里做一次主题换算：只有调用方「没传」或仍是参考默认值时才替换。 */
const resolveTextColor = (value) => {
  if (value == null) return '#0B1220'
  if (typeof value === 'string' && value.toLowerCase() === '#ffffff') return '#0B1220'
  return value
}

const resolveRibbonColor = (value) => {
  if (value == null) return '#4D6BFE'
  if (typeof value === 'string' && value.toLowerCase() === '#5227ff') return '#4D6BFE'
  return value
}

/* 按形状生成路径：circle / infinity / arch / line / wave（默认 wave） */
const buildPath = (shape, curviness, ribbonWidth, viewH) => {
  const cx = VIEW_W / 2
  const cy = viewH / 2
  const c = Math.max(0, curviness)
  const room = Math.max(20, cy - Math.max(0, ribbonWidth) / 2 - EDGE_PAD)

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room)
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
    }
    case 'infinity': {
      const r = 150 + c * 1.4
      const h = Math.min(60 + c * 0.95, room)
      return [
        `M ${cx} ${cy}`,
        `C ${cx + r * 0.55} ${cy - h} ${cx + r} ${cy - h} ${cx + r} ${cy}`,
        `C ${cx + r} ${cy + h} ${cx + r * 0.55} ${cy + h} ${cx} ${cy}`,
        `C ${cx - r * 0.55} ${cy - h} ${cx - r} ${cy - h} ${cx - r} ${cy}`,
        `C ${cx - r} ${cy + h} ${cx - r * 0.55} ${cy + h} ${cx} ${cy}`,
        'Z',
      ].join(' ')
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2)
      return `M 120 ${cy + rise / 2} Q ${cx} ${cy - rise * 1.5} ${VIEW_W - 120} ${cy + rise / 2}`
    }
    case 'line':
      return `M -320 ${cy} L ${VIEW_W + 320} ${cy}`
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2)
      return `M -320 ${cy} Q -160 ${cy - a} 0 ${cy} T 320 ${cy} T 640 ${cy} T 960 ${cy} T 1280 ${cy} T ${VIEW_W + 320} ${cy}`
    }
  }
}

const TextLoop = ({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = '#0B1220',
  ribbon = true,
  ribbonColor = '#4D6BFE',
  ribbonWidth = 86,
  textGap = 48,
  viewHeight,
  pauseOnHover = true,
  className = '',
  style = {},
}) => {
  const rootRef = useRef(null)
  const pathRef = useRef(null)
  const measureRef = useRef(null)
  const headRef = useRef(null)
  const tailRef = useRef(null)

  /* 量测结果：路径总长 + 需要重复的份数 */
  const [metrics, setMetrics] = useState({ length: 0, reps: 1 })

  /* 同页面可以有多个实例，用 useId 保证 pathId 唯一，避免 href 指向错路径 */
  const rawId = useId()
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`

  const viewH = useMemo(() => {
    if (viewHeight != null) return viewHeight
    if (shape === 'line') return Math.max(48, Math.ceil(fontSize * 1.8 + ribbonWidth + 16))
    return 520
  }, [viewHeight, shape, fontSize, ribbonWidth])

  const d = useMemo(() => path || buildPath(shape, curviness, ribbonWidth, viewH), [path, shape, curviness, ribbonWidth, viewH])

  /* 一个循环单元：正文 + 分隔符 + 由 textGap 换算出的补白 */
  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text)
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0'
    const spacingGap = '\u00A0'.repeat(Math.max(1, Math.round(textGap / (fontSize * 0.6))))
    return `${base}${gap}${spacingGap}`
  }, [text, separator, uppercase, textGap, fontSize])

  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing],
  )

  const textFill = resolveTextColor(color)
  const strokeColor = ribbon ? resolveRibbonColor(ribbonColor) : 'none'

  useLayoutEffect(() => {
    const pathEl = pathRef.current
    const measureEl = measureRef.current
    if (!pathEl || !measureEl) return undefined

    let cancelled = false

    const measure = () => {
      if (cancelled) return
      let length = 0
      let unitWidth = 0
      try {
        length = pathEl.getTotalLength()
        unitWidth = measureEl.getComputedTextLength()
      } catch {
        return
      }
      if (!length) return

      const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1
      setMetrics((prev) => (prev.length === length && prev.reps === reps ? prev : { length, reps }))
    }

    measure()
    /* web font 到位后宽度会变，重新量一次，否则尾部会留缝 */
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {})
    }

    return () => {
      cancelled = true
    }
  }, [d, unit, fontSize, fontWeight, letterSpacing])

  useEffect(() => {
    const { length } = metrics
    const head = headRef.current
    const tail = tailRef.current
    if (!head || !tail || !length) return undefined

    /* 两条 textPath 的偏移量始终相差一个路径长度，从而首尾相接 */
    const apply = (offset) => {
      const partner = offset >= 0 ? offset - length : offset + length
      head.setAttribute('startOffset', String(offset))
      tail.setAttribute('startOffset', String(partner))
    }

    apply(0)

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || speed <= 0) return undefined

    const state = { offset: 0 }
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => apply(state.offset),
    })

    const root = rootRef.current
    const pause = () => tween.pause()
    const resume = () => tween.resume()

    if (pauseOnHover && root) {
      root.addEventListener('pointerenter', pause)
      root.addEventListener('pointerleave', resume)
    }

    return () => {
      tween.kill()
      if (pauseOnHover && root) {
        root.removeEventListener('pointerenter', pause)
        root.removeEventListener('pointerleave', resume)
      }
    }
  }, [metrics, speed, direction, pauseOnHover])

  const loopText = unit.repeat(metrics.reps)
  const fitLength = metrics.length || undefined

  return (
    <div ref={rootRef} className={`text-loop ${className}`.trim()} style={style}>
      <svg
        className="text-loop-svg"
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        {/* 缎带（路径本身）：细描边，缩放下保持线宽 */}
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* 隐藏的测量文本：只用来算单元宽度，不显示 */}
        <text ref={measureRef} className="text-loop-measure" style={textStyle} aria-hidden="true">
          {unit}
        </text>

        {/* 同内容两条，前后错开一个路径长度，实现无缝循环 */}
        <text className="text-loop-text" style={textStyle} fill={textFill} dominantBaseline="central" aria-hidden="true">
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust="spacingAndGlyphs">
            {loopText}
          </textPath>
        </text>

        <text className="text-loop-text" style={textStyle} fill={textFill} dominantBaseline="central" aria-hidden="true">
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust="spacingAndGlyphs">
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

export default TextLoop

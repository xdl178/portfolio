import { useCallback, useEffect, useRef } from 'react'
import './BorderGlow.css'

/* ============================================================================
 * BorderGlow —— 边框光晕卡片
 *
 * 鼠标位置驱动边框高光跟随：
 *   1. 指针在卡片内移动时，实时算出两个数并写成 CSS 变量：
 *        --edge-proximity  指针离最近一条边的「接近度」0~100
 *        --cursor-angle    指针相对卡片中心的方位角
 *   2. CSS 侧用 conic-gradient 蒙版裁出一个朝指针方向的光锥，
 *      分别画出渐变描边（::before）、内部冷色渐层（::after）
 *      和卡片外侧的品牌蓝外发光（.edge-light）。
 *   3. animated=true 时额外播一段自动扫光（绕一圈再收回去），
 *      期间挂上 .sweep-active，让「非 hover」的淡出规则不生效。
 *
 * 主题适配：深色卡 → 白卡，强调色 → 品牌蓝 / 科技青 / 科技紫。
 * ========================================================================== */

/* 品牌蓝 #4D6BFE 的 HSL 记法，作为光晕色默认值 */
const DEFAULT_GLOW_COLOR = '230 99 65'
/* 白卡：与站点 body 底色一致 */
const DEFAULT_CARD_BG = '#FFFFFF'
/* 边框渐变的三色循环（按 COLOR_MAP 取用） */
const DEFAULT_COLORS = ['#4D6BFE', '#00C2FF', '#7C4DFF']

/**
 * 解析 "H S L" / "H S% L%" 形式的色相描述。
 * 解析失败时回落到品牌蓝，避免整块光晕变成透明。
 */
function parseHSL(hslStr) {
  const match = String(hslStr).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 230, s: 99, l: 65 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

/**
 * 由「一个色相 + 亮度系数」展开成 7 级透明度的光晕色阶变量。
 * 卡片外发光用的是多层 box-shadow，每层各取一个变量，
 * 这样 JS 只需要改一个 glowColor 就能整体换色。
 */
function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']
  const vars = {}
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`
  }
  return vars
}

/* 7 个径向渐变各自的光源位置（百分比，对应卡片内的视觉重心） */
const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
]
/* 每个光源取调色板里的第几个颜色，制造冷暖交替的层次 */
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

/**
 * 把一小组品牌色摊成 CSS 变量（7 层径向渐变 + 1 层线性兜底），
 * 供 CSS 里的 border-box / padding-box 多层背景叠加使用。
 */
function buildGradientVars(colors) {
  const palette = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_COLORS
  const vars = {}
  for (let i = 0; i < 7; i++) {
    const c = palette[Math.min(COLOR_MAP[i], palette.length - 1)]
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
  }
  vars['--gradient-base'] = `linear-gradient(${palette[0]} 0 100%)`
  return vars
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

function easeInCubic(x) {
  return x * x * x
}

/**
 * 极简补间：仅依赖 requestAnimationFrame，不引入动画库。
 * 返回一个取消函数，组件卸载或 animated 变化时用来停掉未完成的补间，
 * 避免卸载后仍在写 DOM 样式。
 */
function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}) {
  const t0 = performance.now() + delay
  let rafId = 0
  let timerId = 0
  let cancelled = false

  function tick() {
    if (cancelled) return
    const elapsed = performance.now() - t0
    const t = Math.min(Math.max(elapsed / duration, 0), 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) rafId = requestAnimationFrame(tick)
    else if (onEnd) onEnd()
  }

  timerId = setTimeout(() => {
    rafId = requestAnimationFrame(tick)
  }, delay)

  return () => {
    cancelled = true
    clearTimeout(timerId)
    cancelAnimationFrame(rafId)
  }
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = DEFAULT_GLOW_COLOR,
  backgroundColor = DEFAULT_CARD_BG,
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null)

  /* 参考点取元素自身尺寸的一半（相对坐标下的中心） */
  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }, [])

  /* 指针离最近一条边的接近度：中心为 0，贴边为 1 */
  const getEdgeProximity = useCallback(
    (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      let kx = Infinity
      let ky = Infinity
      if (dx !== 0) kx = cx / Math.abs(dx)
      if (dy !== 0) ky = cy / Math.abs(dy)
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    },
    [getCenterOfElement],
  )

  /* 指针方位角：0° 朝正上方，顺时针增长，供 conic-gradient 使用 */
  const getCursorAngle = useCallback(
    (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      if (dx === 0 && dy === 0) return 0
      const radians = Math.atan2(dy, dx)
      let degrees = radians * (180 / Math.PI) + 90
      if (degrees < 0) degrees += 360
      return degrees
    },
    [getCenterOfElement],
  )

  const handlePointerMove = useCallback(
    (e) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const edge = getEdgeProximity(card, x, y)
      const angle = getCursorAngle(card, x, y)

      card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`)
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
    },
    [getEdgeProximity, getCursorAngle],
  )

  /* 自动扫光：先点亮边缘，再让光锥从 110° 扫到 465°，最后整体收回 */
  useEffect(() => {
    const card = cardRef.current
    if (!animated || !card) return undefined

    /* 尊重系统「减少动态效果」：不跑自动扫光，只保留指针跟随的高光 */
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined
    }

    const angleStart = 110
    const angleEnd = 465
    card.classList.add('sweep-active')
    card.style.setProperty('--cursor-angle', `${angleStart}deg`)

    const setProximity = (v) => card.style.setProperty('--edge-proximity', `${v}`)
    const setAngle = (v) =>
      card.style.setProperty(
        '--cursor-angle',
        `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`,
      )

    const cancels = [
      animateValue({ duration: 500, onUpdate: setProximity }),
      animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: setAngle }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: setAngle,
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: setProximity,
        onEnd: () => card.classList.remove('sweep-active'),
      }),
    ]

    return () => {
      cancels.forEach((cancel) => cancel())
      card.classList.remove('sweep-active')
    }
  }, [animated])

  const glowVars = buildGlowVars(glowColor, glowIntensity)

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  )
}

export default BorderGlow

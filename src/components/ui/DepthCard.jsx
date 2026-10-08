import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import './DepthCard.css'

/* ============================================================================
 * DepthCard —— 景深卡片（3D 倾斜 + 图层视差）
 * ----------------------------------------------------------------------------
 * 鼠标在卡片上移动时：
 *   - 整张卡按指针位置做 rotateX / rotateY 倾斜，形成 3D 透视；
 *   - 内部各图层按“景深”反向 / 正向位移，形成视差（glow 最远、bg 次之、
 *     mid 轻微、fg 最近），depth 越大位移越明显；
 *   - 鼠标移出时弹性回正，并清空各图层位移。
 *
 * 可访问性：
 *   - 键盘：卡片可获得焦点，方向键触发与指针位置等价的倾斜与视差，
 *           Home / Escape / 回车 / 空格 复位
 *   - aria：根节点为 role="group" 并带 aria-label，
 *           纯装饰图层统一 aria-hidden
 *   - prefers-reduced-motion：完全关闭倾斜与位移（不做动态效果），
 *           并监听偏好变化，运行中切换也能立刻生效
 *
 * 视觉：白底 / 极浅冷灰底 + 墨蓝黑字 + 品牌蓝强调，阴影柔和不重描边。
 * ========================================================================== */

/** 读取系统的“减少动态效果”偏好 */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const DepthCard = ({
  children,
  variant = 'default',
  depth = 1,
  rotateAmount = 8,
  className = '',
  glass = false,
}) => {
  const cardRef = useRef(null)
  const layerRefs = useRef({})
  const [reduced, setReduced] = useState(prefersReducedMotion)

  /* 运行中跟随系统的“减少动态效果”偏好变化 */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const setLayerRef = (name) => (el) => {
    if (el) layerRefs.current[name] = el
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return undefined

    /* 取当前已挂载的图层；cleanup 里用同一份引用，避免清理时读到已变化的 ref */
    const layerMap = layerRefs.current
    const layers = () => layerMap

    /* 复位：卡片回正、所有图层位移清零 */
    const reset = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: reduced ? 0.2 : 0.7,
        ease: reduced ? 'power1.out' : 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      })

      Object.values(layers()).forEach((layer) => {
        if (!layer) return
        gsap.to(layer, {
          x: 0,
          y: 0,
          duration: reduced ? 0.2 : 0.6,
          ease: reduced ? 'power1.out' : 'elastic.out(1, 0.5)',
          opacity: layer === layers().glow ? 0 : undefined,
          overwrite: 'auto',
        })
      })
    }

    /* 按归一化指针位置（-0.5 ~ 0.5）驱动倾斜与视差 */
    const applyTilt = (nx, ny) => {
      /* 关闭动态效果时不做任何倾斜 / 位移 */
      if (reduced) return

      gsap.to(card, {
        rotateY: nx * rotateAmount,
        rotateX: -ny * rotateAmount,
        duration: 0.6,
        ease: 'power3.out',
        transformPerspective: 1000,
        transformOrigin: 'center center',
        overwrite: 'auto',
      })

      const l = layers()
      if (l.bg) {
        gsap.to(l.bg, {
          x: nx * -20 * depth,
          y: ny * -20 * depth,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      if (l.mid) {
        gsap.to(l.mid, {
          x: nx * 10 * depth,
          y: ny * 10 * depth,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      if (l.fg) {
        gsap.to(l.fg, {
          x: nx * 25 * depth,
          y: ny * 25 * depth,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      if (l.glow) {
        gsap.to(l.glow, {
          x: nx * 30 * depth,
          y: ny * 30 * depth,
          duration: 0.8,
          ease: 'power3.out',
          opacity: 0.6,
          overwrite: 'auto',
        })
      }
    }

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5
      applyTilt(mouseX, mouseY)
    }

    const handleMouseLeave = reset

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf(card)
      Object.values(layerMap).forEach((layer) => {
        if (layer) gsap.killTweensOf(layer)
      })
    }
  }, [depth, rotateAmount, reduced])

  /* 键盘等价操作：方向键模拟指针移向对应边角，其余按键复位 */
  const TILT_KEYS = {
    ArrowLeft: [-0.5, 0],
    ArrowRight: [0.5, 0],
    ArrowUp: [0, -0.5],
    ArrowDown: [0, 0.5],
  }

  const handleKeyDown = (e) => {
    const card = cardRef.current
    if (!card) return

    const dir = TILT_KEYS[e.key]
    if (dir) {
      e.preventDefault()
      if (reduced) return
      gsap.to(card, {
        rotateY: dir[0] * rotateAmount,
        rotateX: -dir[1] * rotateAmount,
        duration: 0.4,
        ease: 'power3.out',
        transformPerspective: 1000,
        transformOrigin: 'center center',
        overwrite: 'auto',
      })
      return
    }

    if (['Home', 'Escape', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: reduced ? 0.2 : 0.6,
        ease: reduced ? 'power1.out' : 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className={`depth-card depth-card--${variant}${glass ? ' depth-card--glass' : ''} ${className}`.trim()}
      style={{ perspective: '1000px' }}
      role="group"
      tabIndex={0}
      aria-label="景深卡片：悬停或按方向键查看 3D 倾斜与图层视差"
      onKeyDown={handleKeyDown}
    >
      <div className="depth-card__noise" aria-hidden="true" />
      <div className="depth-card__scanlines" aria-hidden="true" />
      <div ref={setLayerRef('glow')} className="depth-card__glow" aria-hidden="true" />
      <div ref={setLayerRef('bg')} className="depth-card__layer depth-card__layer--bg" aria-hidden="true" />
      <div ref={setLayerRef('mid')} className="depth-card__layer depth-card__layer--mid" />
      <div ref={setLayerRef('fg')} className="depth-card__layer depth-card__layer--fg">
        {children}
      </div>
    </div>
  )
}

export default DepthCard

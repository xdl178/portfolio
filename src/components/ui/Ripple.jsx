import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Ripple.css'

/**
 * Ripple —— 点击 / 键盘触发的水波反馈容器（按钮、外链、路由链接三形态共用）。
 *
 * 行为要点：
 * 1. 点击时以「点击点在元素内的坐标」为圆心插入一个圆形波纹节点，
 *    交给 CSS 动画扩散并淡出；动画结束后把节点从 DOM 移除，不会越积越多。
 * 2. 键盘触发（Enter / Space）与 el.click() 的事件坐标恒为 0，
 *    这种点击会把波纹放在元素中心——否则波纹会落在元素外的视口左上角，等于没有反馈。
 * 3. as 三种形态：'button'（默认）、'link'（原生 <a>，需要 href）、
 *    'router-link'（用 <button> 承载，点击后走路由跳转）。
 * 4. variant 只影响波纹色调：默认品牌蓝 → 科技青；'cyan' / 'violet' 换成青 / 紫。
 * 5. 系统开启 prefers-reduced-motion 时不做缩放扩散，退化成一次静态圆形淡出，
 *    JS 侧的移除计时也同步缩短，动画时长与 Ripple.css 里的 keyframes 保持一致。
 * 6. 其余 props 原样透传（role / aria-* / tabIndex / disabled 等无障碍属性都不会丢）。
 */

/* 波纹动画时长（毫秒），与 Ripple.css 中的 ripple-wave 一致 */
const WAVE_MS = 700
/* 减少动态效果时只闪一下，时间更短 */
const WAVE_MS_REDUCED = 320

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Ripple = ({
  children,
  as = 'button',
  to,
  href,
  onClick,
  className = '',
  variant = 'default',
  ref: forwardedRef,
  ...props
}) => {
  const navigate = useNavigate()
  const rootRef = useRef(null)
  /* 未到期的移除定时器，卸载时统一清掉 */
  const timersRef = useRef(new Set())

  /* 同时接住内部要用的节点引用和调用方透传的 ref（React 19 里 ref 也是普通 prop） */
  const setRootRef = useCallback(
    (node) => {
      rootRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current.clear()
    },
    [],
  )

  /* 在点击位置插入圆形波纹，动画结束后自行移除 */
  const spawnWave = (event) => {
    const root = rootRef.current
    if (!root || typeof document === 'undefined') return

    const rect = root.getBoundingClientRect()
    /* 元素还没排版（宽高为 0）时不做无意义的波纹 */
    if (!rect.width && !rect.height) return

    const size = Math.max(rect.width, rect.height)
    /* 键盘触发没有指针坐标，用元素中心代替 */
    const keyboard = event.detail === 0 || (event.clientX === 0 && event.clientY === 0)
    const x = keyboard ? rect.left + rect.width / 2 : event.clientX
    const y = keyboard ? rect.top + rect.height / 2 : event.clientY

    const wave = document.createElement('span')
    wave.className = 'ripple-effect'
    wave.setAttribute('aria-hidden', 'true')
    wave.style.width = `${size}px`
    wave.style.height = `${size}px`
    wave.style.left = `${x - rect.left - size / 2}px`
    wave.style.top = `${y - rect.top - size / 2}px`

    root.appendChild(wave)

    const life = prefersReducedMotion() ? WAVE_MS_REDUCED : WAVE_MS
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      wave.remove()
    }, life)
    timersRef.current.add(timer)
  }

  const handleClick = (event) => {
    spawnWave(event)
    if (onClick) onClick(event)
    /* 调用方主动 preventDefault 时不再跳转；原生链接由浏览器自己处理 */
    if (as === 'router-link' && to && !event.defaultPrevented) navigate(to)
  }

  const baseClass =
    `ripple-container transition-transform duration-150 active:scale-[0.97] motion-reduce:active:scale-100 ${className}`.trim()

  if (as === 'router-link') {
    return (
      <button
        ref={setRootRef}
        type={props.type ?? 'button'}
        onClick={handleClick}
        className={baseClass}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    )
  }

  if (as === 'link' && href) {
    const blank = props.target === '_blank'
    return (
      <a
        ref={setRootRef}
        href={href}
        rel={props.rel ?? (blank ? 'noopener noreferrer' : undefined)}
        onClick={handleClick}
        className={baseClass}
        data-variant={variant}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={setRootRef}
      type={props.type ?? 'button'}
      onClick={handleClick}
      className={baseClass}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  )
}

export default Ripple

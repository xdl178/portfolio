import { useEffect, useRef, useState } from 'react'

/**
 * 滚动揭示容器：子元素带 .scroll-reveal__item 时按顺序依次滑入。
 * 用 IntersectionObserver，只触发一次。
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
  y = 24,
  once = true,
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return undefined
    }

    // 只有在观察器真正挂上之后才收起子项（渐进增强，避免内容永久隐身）
    setReady(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal${ready ? ' is-init' : ''}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--sr-delay': `${delay}s`,
        '--sr-stagger': `${stagger}s`,
        '--sr-y': `${y}px`,
      }}
    >
      {children}
    </Tag>
  )
}

/** 单个揭示项，放在 ScrollReveal 内部 */
export function ScrollRevealItem({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`scroll-reveal__item${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </Tag>
  )
}

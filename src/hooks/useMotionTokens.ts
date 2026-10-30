import { useEffect, useState } from 'react'

type Ease = [number, number, number, number]
type StyleReader = Pick<CSSStyleDeclaration, 'getPropertyValue'>

/** CSS remains the source of truth; Motion expects seconds and a bezier tuple. */
export function readMotionTokens(style: StyleReader = getComputedStyle(document.documentElement)) {
  const values = style.getPropertyValue('--e-smooth').match(/-?\d*\.?\d+/g)?.map(Number)
  const ease: Ease = values?.length === 4 ? [values[0], values[1], values[2], values[3]] : [0, 0, 1, 1]
  const feedbackValues = style.getPropertyValue('--e-feedback').match(/-?\d*\.?\d+/g)?.map(Number)
  const feedbackEase: Ease = feedbackValues?.length === 4 ? [feedbackValues[0], feedbackValues[1], feedbackValues[2], feedbackValues[3]] : ease
  const transition = (name: string) => {
    const value = style.getPropertyValue(name).trim()
    const parsed = parseFloat(value)
    const duration = Number.isFinite(parsed) ? Math.max(0, parsed / (value.endsWith('ms') ? 1000 : 1)) : 0
    return { duration, ease }
  }
  return {
    ease,
    reveal: transition('--d-reveal'),
    toolReveal: { ...transition('--d-tool-reveal'), ease: feedbackEase },
    toolStagger: transition('--d-tool-stagger').duration,
    detail: transition('--d-detail-reveal'),
    section: transition('--d-section-reveal'),
    route: transition('--d-route'),
    entry: transition('--d-entry'),
    footer: transition('--d-very-slow'),
    quick: transition('--d-quick'),
  }
}

export function useMotionTokens() {
  const [tokens, setTokens] = useState(() => readMotionTokens())
  useEffect(() => {
    const update = () => setTokens(readMotionTokens())
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    update()
    return () => observer.disconnect()
  }, [])
  return tokens
}

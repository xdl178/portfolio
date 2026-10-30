import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import './BackToTop.css'

/** Reference behavior: a 44px floating control, shown only past 500px. */
export default function BackToTop({ onClick }: { onClick: () => void }) {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)
  const updateVisibility = useCallback((value: number) => {
    const next = value > 500
    // Only the threshold crossing enters React state, not continuous scrolling.
    if (next !== visibleRef.current) {
      visibleRef.current = next
      setVisible(next)
    }
  }, [])
  useMotionValueEvent(scrollY, 'change', updateVisibility)
  useEffect(() => { updateVisibility(window.scrollY) }, [updateVisibility])

  // Escape reveal transforms and the footer's overflow-clipping context.
  return createPortal(
    <button type="button" data-back-top className={`back-top${visible ? ' is-visible' : ''}`}
      aria-label="回到顶部" title="回到顶部" aria-hidden={!visible} tabIndex={visible ? 0 : -1} onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
    </button>,
    document.body,
  )
}

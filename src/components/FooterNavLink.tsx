import { useState, useSyncExternalStore, type FocusEvent, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './FooterNavLink.css'

type FooterNavLinkProps = {
  label: string
  to?: string
  onClick?: () => void
  className?: string
}

// Stefan H reference: three whole rows, opposite vertical travel, no stagger.
const navSpring = { type: 'spring' as const, stiffness: 500, damping: 60, mass: 1 }
const navRows = [0, 1, 2] as const
const twoRows = '-66.666667%'
const hoverQuery = typeof window === 'undefined' ? null : window.matchMedia('(hover: hover) and (pointer: fine)')
const getHoverSnapshot = () => hoverQuery?.matches ?? false
const getServerHoverSnapshot = () => false
const subscribeHover = (onChange: () => void) => {
  hoverQuery?.addEventListener('change', onChange)
  return () => hoverQuery?.removeEventListener('change', onChange)
}

/** Native route/button semantics with the shared three-row footer roll. */
export default function FooterNavLink({ label, to, onClick, className = '' }: FooterNavLinkProps) {
  const reduce = useReducedMotion()
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, getServerHoverSnapshot)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = !reduce && canHover && (hovered || focused)
  const transition = reduce ? { duration: 0 } : navSpring
  const props = {
    className: `footer-nav-link ${className}`.trim(),
    'aria-label': label,
    onClick,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHovered(true) },
    onPointerLeave: () => setHovered(false),
    onPointerDown: () => setFocused(false),
    onFocus: (event: FocusEvent<HTMLElement>) => setFocused(event.currentTarget.matches(':focus-visible')),
    onBlur: () => setFocused(false),
  }
  const content = <>
    <span className="footer-nav-roll footer-nav-text" aria-hidden="true">
      <motion.span className="footer-nav-track" initial={false} animate={{ y: active ? twoRows : '0%' }} transition={transition}>
        {navRows.map(row => <span key={row} className="footer-nav-copy" data-nav-copy={row === 0 ? 'base' : 'duplicate'}>{label}</span>)}
      </motion.span>
    </span>
    <span className="footer-nav-roll footer-nav-arrow" aria-hidden="true">
      <motion.span className="footer-nav-track" initial={false} animate={{ y: active ? '0%' : twoRows }} transition={transition}>
        {navRows.map(row => <span key={row} className="footer-nav-copy" data-nav-copy={row === 2 ? 'base' : 'duplicate'}><svg viewBox="0 0 256 256" focusable="false"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" /></svg></span>)}
      </motion.span>
    </span>
  </>
  return to ? <Link {...props} to={to}>{content}</Link> : <button {...props} type="button">{content}</button>
}

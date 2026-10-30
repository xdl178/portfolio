import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import './ActionButton.css'

type SharedProps = {
  children: ReactNode
  icon?: ReactNode
  /** Kept compatible with the original header consumer. */
  compact?: boolean
  size?: 'default' | 'compact' | 'regular'
  variant?: 'outline' | 'ghost' | 'text'
  pill?: boolean
}
type ActionButtonProps = SharedProps & (
  | ({ as: 'a'; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as: 'link' } & LinkProps)
  | ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
)

/** Shared visual variants without giving up native link/button/router semantics. */
export default function ActionButton(props: ActionButtonProps) {
  const { as, children, icon, compact = false, size = compact ? 'compact' : 'default', variant = 'outline', pill = false, className = '', ...attributes } = props
  const classes = `action-button action-button--${variant}${size !== 'default' ? ` action-button--${size}` : ''}${pill ? ' action-button--pill' : ''} ${className}`
  const content = <>
    <span data-action-icon className="action-button-icon" aria-hidden="true">{icon ?? <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18m-7-7 7 7-7 7" /></svg>}</span>
    <span data-action-label className="action-button-label">{children}</span>
  </>
  if (as === 'link') return <Link {...attributes as LinkProps} data-action-button className={classes}>{content}</Link>
  if (as === 'a') return <a {...attributes as AnchorHTMLAttributes<HTMLAnchorElement>} data-action-button className={classes}>{content}</a>
  return <button type="button" {...attributes as ButtonHTMLAttributes<HTMLButtonElement>} data-action-button className={classes}>{content}</button>
}

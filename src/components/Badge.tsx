import { createElement, type HTMLAttributes, type ButtonHTMLAttributes } from 'react'

type BadgeProps = { surface?: 'default' | 'image' } & (
  | (HTMLAttributes<HTMLElement> & { as?: 'span' | 'h3' })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' })
)

/** Shared chip visuals; optional native button preserves interactive filter semantics. */
export default function Badge({ as: Tag = 'span', surface = 'default', className = '', children, ...props }: BadgeProps) {
  const attributes = {
    ...props,
    ...(Tag === 'button' ? { type: 'button', ...props } : {}),
    'data-ui-badge': true,
    className: `chip ${surface === 'image' ? 'chip--image' : ''} whitespace-nowrap font-sans normal-case tracking-[0.08em] ${className}`,
  }
  return createElement(Tag, attributes,
    <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-brand" />,
    children,
  )
}

import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLElement> & {
  as?: 'span' | 'h3'
}

/** Shared non-interactive badge; className is for placement, not visual variants. */
export default function Badge({ as: Tag = 'span', className = '', children, ...props }: BadgeProps) {
  return (
    <Tag {...props} data-ui-badge className={`chip bg-paper/10 whitespace-nowrap font-sans normal-case tracking-[0.08em] ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-brand" />
      {children}
    </Tag>
  )
}

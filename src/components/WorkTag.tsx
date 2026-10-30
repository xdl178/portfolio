import type { HTMLAttributes } from 'react'
import './WorkTag.css'

type WorkTagProps = HTMLAttributes<HTMLElement> & {
  as?: 'span' | 'li'
}

/** Shared work-label appearance; className is for placement, not visual variants. */
export default function WorkTag({ as: Tag = 'span', className, ...props }: WorkTagProps) {
  return <Tag {...props} data-work-tag className={['work-tag', className].filter(Boolean).join(' ')} />
}

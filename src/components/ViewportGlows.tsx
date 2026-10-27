import { createPortal } from 'react-dom'
import './ViewportGlows.css'

/** Viewport decorations, independent of route transforms and the pointer halo. */
export default function ViewportGlows() {
  return createPortal(
    <div data-viewport-glows className="viewport-glows" aria-hidden="true">
      <span data-viewport-glow className="viewport-glow viewport-glow--start" />
      <span data-viewport-glow className="viewport-glow viewport-glow--end" />
    </div>,
    document.body,
  )
}

export function scrollToContact() {
  const target = document.getElementById('footer-channels')
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'center' })
  target.focus({ preventScroll: true })
}

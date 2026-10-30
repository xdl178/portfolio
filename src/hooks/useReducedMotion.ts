import { useSyncExternalStore } from 'react'

// One live preference source. Motion's installed hook only snapshots on mount.
const query = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)')
const getSnapshot = () => query?.matches ?? true
const getServerSnapshot = () => true
const subscribe = (onChange: () => void) => {
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

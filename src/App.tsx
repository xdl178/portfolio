import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Route, Routes, useLocation } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import Backdrop from './components/Backdrop'
import LoadingScreen from './components/LoadingScreen'
import WorkCursorHalo from './components/WorkCursorHalo'
import ViewportGlows from './components/ViewportGlows'
import Navbar from './components/Navbar'
import ContactFooter from './components/ContactFooter'
import HomePage from './pages/HomePage'
import WorksPage from './pages/WorksPage'
import WorkDetailPage from './pages/WorkDetailPage'
import AboutPage from './pages/AboutPage'
import { useMotionTokens } from './hooks/useMotionTokens'

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-desk.jpg`
const MIN_VISIBLE = 1000

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)
  const [heroBg, setHeroBg] = useState<string | null>(null)
  const [bootAt] = useState(() => performance.now())
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const tokens = useMotionTokens()
  const reduceRouteMotion = reduceMotion
  const [entryPath] = useState(() => location.pathname)
  const handleComplete = useCallback(() => setIsLoading(false), [])

  useEffect(() => {
    let alive = false
    let booted = false
    let watchdog = 0
    const settle = (src: string) => {
      if (!alive) {
        if (src.startsWith('blob:')) URL.revokeObjectURL(src)
        return
      }
      setHeroBg(src)
      setProgress(1)
      const rest = Math.max(0, MIN_VISIBLE - (performance.now() - bootAt))
      window.setTimeout(() => { if (alive) setAssetsReady(true) }, rest)
    }
    if (entryPath !== '/') {
      alive = true
      settle(HERO_IMAGE)
      return () => { alive = false }
    }
    alive = true
    watchdog = window.setTimeout(() => { if (alive && !booted) settle(HERO_IMAGE) }, 12000)
    ;(async () => {
      try {
        const res = await fetch(HERO_IMAGE, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const total = Number(res.headers.get('content-length') || 0)
        const type = res.headers.get('content-type') || 'image/jpeg'
        const reader = res.body?.getReader()
        if (!reader) {
          const blob = await res.blob()
          booted = true
          settle(URL.createObjectURL(blob))
          return
        }
        const chunks: Uint8Array[] = []
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          if (value) { chunks.push(value); received += value.length }
          if (alive && !booted) setProgress(total > 0 ? Math.min(0.95, received / total) : Math.min(0.9, 1 - Math.exp(-received / 120000)))
        }
        booted = true
        settle(URL.createObjectURL(new Blob(chunks as BlobPart[], { type })))
      } catch {
        booted = true
        settle(HERO_IMAGE)
      }
    })()
    return () => { alive = false; window.clearTimeout(watchdog) }
  }, [entryPath, bootAt])

  useEffect(() => {
    if (isLoading) document.body.style.overflow = 'hidden'
    else { document.body.style.overflow = ''; window.scrollTo({ top: 0, behavior: 'auto' }) }
  }, [isLoading])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (!isLoading) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, isLoading])

  return (
    <>
      {!isLoading && <><ViewportGlows /><WorkCursorHalo /></>}
      <AnimatePresence>
        {isLoading && <LoadingScreen progress={progress} ready={assetsReady} onComplete={handleComplete} />}
      </AnimatePresence>
      <motion.div inert={isLoading} aria-hidden={isLoading} initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={reduceMotion ? { duration: 0 } : tokens.entry} className="relative min-h-[100svh] overflow-x-clip bg-bg text-text-primary">
        <Backdrop />
        <div className="relative z-10 flex min-h-[100svh] flex-col">
          <Navbar />
          <div className="flex-1">
            <main id="main-content" className="w-full max-w-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={location.pathname} initial={reduceRouteMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }} animate={reduceRouteMotion ? { opacity: 1, transform: 'none', filter: 'none' } : { opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduceRouteMotion ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(6px)' }} transition={reduceRouteMotion ? { duration: 0 } : tokens.route}>
                  <Routes location={location}>
                    <Route path="/" element={<HomePage heroActive={!isLoading} heroBg={heroBg} />} />
                    <Route path="/works" element={<WorksPage />} />
                    <Route path="/works/:id" element={<WorkDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </main>
            <ContactFooter />
          </div>
        </div>
      </motion.div>
    </>
  )
}

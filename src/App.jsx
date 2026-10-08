import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/sections/Footer.jsx'
import Home from './pages/Home.jsx'
import Works from './pages/Works.jsx'
import WorkDetail from './pages/WorkDetail.jsx'
import { useCursorHalo, CursorHalo } from './hooks/useCursorHalo.jsx'
import { useLenis } from './hooks/useSmoothScroll.jsx'

/* 路由切换时的淡入 */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
}

function Page({ children }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-nav">
      {children}
    </motion.main>
  )
}

function NotFound() {
  return (
    <Page>
      <div className="container py-30 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-hero-sub text-ink">页面不存在</h1>
        <p className="mt-5 text-body text-slate-soft">检查一下地址，或者回首页看看。</p>
        <a href="#/" className="btn-primary mt-8">
          回到首页
        </a>
      </div>
    </Page>
  )
}

function Shell() {
  const location = useLocation()
  const { dotRef, haloRef } = useCursorHalo()
  const lenis = useLenis()

  // 换页时回到顶部（交给 Lenis，避免和它的滚动位置打架）
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [location.pathname, lenis])

  return (
    <>
      <CursorHalo dotRef={dotRef} haloRef={haloRef} />
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="/works"
            element={
              <Page>
                <Works />
              </Page>
            }
          />
          <Route
            path="/works/:slug"
            element={
              <Page>
                <WorkDetail />
              </Page>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  )
}

export default function App() {
  return <Shell />
}

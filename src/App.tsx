import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Backdrop from './components/Backdrop'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ContactFooter from './components/ContactFooter'
import HomePage from './pages/HomePage'
import WorksPage from './pages/WorksPage'
import WorkDetailPage from './pages/WorkDetailPage'
import AboutPage from './pages/AboutPage'

/* ============================================================
   App · 路由式漫游外壳（参考 portfolio-test 跳转逻辑）
   /            首页（首屏 + 精选作品 + 影像实验室 + 客户）
   /works       作品档案馆（筛选 + 大卡列表）
   /works/:id   作品详情（陈列 + 原稿 + 相关推荐）
   /about       关于（简介 + 能力 + 经历）
   外壳：加载屏（仅首载）→ 导航 → 路由页 → 全局页脚
   ============================================================ */

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  const handleComplete = useCallback(() => setIsLoading(false), [])

  /* 加载期间锁定滚动。
     注意：不要"保存旧值再恢复"——StrictMode 下 effect 二次执行会把
     'hidden' 存成旧值，解锁时原样写回，页面将永远无法滚动。 */
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [isLoading])

  /* 刷新后恢复浏览器记忆的滚动位置会导致跳过 Hero，强制回顶 */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  /* 路由切换回顶 */
  useEffect(() => {
    if (!isLoading) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, isLoading])

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={handleComplete} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-[100svh] overflow-x-clip bg-bg text-text-primary"
      >
        <Backdrop />

        <div className="relative z-10 flex min-h-[100svh] flex-col">
          <Navbar />

          <div className="flex-1">
            <main id="main-content">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Routes location={location}>
                    <Route path="/" element={<HomePage heroActive={!isLoading} />} />
                    <Route path="/works" element={<WorksPage />} />
                    <Route path="/works/:id" element={<WorkDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
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

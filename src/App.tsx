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
   外壳：真实预加载 + 加载屏（仅首载）→ 导航 → 路由页 → 全局页脚

   加载策略：
   - 只有首屏大图参与预加载（fetch 流式读字节 → 真实百分比）
   - 作品 / 影像图全部 loading="lazy"，进入页面后再按需拉取
   ============================================================ */

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-desk.jpg`
/* 加载屏最短停留：真实加载再快也不闪一下就消失 */
const MIN_VISIBLE = 1000

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)
  const [heroBg, setHeroBg] = useState<string | null>(null)
  const [bootAt] = useState(() => performance.now())
  const location = useLocation()
  /* 首次进入的路径决定要不要预加载首屏图（之后的路由切换不重复触发） */
  const [entryPath] = useState(() => location.pathname)

  const handleComplete = useCallback(() => setIsLoading(false), [])

  /* ---- 真实预加载：只有首屏大图 ---- */
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
      window.setTimeout(() => {
        if (alive) setAssetsReady(true)
      }, rest)
    }

    /* 非首页直达（如 /works）不必为首屏图等带宽，直接放行 */
    if (entryPath !== '/') {
      alive = true
      settle(HERO_IMAGE)
      return () => {
        alive = false
      }
    }

    alive = true
    /* 兜底：网络卡死也不能把人锁在加载屏里 */
    watchdog = window.setTimeout(() => {
      if (alive && !booted) settle(HERO_IMAGE)
    }, 12000)

    ;(async () => {
      try {
        const res = await fetch(HERO_IMAGE, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const total = Number(res.headers.get('content-length') || 0)
        const type = res.headers.get('content-type') || 'image/jpeg'
        const reader = res.body?.getReader()

        /* 无流式能力：退回一次性拿完，进度直接到 100 */
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
          if (value) {
            chunks.push(value)
            received += value.length
          }
          if (alive && !booted) {
            /* 有 content-length 走真实字节比；没有则用渐近曲线，绝不虚报 100 */
            const ratio = total > 0 ? received / total : 1 - Math.exp(-received / 120000)
            setProgress(Math.min(0.99, ratio))
          }
        }

        const blob = new Blob(chunks as BlobPart[], { type })
        const objUrl = URL.createObjectURL(blob)

        /* 等到真正可绘制再放行，避免加载屏撤掉后出现空白闪帧 */
        const img = new Image()
        img.src = objUrl
        await img.decode().catch(() => {})
        booted = true
        settle(objUrl)
      } catch {
        /* 预加载失败也要放行，别把用户关在加载屏里 */
        booted = true
        settle(HERO_IMAGE)
      }
    })()

    return () => {
      alive = false
      window.clearTimeout(watchdog)
    }
  }, [bootAt, entryPath])

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
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen progress={progress} ready={assetsReady} onComplete={handleComplete} />
        )}
      </AnimatePresence>

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
                    <Route
                      path="/"
                      element={<HomePage heroActive={!isLoading} heroBg={heroBg} />}
                    />
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

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getRelatedWorks, getWorkById, type OriginalImage } from '../data/works'
import { HEADER_TRANSITION } from '../components/SectionHeader'

/* ============================================================
   WorkDetailPage · 作品详情 /works/:id（参考 portfolio-test 结构）
   1. 面包屑 + 返回
   2. 头牌区（分类章 + 巨字标题 + 副标 + 元数据 4 卡）
   3. 设计理念（concept / description / details）
   4. 主要页面陈列（pageImages 依次纵排）
   5. 主要原稿（网格卡片，点击灯箱查看）
   6. 相关作品推荐
   ============================================================ */

export default function WorkDetailPage() {
  const { id } = useParams()
  const work = getWorkById(id)
  const [lightbox, setLightbox] = useState<OriginalImage | null>(null)

  /* 灯箱：Esc 关闭 + 锁定滚动 */
  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  /* 404 */
  if (!work) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center bg-bg px-6 pt-32 text-center">
        <p className="type-display mb-4 text-white/[0.06]">404</p>
        <p className="type-label mb-8">WORK NOT FOUND · 作品不存在</p>
        <Link to="/works" className="btn btn-ghost">
          <span aria-hidden="true">←</span>
          返回作品档案
        </Link>
      </div>
    )
  }

  const related = getRelatedWorks(work.id, 3)

  return (
    <div className="relative bg-bg pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        {/* ============ 面包屑 ============ */}
        <nav
          aria-label="面包屑"
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-5"
        >
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-accent">
                首页
              </Link>
            </li>
            <li aria-hidden="true" className="text-accent/60">
              /
            </li>
            <li>
              <Link to="/works" className="transition-colors hover:text-accent">
                作品档案
              </Link>
            </li>
            <li aria-hidden="true" className="text-accent/60">
              /
            </li>
            <li className="max-w-[50vw] truncate text-text-primary sm:max-w-none">{work.title}</li>
          </ol>

          <Link to="/works" className="btn btn-outline px-4 py-2 text-xs">
            <span aria-hidden="true">←</span>
            返回档案
          </Link>
        </nav>

        {/* ============ 头牌区 ============ */}
        <header className="border-b border-white/10 py-14 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={HEADER_TRANSITION}
          >
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="chip !border-accent/40 !text-accent">{work.categoryLabel}</span>
              <span className="chip">{work.year}</span>
              <span className="chip">N° {work.serial}</span>
            </div>

            <h1 className="type-display text-text-primary">{work.title}</h1>
            <p className="type-label mt-4 !text-accent/80">{work.titleEn}</p>

            <p className="type-body mt-8 max-w-[56ch] md:text-lg">{work.shortDesc}</p>

            {/* 元数据 4 卡 */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'ROLE · 担任角色', value: work.role },
                { label: 'PERIOD · 项目周期', value: work.period },
                { label: 'CATEGORY · 分类', value: work.categoryLabel },
              ].map((m) => (
                <div key={m.label} className="glass-sm rounded-field p-4">
                  <p className="type-label mb-2 text-[10px]">{m.label}</p>
                  <p className="text-sm text-text-primary">{m.value}</p>
                </div>
              ))}
              <div className="glass-sm rounded-field p-4">
                <p className="type-label mb-2 text-[10px]">TAGS · 关键词</p>
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* ============ 设计理念 ============ */}
        <section className="border-b border-white/10 py-14 md:py-16" aria-labelledby="concept-h">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={HEADER_TRANSITION}
            className="glass-lg rounded-panel p-8 md:p-12"
          >
            <h2 id="concept-h" className="type-h2 mb-6 text-text-primary">
              设计<span className="text-gradient">理念</span>
            </h2>
            <p className="type-body mb-5 max-w-[64ch]">{work.concept}</p>
            <p className="type-body max-w-[64ch]">{work.description}</p>

            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {work.details.map((d, i) => (
                <li key={i} className="flex gap-4">
                  <span className="type-num flex-none text-sm text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="type-body text-sm">{d}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* ============ 主要页面陈列 ============ */}
        <section className="border-b border-white/10 py-14 md:py-16" aria-labelledby="pages-h">
          <h2 id="pages-h" className="type-h2 mb-4 text-text-primary">
            页面<span className="text-gradient">陈列</span>
          </h2>
          <p className="type-body mb-10">按交付顺序排列的主要设计页面。</p>

          <div className="flex flex-col gap-8">
            {work.pageImages.map((src, i) => (
              <motion.figure
                key={src + i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={HEADER_TRANSITION}
                className="glass overflow-hidden rounded-card"
              >
                <div className="media-crop relative aspect-[16/9]">
                  <img src={src} alt={`${work.title} 页面 ${i + 1}`} loading="lazy" decoding="async" />
                </div>
                <figcaption className="flex items-center justify-between border-t border-white/10 px-6 py-3.5">
                  <span className="text-sm text-text-primary">
                    {work.title} · 页面 {i + 1}
                  </span>
                  <span className="type-num text-xs text-muted">
                    FRAME {String(i).padStart(2, '0')}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* ============ 主要原稿 ============ */}
        <section className="border-b border-white/10 py-14 md:py-16" aria-labelledby="originals-h">
          <h2 id="originals-h" className="type-h2 mb-4 text-text-primary">
            主要<span className="text-gradient">原稿</span>
          </h2>
          <p className="type-body mb-10">点击卡片可在灯箱中查看完整原稿。</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {work.originalImages.map((img, i) => (
              <motion.button
                key={img.src + i}
                type="button"
                onClick={() => setLightbox(img)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...HEADER_TRANSITION, delay: i * 0.06 }}
                className="glass glass-hover spotlight group relative overflow-hidden rounded-card text-left"
                aria-label={`查看 ${img.label}`}
              >
                <div className="media-crop relative aspect-[4/3]">
                  <img
                    src={img.src}
                    alt={img.label}
                    loading="lazy"
                    decoding="async"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-bg/90 to-transparent p-4">
                  <span className="text-sm text-text-primary">{img.label}</span>
                  <span aria-hidden="true" className="text-accent">
                    ⤢
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ============ 相关作品 ============ */}
        <section className="py-14 md:py-16" aria-labelledby="related-h">
          <h2 id="related-h" className="type-h2 mb-10 text-text-primary">
            其他<span className="text-gradient">作品</span>
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...HEADER_TRANSITION, delay: i * 0.06 }}
              >
                <Link
                  to={`/works/${w.id}`}
                  className="glass glass-hover group block overflow-hidden rounded-card"
                  aria-label={`查看 ${w.title}`}
                >
                  <div className="media-crop relative aspect-[4/3]">
                    <img
                      src={w.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="type-label mb-1.5 !text-accent">{w.categoryLabel}</p>
                    <p className="type-h3 text-text-primary">{w.title}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ============ 原稿灯箱 ============ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.label}
          >
            <motion.figure
              className="glass-lg relative max-h-[88svh] max-w-6xl overflow-hidden rounded-card"
              initial={{ scale: 0.94, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="media-crop-auto relative">
                <img src={lightbox.src} alt={lightbox.label} className="max-h-[80svh] w-auto" />
              </div>
              <figcaption className="flex items-center justify-between border-t border-white/10 px-6 py-3">
                <span className="text-sm text-text-primary">
                  {work.title} · {lightbox.label}
                </span>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="text-muted transition-colors hover:text-accent"
                  aria-label="关闭灯箱"
                >
                  ✕
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

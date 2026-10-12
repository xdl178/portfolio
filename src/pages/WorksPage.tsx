import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories, works } from '../data/works'
import { HEADER_TRANSITION, HEADER_VIEWPORT } from '../components/SectionHeader'

/* ============================================================
   WorksPage · 作品档案馆 /works（参考 portfolio-test 布局）
   刊头（巨字 + 统计）→ 分类筛选 → 不对称大卡列表
   封面 7 列 / 信息 5 列，奇偶行交替；整卡点击进详情
   ============================================================ */

export default function WorksPage() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? works : works.filter((w) => w.category === filter)

  const totalPages = works.reduce((s, w) => s + w.pageImages.length, 0)
  const totalOriginals = works.reduce((s, w) => s + w.originalImages.length, 0)

  return (
    <div className="relative bg-bg pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        {/* ============ 刊头 ============ */}
        <header className="border-b border-white/10 pb-12 md:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={HEADER_TRANSITION}
            className="type-label mb-6"
          >
            THE ARCHIVE · 作品档案馆
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...HEADER_TRANSITION, delay: 0.1 }}
            className="type-display text-text-primary"
          >
            作品<span className="text-gradient">档案</span>
          </motion.h1>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...HEADER_TRANSITION, delay: 0.18 }}
              className="type-body lg:col-span-7 lg:max-w-[56ch]"
            >
              收录全部精选项目：从品牌视觉、产品界面到动态影像。点击任意作品进入详情，
              查看完整页面陈列与主要原稿。
            </motion.p>

            {/* 统计卡 */}
            <div className="grid grid-cols-3 gap-3 lg:col-span-5 md:gap-4">
              {[
                { num: String(works.length).padStart(2, '0'), label: '件精选作品' },
                { num: String(totalPages).padStart(2, '0'), label: '张设计页面' },
                { num: String(totalOriginals).padStart(2, '0'), label: '张主要原稿' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...HEADER_TRANSITION, delay: 0.24 + i * 0.07 }}
                  className="glass-sm glass-hover rounded-field p-4"
                >
                  <p className="type-num text-2xl font-semibold text-accent md:text-3xl">
                    {s.num}
                  </p>
                  <p className="mt-2 text-xs text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </header>

        {/* ============ 分类筛选 ============ */}
        <div className="flex flex-wrap items-center gap-2 py-8 md:py-10">
          {categories.map((c) => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-xs transition-colors duration-200 sm:text-[13px] ${
                  active
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:text-text-primary'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        {/* ============ 不对称大卡列表 ============ */}
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          {filtered.map((work, i) => {
            const even = i % 2 === 1
            return (
              <motion.article
                key={work.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={HEADER_VIEWPORT}
                transition={{ ...HEADER_TRANSITION, delay: Math.min(i, 2) * 0.06 }}
              >
                <Link
                  to={`/works/${work.id}`}
                  className="group grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10"
                  aria-label={`查看 ${work.title}`}
                >
                  {/* 封面区 */}
                  <div
                    className={`lg:col-span-7 ${even ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'}`}
                  >
                    <div className="glass glass-hover spotlight relative overflow-hidden rounded-card">
                      <div className="media-crop relative aspect-[16/10]">
                        <img
                          src={work.cover}
                          alt={`${work.title} 封面`}
                          loading="lazy"
                          decoding="async"
                          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                      {/* 序号水印 */}
                      <span
                        aria-hidden="true"
                        className="type-num absolute left-5 top-4 text-4xl font-bold text-white/15 md:text-5xl"
                      >
                        {work.serial}
                      </span>
                      {/* 分类章 */}
                      <span className="chip absolute right-4 top-4 !border-accent/40 !text-accent">
                        {work.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* 信息区 */}
                  <div
                    className={`flex flex-col justify-center lg:col-span-5 ${even ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <p className="type-label mb-4">EXHIBIT N° {work.serial}</p>
                    <h2 className="type-h2 text-text-primary transition-colors duration-300 group-hover:text-accent">
                      {work.title}
                    </h2>
                    <p className="type-label mt-2 !text-accent/80">{work.titleEn}</p>

                    <p className="type-body mt-5 max-w-[46ch] text-sm">{work.shortDesc}</p>

                    {/* 元信息 */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="glass-sm rounded-field p-4">
                        <p className="type-label mb-1.5 text-[10px]">ROLE · 角色</p>
                        <p className="text-sm text-text-primary">{work.role}</p>
                      </div>
                      <div className="glass-sm rounded-field p-4">
                        <p className="type-label mb-1.5 text-[10px]">YEAR · 年份</p>
                        <p className="type-num text-sm text-text-primary">{work.year}</p>
                      </div>
                    </div>

                    {/* 进入指示 */}
                    <div className="mt-6 flex items-center gap-3 text-muted transition-colors duration-300 group-hover:text-accent">
                      <span className="text-xs">查看详情</span>
                      <span className="relative h-px w-10 overflow-hidden bg-white/15">
                        <span className="absolute inset-0 w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                      </span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="type-display mb-4 text-white/[0.06]">EMPTY</p>
            <p className="type-label mb-8">此分类下暂无作品</p>
            <button type="button" onClick={() => setFilter('all')} className="btn btn-ghost">
              查看全部作品
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

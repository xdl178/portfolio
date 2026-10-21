import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionHeader, { HEADER_TRANSITION, HEADER_VIEWPORT } from './SectionHeader'
import { works } from '../data/works'

/* ============================================================
   SelectedWorks · 精选作品 Bento 网格（首页）
   - 数据驱动：works.ts 前 4 件
   - 点击进入 /works/:id 详情页
   - 底部「查看全部作品」→ /works 档案页
   ============================================================ */

/** 写入光标坐标，驱动 .spotlight 的径向高光 */
function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function SelectedWorks() {
  return (
    <section id="work" className="relative bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          title={
            <>
              精选<span className="text-gradient">作品</span>
            </>
          }
          subtitle="近期交付的品牌、产品与影像项目。"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-12 md:gap-6">
          {works.slice(0, 4).map((work, i) => (
            <motion.article
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={HEADER_VIEWPORT}
              transition={{ ...HEADER_TRANSITION, delay: i * 0.08 }}
              onMouseMove={handleSpotlight}
              className={`spotlight glass glass-hover group relative overflow-hidden rounded-card ${SPANS[i % SPANS.length]}`}
            >
              <Link to={`/works/${work.id}`} className="block" aria-label={`查看 ${work.title}`}>
                <div className="media-crop relative aspect-[4/3]">
                  <img
                    src={work.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                {/* 底部渐隐，保证标题对比度 */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg via-bg/70 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="type-label mb-1.5 !text-accent">{work.categoryLabel}</p>
                    <h3 className="type-h3 text-text-primary">{work.title}</h3>
                  </div>
                  <span className="type-num text-xs text-muted">N°{work.serial}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* 查看全部作品 CTA */}
        <div className="mt-12 flex justify-center md:mt-16">
          <Link to="/works" className="btn btn-ghost">
            查看全部作品
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

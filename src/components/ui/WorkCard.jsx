import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/* 没有封面图时，按序号生成一组冷色渐变，保证每张卡都不一样 */
const gradients = [
  'from-[#4D6BFE] to-[#00C2FF]',
  'from-[#2440CC] to-[#7C4DFF]',
  'from-[#00C2FF] to-[#4D6BFE]',
  'from-[#7C4DFF] to-[#4D6BFE]',
  'from-[#3A55E8] to-[#00C2FF]',
  'from-[#0B1220] to-[#4D6BFE]',
]

export default function WorkCard({ work, index = 0 }) {
  const gradient = gradients[index % gradients.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/works/${work.slug}`} className="card card-hover block h-full">
        {/* 封面 */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {work.cover ? (
            <img
              src={work.cover}
              alt={work.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradient}`}>
              {/* 占位封面：网格底纹 + 序号，等替换成真图 */}
              <div className="absolute inset-0 bg-grid-tech opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-[clamp(40px,6vw,68px)] font-bold leading-none text-white/85 tnum">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
                  {work.category}
                </span>
                <span className="font-mono text-[11px] text-white/80">{work.year}</span>
              </div>
            </div>
          )}

          {/* 悬停时扫过的高光 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </div>

        {/* 文字区 */}
        <div className="p-6">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-faint">
            <span className="text-brand">{work.category}</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>{work.year}</span>
          </div>

          <h3 className="mt-3 font-display text-card-title text-ink transition-colors duration-300 group-hover:text-brand">
            {work.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-body-sm text-slate-soft">{work.summary}</p>

          {work.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-pill bg-mist px-3 py-1 font-mono text-[11px] text-slate-soft transition-colors group-hover:bg-brand-soft group-hover:text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

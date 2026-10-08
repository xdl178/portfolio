/**
 * 无缝跑马灯：内容渲染两遍，靠 translateX(-50%) 实现无缝循环。
 * 悬停时暂停，方便阅读。
 */
export default function Marquee({ items, className = '', speed = 'animate-marquee' }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-6 font-mono text-meta uppercase tracking-[0.14em] text-slate-faint transition-colors hover:text-brand">
            {item}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-brand-line" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      {/* 两端渐隐遮罩，让循环边界看不出来 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
      <div className={`flex w-max ${speed} group-hover:[animation-play-state:paused]`}>
        {row}
        {row}
      </div>
    </div>
  )
}

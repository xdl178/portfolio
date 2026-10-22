/* ============================================================
   Backdrop · 全站固定装饰层（网格 + 光晕 + 噪点）
   - 固定、pointer-events-none、aria-hidden
   - 只提供「光来自深处」的氛围，不承载内容
   ============================================================ */

export default function Backdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 透视网格（缓慢漂移 + 径向淡出） */}
      <div className="bg-grid mask-radial animate-grid-pan absolute inset-0 opacity-40" />

      {/* 光晕：青色主光 + 品红副光 */}
      <span
        className="glow glow-brand animate-float-slow"
        style={{ width: '44rem', height: '44rem', left: '-14rem', top: '-16rem' }}
      />
      <span
        className="glow glow-indigo animate-float-slow"
        style={{ width: '34rem', height: '34rem', right: '-12rem', top: '42%', animationDelay: '-5s' }}
      />

      {/* 顶部 / 底部压暗，保证导航与页脚文字对比度 */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      {/* 颗粒噪点 */}
      <div className="noise absolute inset-0" />
    </div>
  )
}

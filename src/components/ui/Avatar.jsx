import { profile } from '../../data/content.js'

/**
 * 头像：没有配图时自动生成首字母头像（渐变底 + 品牌色光环）。
 * 想用真图：把图片放进 public/，然后在 content.js 里设置
 *   avatarImage: '/portfolio/avatar.jpg'
 */
export default function Avatar({ size = 'lg', className = '' }) {
  const dims = {
    sm: 'h-14 w-14 text-[18px]',
    md: 'h-20 w-20 text-[24px]',
    lg: 'h-32 w-32 text-[40px] md:h-36 md:w-36 md:text-[44px]',
  }[size]

  const initials = profile.name.slice(0, 2).toUpperCase()

  return (
    <div className={`relative inline-block ${className}`}>
      {/* 外圈脉冲光环 */}
      <span className="pointer-events-none absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-brand/20" />
      {/* 渐变描边 */}
      <span className="absolute -inset-[3px] rounded-full bg-brand-gradient opacity-90 blur-[1px]" />
      <div className={`relative grid ${dims} place-items-center overflow-hidden rounded-full bg-brand-soft font-display font-bold text-brand ring-4 ring-white`}>
        {profile.avatarImage ? (
          <img
            src={profile.avatarImage}
            alt={`${profile.name} 的头像`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <>
            <span className="absolute inset-0 bg-brand-soft-gradient" />
            <span className="relative">{initials}</span>
          </>
        )}
      </div>
    </div>
  )
}

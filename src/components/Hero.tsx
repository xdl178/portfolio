import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Badge from './Badge'

/* ============================================================
   Hero · 巨字 + 品牌字首屏
   概念：工作台照片原色保留，只压一层 40% 透明的品牌蓝（brand）；
        一行 240px 的描边 PORTFOLIO 横贯版心正中作肌理，
        白「设计」压左上、蓝「未来」压右下，三块文字形成一条对角张力线。
   - 背景层：工作台照片（完整构图，不再放大裁切）+ 40% 品牌蓝 + 暗幕
   - 内容层：PORTFOLIO / 设计 / 未来 三块文字，全部收在 1400px 版心内
   - 顶栏：左引文 ｜ 右标签 chip；底栏：BASE / STATUS ｜ 居中 SCROLL
   - 入场：首屏图真实加载完成（active）后 GSAP 编排
   api：bgSrc 由 App 的预加载提供（object URL，保证零二次请求）
   ============================================================ */

const FONT_SANS = "'Source Han Sans CN','PingFang SC','Microsoft YaHei',sans-serif"
const FONT_MONO = "ui-monospace,'SF Mono','Cascadia Mono',Consolas,monospace"

/* 悬浮微尘（确定性参数，避免重渲抖动） */
const PARTICLES = [
  { left: '6%', size: 3, dur: 19, delay: -3, o: 0.55, px: '30px' },
  { left: '14%', size: 2, dur: 24, delay: -11, o: 0.4, px: '-24px' },
  { left: '24%', size: 4, dur: 16, delay: -7, o: 0.5, px: '18px' },
  { left: '38%', size: 2, dur: 21, delay: -15, o: 0.35, px: '34px' },
  { left: '52%', size: 3, dur: 18, delay: -2, o: 0.6, px: '-16px' },
  { left: '64%', size: 2, dur: 26, delay: -9, o: 0.45, px: '26px' },
  { left: '76%', size: 3, dur: 17, delay: -13, o: 0.5, px: '-28px' },
  { left: '88%', size: 2, dur: 22, delay: -5, o: 0.4, px: '14px' },
  { left: '95%', size: 3, dur: 20, delay: -18, o: 0.55, px: '-20px' },
] as const

type Props = { active: boolean; bgSrc: string | null }

export default function Hero({ active, bgSrc }: Props) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const playedRef = useRef(false)

  /* 鼠标视差：整层（照片 + 暗幕）一起位移，保证剪影窗不脱离屏幕 */
  useEffect(() => {
    if (reduceMotion) return
    const root = rootRef.current
    const layer = root?.querySelector('.hero-p-bg')
    if (!root || !layer) return

    const xTo = gsap.quickTo(layer, 'x', { duration: 1.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(layer, 'y', { duration: 1.2, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      xTo(nx * -14)
      yTo(ny * -9)
    }
    root.addEventListener('mousemove', onMove)
    return () => { root.removeEventListener('mousemove', onMove); xTo.tween.kill(); yTo.tween.kill(); gsap.set(layer, { clearProps: 'transform' }) }
  }, [reduceMotion])

  /* 入场编排：由 App 的 active（加载屏结束）触发，只播一次 */
  useEffect(() => {
    if (!active) return
    if (reduceMotion) return
    if (playedRef.current) return
    playedRef.current = true

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.hero-bg-in',
        { opacity: 0.35, scale: 1.06, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.8 },
        0,
      )
        /* 暗幕浮现：整图可见 → 四周压暗，只剩「创造」透光 */
        .fromTo('.hero-veil', { opacity: 0 }, { opacity: 1, duration: 1.35 }, 0.3)
        .fromTo(
          '.hero-line',
          { y: 110, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05, stagger: 0.11 },
          0.5,
        )
        .fromTo(
          '.hero-anno',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.95,
        )
        .fromTo(
          '.hero-ui',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          1.05,
        )
    }, rootRef)
    return () => ctx.revert()
  }, [active, reduceMotion])

  /* 滚动离场：背景微放大，内容上移淡出 */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section id="home" ref={rootRef} className="home-section relative w-full overflow-hidden">
      <div className="relative min-h-[100svh] w-full overflow-hidden">
      <h1 className="sr-only">［工作室名称］，设计未来</h1>

      {/* ================= 背景层 ================= */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* 滚动缩放 */}
        <motion.div className="absolute inset-0" style={{ scale: reduceMotion ? 1 : bgScale }}>
          {/* 鼠标视差（整层统一） */}
          <div className="hero-p-bg absolute inset-0">
            {/* 入场层 */}
            <div className="hero-bg-in absolute inset-0">
              {/* 呼吸缩放：照片与暗幕同步 */}
              <div className="hero-zoom absolute inset-0">
                {bgSrc && (
                  <img
                    src={bgSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                )}
                {/* 品牌蓝 brand · 40% 透明：轻轻压一层色调，原图颜色保留 */}
                <div className="absolute inset-0 bg-brand/40" />

                {/* ---- 桌面构图 1440×810：暗幕 + 注记（文字层在内容层） ---- */}
                <svg
                  className="absolute inset-0 hidden h-full w-full md:block"
                  viewBox="0 0 1440 810"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="heroVeilDV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.58" />
                      <stop offset="0.36" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0" />
                      <stop offset="0.72" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.76" />
                      <stop offset="1" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.94" />
                    </linearGradient>
                    <linearGradient id="heroVeilDH" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.52" />
                      <stop offset="0.42" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0" />
                      <stop offset="1" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.18" />
                    </linearGradient>
                    <radialGradient id="heroGlyphGlowD" cx="0.51" cy="0.4" r="0.44">
                      <stop offset="0" stopColor="rgb(var(--brand-rgb))" stopOpacity="0.5" />
                      <stop offset="1" stopColor="rgb(var(--brand-rgb))" stopOpacity="0" />
                    </radialGradient>
                    {/* 底部压暗带（不参与镂空），给巨字与 CTA 干净地面 */}
                    <linearGradient id="heroScrimD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0.58" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0" />
                      <stop offset="0.78" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.6" />
                      <stop offset="1" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.92" />
                    </linearGradient>
                  </defs>

                  <g className="hero-veil">
                    <rect width="1440" height="810" fill="url(#heroVeilDV)" />
                    <rect width="1440" height="810" fill="url(#heroVeilDH)" />
                    <rect width="1440" height="810" fill="url(#heroGlyphGlowD)" />
                    {/* 底部压暗带：给巨字与 CTA 干净地面 */}
                    <rect width="1440" height="810" fill="url(#heroScrimD)" />
                  </g>

                  {/* 文字全部交给内容层（HTML + 1400 版心），此处只保留注记 */}

                  {/* 注记（英文 mono 点缀） */}
                  <g fontFamily={FONT_MONO} fill="var(--muted)">
                    <text
                      className="hero-anno"
                      x="452"
                      y="492"
                      fontSize="20"
                      fill="rgb(var(--brand-rgb))"
                      fontFamily={FONT_SANS}
                    >
                      ✦
                    </text>
                  </g>

                  {/* HUD 角标 */}
                  <g
                    className="hero-anno"
                    stroke="rgb(var(--paper-rgb)/0.2)"
                    strokeWidth="1"
                    fill="none"
                  >
                    <path d="M28 48 V28 H48" />
                    <path d="M1392 28 H1412 V48" />
                    <path d="M28 762 V782 H48" />
                    <path d="M1392 782 H1412 V762" />
                  </g>
                </svg>

                {/* ---- 移动构图 390×844 ---- */}
                <svg
                  className="absolute inset-0 h-full w-full md:hidden"
                  viewBox="0 0 390 844"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="heroVeilMV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.58" />
                      <stop offset="0.4" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0" />
                      <stop offset="0.72" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.8" />
                      <stop offset="1" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.94" />
                    </linearGradient>
                    <radialGradient id="heroGlyphGlowM" cx="0.5" cy="0.4" r="0.5">
                      <stop offset="0" stopColor="rgb(var(--brand-rgb))" stopOpacity="0.46" />
                      <stop offset="1" stopColor="rgb(var(--brand-rgb))" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="heroScrimM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0.56" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0" />
                      <stop offset="0.76" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.62" />
                      <stop offset="1" stopColor="rgb(var(--hero-veil-rgb))" stopOpacity="0.94" />
                    </linearGradient>
                  </defs>
                  <g className="hero-veil">
                    <rect width="390" height="844" fill="url(#heroVeilMV)" />
                    <rect width="390" height="844" fill="url(#heroGlyphGlowM)" />
                    <rect width="390" height="844" fill="url(#heroScrimM)" />
                  </g>
                  <g className="hero-anno" stroke="rgb(var(--paper-rgb)/0.2)" strokeWidth="1" fill="none">
                    <path d="M14 26 V14 H26" />
                    <path d="M364 14 H376 V26" />
                    <path d="M14 818 V830 H26" />
                    <path d="M364 830 H376 V818" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 屏幕光晕（叠在暗幕之上，给版心中心供光） */}
        <span
          className="glow glow-brand animate-pulse-soft"
          style={{
            width: '30rem',
            height: '30rem',
            left: '51%',
            top: '31%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.2,
          }}
        />

        {/* 斜向光带扫过 */}
        <div className="absolute inset-0 rotate-[-14deg] scale-125">
          <span
            className="absolute left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-[sweep_11s_ease-in-out_infinite]"
            style={{ top: '-25%', height: '150%' }}
          />
        </div>

        {/* 悬浮微尘 */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                '--po': p.o,
                '--px': p.px,
              } as CSSProperties
            }
          />
        ))}

        {/* 底部渐隐到页面底色 */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* ================= 内容层 ================= */}
      <motion.div className="absolute inset-0 z-10" style={reduceMotion ? { transform: 'none', opacity: 1 } : { y: contentY, opacity: contentOpacity }}>
        {/* 文字组：PORTFOLIO / 设计 / 未来，全部收在 1400px 版心内 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="relative mx-auto h-full w-full max-w-[var(--container-hero)] px-5 md:px-8">
            {/* PORTFOLIO：整站唯一一行，240px，描边，压在版心正中 */}
            <div
              className="absolute inset-x-0 top-1/2 flex justify-center overflow-hidden"
              style={{ transform: 'translateY(-50%)' }}
            >
              <span className="hero-line block whitespace-nowrap text-center font-extrabold leading-[0.78] tracking-[-0.01em] text-transparent [font-size:13.5vw] [-webkit-text-stroke:1.4px_rgb(var(--paper-rgb)/0.42)] md:[font-size:min(15.5vw,15rem)] lg:[font-size:min(16.7vw,15rem)]">
                PORTFOLIO
              </span>
            </div>

            {/* 设计：白，版心左上 */}
            <span className="hero-line absolute left-8 top-[30%] md:left-[12%] block font-extrabold leading-[0.9] tracking-[-0.01em] text-text-primary [font-size:clamp(3.2rem,12vw,11.5rem)] [text-shadow:0_12px_56px_rgb(var(--ink-rgb)/0.55)] md:top-[30%]">
              设计
            </span>

            {/* 未来：蓝渐变，版心右下 */}
            <span className="hero-line absolute bottom-[30%] right-8 md:right-[12%] block bg-[linear-gradient(166deg,rgb(var(--hero-highlight-rgb))_0%,rgb(var(--hero-mid-rgb))_28%,rgb(var(--brand-rgb))_64%,rgb(var(--accent-deep-rgb))_100%)] bg-clip-text text-right font-extrabold leading-[0.9] tracking-[-0.01em] text-transparent [font-size:clamp(3.2rem,12vw,11.5rem)] md:bottom-[30%]">
              未来
            </span>
          </div>
        </div>

        {/* 顶栏：左引文 ｜ 右标签（1400 版心） */}
        <div className="absolute inset-x-0 top-0">
          <div className="mx-auto flex max-w-[var(--container-hero)] flex-col-reverse items-start gap-3 px-5 pt-[4.5rem] md:flex-row md:items-start md:justify-between md:gap-5 md:px-8 md:pt-28">
            <p className="hero-quote w-full min-w-0 max-w-full break-words text-[11px] leading-[1.85] tracking-[0.03em] text-muted md:w-auto md:text-[13px]">
              / 每个音符都带着一种固执的确信：<br className="md:hidden" />自己绝不会是跑调的那一个。 /
            </p>
            <Badge className="hero-ui flex-none self-end text-[12px] md:self-auto">Visual UI Design 2026</Badge>
          </div>
        </div>

        {/* 底栏：BASE / STATUS（1400 版心） */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="hero-ui mx-auto flex max-w-[var(--container-hero)] flex-wrap items-end gap-x-12 gap-y-4 px-5 pb-8 md:gap-x-16 md:px-8 md:pb-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted">BASE</p>
              <p className="mt-1.5 text-[13px] text-muted">［城市 · 中国］</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted">STATUS</p>
              <p className="mt-1.5 flex items-center gap-2 text-[13px] text-muted">
                <span
                  aria-hidden="true"
                  className="pulse-dot h-1.5 w-1.5 flex-none rounded-full bg-brand"
                />
                合作状态待补充
              </p>
            </div>
          </div>
        </div>

        {/* 滚动指示（居中） */}
        <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 lg:block">
          <div className="hero-ui flex flex-col items-center gap-2.5">
            <span className="type-label text-[10px]">SCROLL</span>
            <span className="glass-sm flex h-10 w-6 justify-center rounded-full p-1">
              <span className="scroll-cue-bar h-2 w-0.5 rounded-full bg-accent" />
            </span>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  )
}

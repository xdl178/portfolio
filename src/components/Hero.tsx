import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

/* ============================================================
   Hero · 「巨字取景窗」首屏
   概念：暗幕罩住整张隧道图，唯独「未来」两个字被镂空——
        隧道深处的光从字形里透出来，字是"活"的。
   - 背景层：隧道图（呼吸缩放）+ 鼠标视差 + 滚动缩放
   - 蒙版层：SVG luminance mask（黑字 = 挖洞），桌面/移动两套构图
   - 内容层：左上 eyebrow / 底部信息栏（简介 + CTA + 状态）/ 滚动指示
   - 入场：加载屏结束后 GSAP 编排（暗幕浮现 → 巨字升起 → UI 错落进场）
   ============================================================ */

const FONT_SANS =
  "'PingFang SC','HarmonyOS Sans SC','MiSans','Microsoft YaHei','Noto Sans SC',sans-serif"
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

type Props = { active: boolean }

export default function Hero({ active }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const playedRef = useRef(false)
  const navigate = useNavigate()
  const [time, setTime] = useState('--:--:--')

  /* 底部时钟（GMT+8 占位，非真实数据） */
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, '0'))
          .join(':'),
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  /* 鼠标视差：背景与蒙版反向位移，制造景深（字形窗口扫过光带） */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = rootRef.current
    if (!root || !root.querySelector('.hero-p-bg')) return

    const bX = gsap.quickTo(root.querySelector('.hero-p-bg'), 'x', {
      duration: 1.1,
      ease: 'power3.out',
    })
    const bY = gsap.quickTo(root.querySelector('.hero-p-bg'), 'y', {
      duration: 1.1,
      ease: 'power3.out',
    })
    const fX = gsap.quickTo(root.querySelector('.hero-p-fg'), 'x', {
      duration: 1.4,
      ease: 'power3.out',
    })
    const fY = gsap.quickTo(root.querySelector('.hero-p-fg'), 'y', {
      duration: 1.4,
      ease: 'power3.out',
    })

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      bX(nx * -16)
      bY(ny * -10)
      fX(nx * 9)
      fY(ny * 6)
    }
    root.addEventListener('mousemove', onMove)
    return () => root.removeEventListener('mousemove', onMove)
  }, [])

  /* 入场编排：由 App 的 active（加载屏结束）触发，只播一次 */
  useEffect(() => {
    if (!active || playedRef.current) return
    playedRef.current = true

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.hero-bg-in',
        { opacity: 0.3, scale: 1.16, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.7 },
        0,
      )
        /* 暗幕浮现：整图可见 → 四周压暗，只剩「未来」透光 */
        .fromTo('.hero-veil', { opacity: 0 }, { opacity: 1, duration: 1.3 }, 0.35)
        .fromTo(
          '.hero-line',
          { y: 110, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05 },
          0.55,
        )
        .fromTo(
          '.hero-anno',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          1.0,
        )
        .fromTo(
          '.hero-ui',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          1.1,
        )
    }, rootRef)
    return () => ctx.revert()
  }, [active])

  /* 滚动离场：背景微放大，内容上移淡出 */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      <h1 className="sr-only">［工作室名称］，创造未来</h1>

      {/* ================= 背景层 ================= */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* 滚动缩放 */}
        <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
          {/* 鼠标视差（负向） */}
          <div className="hero-p-bg absolute inset-0">
            {/* 入场层 */}
            <div className="hero-bg-in absolute inset-0">
              <div className="media-crop absolute inset-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/hero-tunnel.png`}
                  alt=""
                  className="animate-[hero-zoom_28s_ease-in-out_infinite_alternate]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- 巨字取景窗：暗幕 + 镂空（鼠标正向视差） ---- */}
        <div className="hero-p-fg absolute inset-0">
          {/* 桌面构图 1440×810 */}
          <svg
            className="absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 1440 810"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="heroVeilDV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#060A12" stopOpacity="0.9" />
                <stop offset="0.42" stopColor="#060A12" stopOpacity="0.72" />
                <stop offset="1" stopColor="#060A12" stopOpacity="0.94" />
              </linearGradient>
              <linearGradient id="heroVeilDH" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#060A12" stopOpacity="0.55" />
                <stop offset="0.5" stopColor="#060A12" stopOpacity="0" />
                <stop offset="1" stopColor="#060A12" stopOpacity="0.22" />
              </linearGradient>
              <radialGradient id="heroGlyphGlowD" cx="1100/1440" cy="470/810" r="0.5">
                <stop offset="0" stopColor="#2ED9F5" stopOpacity="0.45" />
                <stop offset="1" stopColor="#2ED9F5" stopOpacity="0" />
              </radialGradient>
              {/* luminance mask：白 = 罩住，黑 = 镂空（字洞） */}
              <mask id="heroMaskD" maskUnits="userSpaceOnUse">
                <rect width="1440" height="810" fill="#fff" />
                <text
                  x="680"
                  y="600"
                  fontSize="320"
                  fontWeight={700}
                  fontFamily={FONT_SANS}
                  fill="#000"
                  letterSpacing="6"
                >
                  未来
                </text>
              </mask>
            </defs>
            <g className="hero-veil">
              <rect width="1440" height="810" fill="url(#heroVeilDV)" mask="url(#heroMaskD)" />
              <rect width="1440" height="810" fill="url(#heroVeilDH)" mask="url(#heroMaskD)" />
              <rect width="1440" height="810" fill="url(#heroGlyphGlowD)" mask="url(#heroMaskD)" />
            </g>

            {/* 实心巨字：创造 */}
            <text
              className="hero-line"
              x="100"
              y="390"
              fontSize="320"
              fontWeight={700}
              fontFamily={FONT_SANS}
              fill="#F7FAFF"
              letterSpacing="6"
              style={{ filter: 'drop-shadow(0 0 26px rgba(46,217,245,0.28))' }}
            >
              创造
            </text>

            {/* 注记（英文 mono 点缀） */}
            <g fontFamily={FONT_MONO} fill="rgba(147,162,184,0.55)">
              <text className="hero-anno" x="104" y="78" fontSize="15" letterSpacing="5">
                01 / CREATE
              </text>
              <text className="hero-anno" x="1320" y="648" fontSize="15" letterSpacing="5" textAnchor="end">
                02 / FUTURE
              </text>
              <text className="hero-anno" x="782" y="180" fontSize="24" fill="#2ED9F5" fontFamily={FONT_SANS}>
                ✦
              </text>
            </g>

            {/* HUD 角标 */}
            <g
              className="hero-anno"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              fill="none"
            >
              <path d="M28 48 V28 H48" />
              <path d="M1392 28 H1412 V48" />
              <path d="M28 762 V782 H48" />
              <path d="M1392 782 H1412 V762" />
            </g>
          </svg>

          {/* 移动构图 390×844 */}
          <svg
            className="absolute inset-0 h-full w-full md:hidden"
            viewBox="0 0 390 844"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="heroVeilMV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#060A12" stopOpacity="0.9" />
                <stop offset="0.45" stopColor="#060A12" stopOpacity="0.74" />
                <stop offset="1" stopColor="#060A12" stopOpacity="0.94" />
              </linearGradient>
              <radialGradient id="heroGlyphGlowM" cx="240/390" cy="500/844" r="0.55">
                <stop offset="0" stopColor="#2ED9F5" stopOpacity="0.45" />
                <stop offset="1" stopColor="#2ED9F5" stopOpacity="0" />
              </radialGradient>
              <mask id="heroMaskM" maskUnits="userSpaceOnUse">
                <rect width="390" height="844" fill="#fff" />
                <text
                  x="100"
                  y="560"
                  fontSize="140"
                  fontWeight={700}
                  fontFamily={FONT_SANS}
                  fill="#000"
                  letterSpacing="3"
                >
                  未来
                </text>
              </mask>
            </defs>
            <g className="hero-veil">
              <rect width="390" height="844" fill="url(#heroVeilMV)" mask="url(#heroMaskM)" />
              <rect width="390" height="844" fill="url(#heroGlyphGlowM)" mask="url(#heroMaskM)" />
            </g>
            <text
              className="hero-line"
              x="30"
              y="300"
              fontSize="150"
              fontWeight={700}
              fontFamily={FONT_SANS}
              fill="#F7FAFF"
              letterSpacing="3"
              style={{ filter: 'drop-shadow(0 0 18px rgba(46,217,245,0.28))' }}
            >
              创造
            </text>
            <g fontFamily={FONT_MONO} fill="rgba(147,162,184,0.55)">
              <text className="hero-anno" x="32" y="148" fontSize="10" letterSpacing="3">
                01 / CREATE
              </text>
              <text className="hero-anno" x="378" y="620" fontSize="10" letterSpacing="3" textAnchor="end">
                02 / FUTURE
              </text>
            </g>
            <g className="hero-anno" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none">
              <path d="M14 26 V14 H26" />
              <path d="M364 14 H376 V26" />
              <path d="M14 818 V830 H26" />
              <path d="M364 830 H376 V818" />
            </g>
          </svg>
        </div>

        {/* 消失点光晕（叠在暗幕之上，向「未来」二字供光） */}
        <span
          className="glow glow-cyan animate-pulse-soft"
          style={{
            width: '32rem',
            height: '32rem',
            left: '58%',
            top: '46%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.4,
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
      <motion.div
        className="absolute inset-0 z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* 右上品牌占位（左上角留给 SVG 注记 01/CREATE） */}
        <div className="hero-ui absolute right-6 top-24 text-right md:right-10 md:top-28">
          <p className="type-label">
            ［独立设计工作室］<span className="hidden md:inline"> INDEPENDENT STUDIO</span>
          </p>
        </div>

        {/* 底部信息栏 */}
        <div className="hero-ui absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-10">
          <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-8">
            <div className="max-w-md">
              <p className="mb-5 text-sm leading-relaxed text-muted md:text-base">
                ［一句话简介：以设计与技术，把复杂译成直觉。］
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/works')}
                  className="btn btn-primary"
                >
                  查看作品
                  <span aria-hidden="true">→</span>
                </button>
                <a href="mailto:hello@studio.example" className="btn btn-ghost">
                  联系我们
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="hidden flex-col items-end gap-3 sm:flex">
              <span className="chip">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                接受新项目委托
              </span>
              <span className="type-num text-sm text-muted">GMT+8 · {time}</span>
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
    </section>
  )
}

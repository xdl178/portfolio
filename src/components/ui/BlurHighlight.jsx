import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './BlurHighlight.css'

/* ==========================================================================
   BlurHighlight · 模糊高亮段落
   - 段落逐「词」入场：从模糊 + 低透明过渡到清晰（filter: blur → 0）
   - keywords 里的关键词自动高亮：品牌蓝色块从左向右扫过（highlight sweep）
   - 关键词颜色按 colors 数组循环取用，形成蓝 / 青 / 紫的冷暖节奏
   - 非关键词只做 blur-in，保证长段落整段可读
   - 滚动进入视口触发一次（once），不重复播放
   - 系统开启 prefers-reduced-motion 时跳过全部动画，直接显示静态成品
   ========================================================================== */

/* 本站是白底深字，关键词改用蓝白科技三色循环；
   末位的深蓝用于在浅底上补足对比度，避免长段落里高亮词发灰。 */
const DEFAULT_COLORS = ['#4D6BFE', '#7C4DFF', '#00A6D6', '#2440CC', '#0B1220']

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const BlurHighlight = ({
  text = '',
  keywords = [],
  className = '',
  baseColor = '#0B1220',
  colors = DEFAULT_COLORS,
  stagger = 0.045,
  blur = 10,
  idleOpacity = 0.15,
  size = 'default',
}) => {
  const prefersReduced = useReducedMotion()

  /* 把段落拆成「关键词单元 / 普通词单元 / 空白单元」。
     关键词按长度降序参与正则，避免短词抢走长词的匹配；用 Set 去重。 */
  const units = useMemo(() => {
    const source = String(text ?? '')
    const sortedKw = [...new Set((keywords ?? []).filter(Boolean))]
      .map((k) => String(k))
      .sort((a, b) => b.length - a.length)

    const pattern = sortedKw.length
      ? new RegExp(`(${sortedKw.map(escapeRegExp).join('|')})`, 'g')
      : null
    const chunks = pattern ? source.split(pattern).filter(Boolean) : [source]

    const out = []
    let colorIdx = 0

    chunks.forEach((chunk) => {
      const isKeyword = sortedKw.includes(chunk)
      if (isKeyword) {
        out.push({
          type: 'kw',
          text: chunk,
          color: colors[colorIdx % colors.length],
        })
        colorIdx += 1
        return
      }
      /* 普通片段按空白切开，并把空白保留成独立单元，
         这样 inline-block 的词之间换行行为正常，也不会吞掉空格 */
      chunk.split(/(\s+)/).forEach((part) => {
        if (part === '') return
        out.push({ type: part.trim() === '' ? 'space' : 'word', text: part })
      })
    })

    return out
  }, [text, keywords, colors])

  const rootClassName = [
    'blur-highlight',
    size === 'large' ? 'blur-highlight--lg' : '',
    size === 'compact' ? 'blur-highlight--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  /* 关键词整体状态显隐依赖 framer-motion；降低动态偏好下 initial={false}
     直接从终态渲染，配合 CSS 里的 reduce 分支做到完全静态。 */
  const hiddenState = { opacity: idleOpacity, filter: `blur(${blur}px)` }
  const shownState = { opacity: 1, filter: 'blur(0px)' }

  return (
    <p className={rootClassName} style={{ color: baseColor }}>
      {units.map((unit, i) => {
        if (unit.type === 'space') {
          return (
            <span key={i} className="blur-highlight__space">
              {' '}
            </span>
          )
        }

        if (unit.type === 'kw') {
          return (
            <motion.span
              key={i}
              className="blur-highlight__word blur-highlight__word--kw"
              initial={prefersReduced ? false : hiddenState}
              whileInView={shownState}
              viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 0.5, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 扫光层：品牌色色块从左到右扫过，仅作装饰 */}
              <motion.span
                className="blur-highlight__sweep"
                style={{ background: `linear-gradient(90deg, transparent, ${unit.color}, transparent)` }}
                initial={prefersReduced ? false : { x: '-100%' }}
                whileInView={{ x: '100%' }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.6, delay: i * stagger, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <span className="blur-highlight__text" style={{ color: unit.color }}>
                {unit.text}
              </span>
            </motion.span>
          )
        }

        return (
          <motion.span
            key={i}
            className="blur-highlight__word"
            initial={prefersReduced ? false : hiddenState}
            whileInView={shownState}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.5, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {unit.text}
          </motion.span>
        )
      })}
    </p>
  )
}

export default BlurHighlight

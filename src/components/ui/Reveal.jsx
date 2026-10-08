import { motion } from 'framer-motion'

/**
 * 入场动画包装器（Framer Motion）
 * 默认：进入视口时淡入 + 上移，只播一次。
 *
 * delay —— 延迟，用于做栅格错落
 * y     —— 位移距离
 * as    —— 渲染成什么标签（'div' / 'section' / 'li' ...）
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  as = 'div',
  className = '',
  once = true,
  amount = 0.25,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/** 子元素依次入场的容器：配合 stagger 使用 */
export function RevealGroup({ children, className = '', stagger = 0.08, delay = 0, ...rest }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** 配合 RevealGroup 使用的子项 */
export function RevealItem({ children, className = '', y = 24, as = 'div', ...rest }) {
  const MotionTag = motion[as] ?? motion.div
  return (
    <MotionTag
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

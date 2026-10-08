import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

/**
 * 数字滚动：进入视口后用弹簧动画从 from 滚到 to。
 * 支持小数位对齐与自定义千分位分隔符。
 */
export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
  style,
}) {
  const ref = useRef(null)
  const motionValue = useMotionValue(direction === 'down' ? to : from)

  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)

  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const getDecimalPlaces = (num) => {
    const str = num.toString()
    if (str.includes('.')) {
      const decimals = str.split('.')[1]
      if (parseInt(decimals, 10) !== 0) return decimals.length
    }
    return 0
  }

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to))

  const formatValue = (latest) => {
    const hasDecimals = maxDecimals > 0
    const options = {
      useGrouping: Boolean(separator),
      minimumFractionDigits: hasDecimals ? maxDecimals : 0,
      maximumFractionDigits: hasDecimals ? maxDecimals : 0,
    }
    const formatted = Intl.NumberFormat('en-US', options).format(latest)
    return separator ? formatted.replace(/,/g, separator) : formatted
  }

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(direction === 'down' ? to : from)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, direction, maxDecimals, separator])

  useEffect(() => {
    if (!isInView || !startWhen) return undefined

    if (typeof onStart === 'function') onStart()

    const startId = setTimeout(() => {
      motionValue.set(direction === 'down' ? from : to)
    }, delay * 1000)

    const endId = setTimeout(() => {
      if (typeof onEnd === 'function') onEnd()
    }, delay * 1000 + duration * 1000)

    return () => {
      clearTimeout(startId)
      clearTimeout(endId)
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest)
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue, maxDecimals, separator])

  return <span className={className} ref={ref} style={style} />
}

import { useState, useEffect } from 'react'

interface LoadingBarProps {
  percent?: number
  label?: string
  duration?: number
}

export function LoadingBar({ percent = 100, label = 'LOADING SUBSYSTEM', duration = 1200 }: LoadingBarProps) {
  const [displayed, setDisplayed] = useState(0)
  const TOTAL_BLOCKS = 10

  useEffect(() => {
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setDisplayed(Math.round(progress * percent))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplayed(percent)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [percent, duration])

  const filled = Math.round((displayed / 100) * TOTAL_BLOCKS)
  const empty = TOTAL_BLOCKS - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)

  return (
    <div role="status" aria-live="polite" aria-label={`${label}: ${displayed}%`}
      style={{ fontFamily: "'Share Tech Mono', monospace", color: '#02D7F2', fontSize: '1rem', whiteSpace: 'nowrap' }}>
      <span>[{bar}]</span>
      <span style={{ color: '#F2E900' }}> {displayed}%</span>
      <span style={{ color: '#25E1ED' }}> — {label}</span>
    </div>
  )
}

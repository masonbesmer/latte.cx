import { useRef, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

export function ScanlineTransition() {
  const lineRef = useRef<HTMLDivElement>(null)
  const runningRef = useRef(false)
  const router = useRouter()

  function trigger() {
    if (runningRef.current || !lineRef.current) return
    runningRef.current = true
    const el = lineRef.current

    el.style.transition = 'none'
    el.style.top = '-2px'
    el.style.opacity = '1'

    void el.offsetHeight

    el.style.transition = 'top 600ms linear, opacity 100ms ease 500ms'
    el.style.top = '100vh'
    el.style.opacity = '0'

    setTimeout(() => {
      runningRef.current = false
      if (lineRef.current) {
        lineRef.current.style.top = '-2px'
        lineRef.current.style.opacity = '0'
      }
    }, 700)
  }

  useEffect(() => {
    return router.subscribe('onResolved', () => {
      trigger()
    })
  }, [router])

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      style={{
        position: 'fixed', left: 0, right: 0, top: '-2px', height: '2px',
        opacity: 0, pointerEvents: 'none', zIndex: 9999,
        background: '#25E1ED',
        boxShadow: '0 0 6px 1px #25E1ED, 0 0 12px 3px rgba(37,225,237,0.5), 0 0 24px 6px rgba(37,225,237,0.25)',
      }}
    />
  )
}

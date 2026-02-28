import { useState, useEffect, useRef } from 'react'
import { CyclingSubtitle } from './CyclingSubtitle'

const TITLE = 'SONGBIRD'
const IDENTITY_LINE = '// IDENTITY CONFIRMED: SONGBIRD'
const SCRAMBLE_CHARS = '!@#$%^&*░▒▓'
const SCRAMBLE_DURATION = 1500
const CHAR_STAGGER = 50

export function HeroSection() {
  const [titleChars, setTitleChars] = useState<string[]>(TITLE.split('').map(() => SCRAMBLE_CHARS[0]))
  const [identityText, setIdentityText] = useState('')
  const [identityCursorVisible, setIdentityCursorVisible] = useState(true)
  const [identityDone, setIdentityDone] = useState(false)
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const chars = TITLE.split('')
    chars.forEach((targetChar, i) => {
      const startDelay = i * CHAR_STAGGER
      const resolveAt = SCRAMBLE_DURATION + startDelay
      let elapsed = 0

      const interval = setInterval(() => {
        elapsed += 50
        if (elapsed >= resolveAt) {
          setTitleChars(prev => {
            const next = [...prev]
            next[i] = targetChar
            return next
          })
          clearInterval(interval)
          if (i === chars.length - 1) {
            setTimeout(() => startIdentityLine(), 100)
          }
        } else {
          setTitleChars(prev => {
            const next = [...prev]
            next[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            return next
          })
        }
      }, 50)

      intervalsRef.current.push(interval)
    })

    return () => {
      intervalsRef.current.forEach(clearInterval)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  function startIdentityLine() {
    let idx = 0
    const cursorId = setInterval(() => setIdentityCursorVisible(v => !v), 500)
    intervalsRef.current.push(cursorId)

    function typeNext() {
      if (idx < IDENTITY_LINE.length) {
        const currentIdx = idx
        setIdentityText(prev => prev + IDENTITY_LINE[currentIdx])
        idx++
        const id = setTimeout(typeNext, 40)
        timeoutsRef.current.push(id)
      } else {
        setIdentityDone(true)
        clearInterval(cursorId)
      }
    }

    const id = setTimeout(typeNext, 200)
    timeoutsRef.current.push(id)
  }

  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-inner">
        <h1 className="hero-title" aria-label={TITLE}>
          {titleChars.map((char, i) => (
            <span key={i} className="title-char">{char}</span>
          ))}
        </h1>
        <p className="identity-line" aria-label={IDENTITY_LINE} aria-live="off">
          {identityText}
          <span style={{ opacity: identityCursorVisible && !identityDone ? 1 : 0, transition: 'opacity 0.05s', color: '#F2E900' }}>|</span>
        </p>
        <div className="subtitle-wrap">
          <CyclingSubtitle />
        </div>
      </div>
      <style>{`
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; padding: 2rem 1rem; animation: crt-flicker 8s infinite; }
        @keyframes crt-flicker { 0% { filter: brightness(1) contrast(1); } 2% { filter: brightness(1.03) contrast(1.02); } 4% { filter: brightness(0.97) contrast(0.99); } 6% { filter: brightness(1.01) contrast(1.01); } 8% { filter: brightness(1) contrast(1); } 50% { filter: brightness(1) contrast(1); } 51% { filter: brightness(1.02) contrast(1.01); } 53% { filter: brightness(0.98) contrast(1); } 55% { filter: brightness(1) contrast(1); } 100% { filter: brightness(1) contrast(1); } }
        .hero-inner { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
        .hero-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #02D7F2; text-shadow: 0 0 8px #02D7F2, 0 0 20px rgba(2,215,242,0.5), 0 0 40px rgba(2,215,242,0.2); margin: 0; line-height: 1; font-size: clamp(3.75rem, 14vw, 9rem); }
        .title-char { display: inline-block; }
        .identity-line { font-family: 'Share Tech Mono', monospace; color: #F2E900; font-size: clamp(0.8rem, 2.5vw, 1.1rem); letter-spacing: 0.05em; margin: 0; min-height: 1.5em; text-shadow: 0 0 6px rgba(242,233,0,0.6); }
        .subtitle-wrap { margin-top: 0.5rem; }
      `}</style>
    </section>
  )
}

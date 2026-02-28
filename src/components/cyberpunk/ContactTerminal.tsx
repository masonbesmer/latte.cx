import { useState, useEffect, useRef } from 'react'
import { LoadingBar } from './LoadingBar'
import { NeonButton } from './NeonButton'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactTerminal() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [dots, setDots] = useState('')
  const [visibleFields, setVisibleFields] = useState(1)
  const [glitchFlash, setGlitchFlash] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dotsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = '// ERR: IDENTIFIER TOO SHORT (MIN 2 CHARS)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = '// ERR: INVALID FREQUENCY FORMAT'
    if (subject.trim().length < 3) e.subject = '// ERR: SUBJECT TOO SHORT (MIN 3 CHARS)'
    if (message.trim().length < 10) e.message = '// ERR: MESSAGE TOO SHORT (MIN 10 CHARS)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function startDots() {
    setDots('')
    dotsIntervalRef.current = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
  }

  function stopDots() {
    if (dotsIntervalRef.current) { clearInterval(dotsIntervalRef.current); dotsIntervalRef.current = null }
    setDots('')
  }

  function startLoading() {
    setLoadingPercent(0)
    const duration = 2500
    const start = performance.now()
    loadingIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setLoadingPercent(Math.round(progress * 100))
      if (progress >= 1 && loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
    }, 50)
  }

  function stopLoading() {
    if (loadingIntervalRef.current) { clearInterval(loadingIntervalRef.current); loadingIntervalRef.current = null }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setFormState('submitting')
    startDots()
    startLoading()
    await new Promise<void>(resolve => setTimeout(resolve, 2600))
    stopDots()
    stopLoading()
    setLoadingPercent(100)
    await new Promise<void>(resolve => setTimeout(resolve, 300))
    setGlitchFlash(true)
    await new Promise<void>(resolve => setTimeout(resolve, 220))
    setGlitchFlash(false)
    setFormState('success')
  }

  function resetForm() {
    setName(''); setEmail(''); setSubject(''); setMessage('')
    setErrors({}); setFormState('idle'); setVisibleFields(1); setLoadingPercent(0)
    stopDots(); stopLoading()
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  function handleFieldBlur(field: string) {
    if (field === 'name' && name.trim().length >= 1 && visibleFields < 2) {
      setVisibleFields(2); setTimeout(() => emailRef.current?.focus(), 50)
    } else if (field === 'email' && email.trim().length >= 1 && visibleFields < 3) {
      setVisibleFields(3); setTimeout(() => subjectRef.current?.focus(), 50)
    } else if (field === 'subject' && subject.trim().length >= 1 && visibleFields < 4) {
      setVisibleFields(4); setTimeout(() => messageRef.current?.focus(), 50)
    }
  }

  function handleFieldKeydown(e: React.KeyboardEvent, field: string) {
    if (e.key === 'Enter' && field !== 'message') {
      e.preventDefault(); handleFieldBlur(field)
    }
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace", fontSize: '1rem', color: '#02D7F2',
    background: 'transparent', border: 'none', borderBottom: '1px solid #02D7F2',
    outline: 'none', padding: '0.4rem 0', letterSpacing: '0.05em', caretColor: '#25E1ED',
    width: '100%',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem', color: 'rgba(2,215,242,0.6)', letterSpacing: '0.08em',
  }

  if (formState === 'success') {
    return (
      <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 0' }}>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.05rem', color: '#25E1ED', margin: 0, letterSpacing: '0.06em', textShadow: '0 0 10px rgba(37,225,237,0.6)', animation: 'ct-success-in 400ms ease forwards' }}>// TRANSMISSION RECEIVED</p>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.05rem', color: '#25E1ED', margin: 0, animation: 'ct-success-in 400ms ease 300ms forwards', opacity: 0 }}>// NEURAL ACK CONFIRMED</p>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.05rem', color: '#25E1ED', margin: 0, animation: 'ct-success-in 400ms ease 600ms forwards', opacity: 0 }}>// SONGBIRD WILL RESPOND VIA ENCRYPTED CHANNEL</p>
        <div style={{ marginTop: '1.5rem' }}>
          <NeonButton label="[NEW TRANSMISSION]" variant="primary" onClick={resetForm} />
        </div>
        <style>{`@keyframes ct-success-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }`}</style>
      </div>
    )
  }

  if (formState === 'error') {
    return (
      <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem 0' }}>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.05rem', color: '#FF1111', margin: 0 }}>// UPLINK FAILED — SIGNAL LOST</p>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem', color: 'rgba(255,17,17,0.7)', margin: 0 }}>// CHECK FREQUENCY AND RETRY</p>
        <div style={{ marginTop: '1rem' }}>
          <NeonButton label="RETRY" variant="danger" onClick={resetForm} />
        </div>
      </div>
    )
  }

  return (
    <>
      {glitchFlash && (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', animation: 'ct-flash-anim 220ms steps(1) forwards' }} />
      )}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={labelStyle} htmlFor="ct-name">
            <span style={{ color: '#25E1ED', marginRight: '0.25rem' }}>&gt;</span> IDENTIFY:
          </label>
          <input id="ct-name" ref={nameRef} value={name} onChange={e => setName(e.target.value)}
            style={{ ...inputStyle, borderColor: errors.name ? '#FF1111' : '#02D7F2' }}
            type="text" autoComplete="name" placeholder="YOUR NAME"
            readOnly={formState === 'submitting'}
            onBlur={() => handleFieldBlur('name')}
            onKeyDown={e => handleFieldKeydown(e, 'name')} />
          {errors.name && <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: '#FF1111', margin: 0 }}>{errors.name}</p>}
        </div>

        {visibleFields >= 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', animation: 'ct-slide-in 300ms ease forwards' }}>
            <label style={labelStyle} htmlFor="ct-email">
              <span style={{ color: '#25E1ED', marginRight: '0.25rem' }}>&gt;</span> FREQ:
            </label>
            <input id="ct-email" ref={emailRef} value={email} onChange={e => setEmail(e.target.value)}
              style={{ ...inputStyle, borderColor: errors.email ? '#FF1111' : '#02D7F2' }}
              type="email" autoComplete="email" placeholder="YOUR@EMAIL.NET"
              readOnly={formState === 'submitting'}
              onBlur={() => handleFieldBlur('email')}
              onKeyDown={e => handleFieldKeydown(e, 'email')} />
            {errors.email && <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: '#FF1111', margin: 0 }}>{errors.email}</p>}
          </div>
        )}

        {visibleFields >= 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', animation: 'ct-slide-in 300ms ease forwards' }}>
            <label style={labelStyle} htmlFor="ct-subject">
              <span style={{ color: '#25E1ED', marginRight: '0.25rem' }}>&gt;</span> SUBJECT:
            </label>
            <input id="ct-subject" ref={subjectRef} value={subject} onChange={e => setSubject(e.target.value)}
              style={{ ...inputStyle, borderColor: errors.subject ? '#FF1111' : '#02D7F2' }}
              type="text" placeholder="MISSION DESCRIPTION"
              readOnly={formState === 'submitting'}
              onBlur={() => handleFieldBlur('subject')}
              onKeyDown={e => handleFieldKeydown(e, 'subject')} />
            {errors.subject && <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: '#FF1111', margin: 0 }}>{errors.subject}</p>}
          </div>
        )}

        {visibleFields >= 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', animation: 'ct-slide-in 300ms ease forwards' }}>
            <label style={labelStyle} htmlFor="ct-message">
              <span style={{ color: '#25E1ED', marginRight: '0.25rem' }}>&gt;</span> MESSAGE:
            </label>
            <textarea id="ct-message" ref={messageRef} value={message} onChange={e => setMessage(e.target.value)}
              style={{ ...inputStyle, border: `1px solid ${errors.message ? '#FF1111' : 'rgba(2,215,242,0.4)'}`, padding: '0.5rem 0.75rem', resize: 'vertical' }}
              rows={5} placeholder="ENCODE YOUR MESSAGE..."
              readOnly={formState === 'submitting'} />
            {errors.message && <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: '#FF1111', margin: 0 }}>{errors.message}</p>}
          </div>
        )}

        {visibleFields >= 4 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', paddingTop: '0.5rem' }}>
            {formState === 'submitting' ? (
              <>
                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', color: '#25E1ED', margin: 0 }}>// UPLINK CONNECTING{dots}</p>
                <LoadingBar percent={loadingPercent} label="TRANSMITTING PAYLOAD" duration={2500} />
              </>
            ) : (
              <NeonButton label="[BROADCAST]" variant="primary" />
            )}
          </div>
        ) : (
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'rgba(2,215,242,0.35)', letterSpacing: '0.06em' }}>
            // PRESS ENTER OR CLICK FIELD TO ADVANCE
          </div>
        )}
      </form>
      <style>{`
        @keyframes ct-flash-anim { 0% { background: rgba(255,255,255,0.12); } 20% { background: rgba(2,215,242,0.15); } 40% { background: rgba(255,255,255,0.08); } 60% { background: rgba(237,30,121,0.1); } 80% { background: rgba(255,255,255,0.05); } 100% { background: transparent; } }
        @keyframes ct-slide-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  )
}

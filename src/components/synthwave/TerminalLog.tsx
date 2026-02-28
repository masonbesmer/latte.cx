import { useRef, useEffect } from 'react'
import type { LogEntry } from '../../lib/synthwave-data'

interface TerminalLogProps {
  entries: LogEntry[]
}

const LEVEL_CLASS: Record<LogEntry['level'], string> = {
  ok:    'sw-log-level-ok',
  info:  'sw-log-level-info',
  warn:  'sw-log-level-warn',
  error: 'sw-log-level-error',
}

const LEVEL_LABEL: Record<LogEntry['level'], string> = {
  ok:    '[  OK  ]',
  info:  '[ INFO ]',
  warn:  '[ WARN ]',
  error: '[ ERR! ]',
}

export function TerminalLog({ entries }: TerminalLogProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when entries change
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [entries])

  return (
    <div className="sw-panel sw-terminal">
      <div className="sw-panel-header">
        <span className="sw-panel-title">SYSTEM LOG</span>
        <span className="sw-panel-title" style={{ color: '#39FF14', textShadow: '0 0 6px #39FF14' }}>
          ● LIVE
        </span>
      </div>
      <div className="sw-terminal-body" ref={bodyRef} role="log" aria-live="polite" aria-label="System log">
        {entries.map((entry) => (
          <div key={entry.id} className="sw-log-entry">
            <span className="sw-log-time">{entry.timestamp}</span>
            <span className={LEVEL_CLASS[entry.level]}>{LEVEL_LABEL[entry.level]}</span>
            <span className="sw-log-service">{entry.service}</span>
            <span className="sw-log-msg">{entry.message}</span>
          </div>
        ))}
      </div>
      <div className="sw-terminal-cursor" aria-hidden="true">▌</div>
    </div>
  )
}

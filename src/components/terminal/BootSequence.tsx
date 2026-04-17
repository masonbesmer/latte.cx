import { useEffect, useState } from 'react'

interface BootStep {
  text: string
  delay: number
  isMemBar?: boolean
}

const BOOT_SCRIPT: BootStep[] = [
  { text: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',   delay: 100 },
  { text: 'COPYRIGHT 2075-2077 ROBCO INDUSTRIES',      delay: 120 },
  { text: '-----------------------------------------', delay: 80  },
  { text: '> BIOS VERSION 2.3.0... OK',                delay: 200 },
  { text: '> CHECKING MEMORY...',                      delay: 100, isMemBar: true },
  { text: '> LOADING VAULT-TEC KERNEL... OK',          delay: 250 },
  { text: '> MOUNTING FILESYSTEM... OK',               delay: 200 },
  { text: '> AUTHENTICATING USER...',                  delay: 300 },
  { text: '  WELCOME, VAULT_DWELLER_7',                delay: 200 },
  { text: '-----------------------------------------', delay: 100 },
  { text: "TYPE 'help' FOR AVAILABLE COMMANDS.",       delay: 300 },
]

const MEM_TICKS = 12
const MEM_TICK_MS = 80

interface Props {
  onComplete: () => void
}

export function BootSequence({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [memFill, setMemFill] = useState(0)

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const wait = (ms: number) =>
      new Promise<void>(res => {
        const t = setTimeout(res, ms)
        timers.push(t)
      })

    ;(async () => {
      for (const step of BOOT_SCRIPT) {
        if (cancelled) break
        await wait(step.delay)
        if (cancelled) break

        setLines(prev => [...prev, step.text])

        if (step.isMemBar) {
          for (let i = 1; i <= MEM_TICKS; i++) {
            await wait(MEM_TICK_MS)
            if (cancelled) break
            setMemFill(i)
          }
          if (!cancelled) {
            setLines(prev => {
              const copy = [...prev]
              const idx = copy.lastIndexOf('> CHECKING MEMORY...')
              if (idx !== -1) {
                copy[idx] = '> CHECKING MEMORY... [████████████] 640K OK'
              }
              return copy
            })
          }
        }
      }

      if (!cancelled) {
        await wait(400)
        if (!cancelled) onComplete()
      }
    })()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  return (
    <div className="term-boot">
      {lines.map((line, i) => {
        const isActiveMemBar = line === '> CHECKING MEMORY...' && memFill < MEM_TICKS
        const display = isActiveMemBar
          ? `> CHECKING MEMORY... [${'█'.repeat(memFill)}${'░'.repeat(MEM_TICKS - memFill)}]`
          : line
        return (
          <div key={i} className="term-line term-line--output">
            {display}
          </div>
        )
      })}
      <span className="term-cursor">█</span>
    </div>
  )
}

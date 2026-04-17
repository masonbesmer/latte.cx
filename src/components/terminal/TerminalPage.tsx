import { useState } from 'react'
import { BootSequence } from './BootSequence'
import { TerminalScreen } from './TerminalScreen'
import { useTerminal } from '../../lib/terminal/useTerminal'
import '../../styles/terminal.css'

export function TerminalPage() {
  const [booted, setBooted] = useState(false)
  const {
    outputLines, inputBuffer, mode,
    setInputBuffer, submit, handleKeyDown, handleTab,
  } = useTerminal()

  return (
    <div className="term-root">
      <div className="term-screen-wrap">
        <div className="term-scanlines" aria-hidden="true" />
        <div className="term-vignette" aria-hidden="true" />
        {booted ? (
          <TerminalScreen
            outputLines={outputLines}
            inputBuffer={inputBuffer}
            mode={mode}
            onInputChange={setInputBuffer}
            onSubmit={submit}
            onKeyDown={handleKeyDown}
            onTab={handleTab}
          />
        ) : (
          <BootSequence onComplete={() => setBooted(true)} />
        )}
      </div>
    </div>
  )
}

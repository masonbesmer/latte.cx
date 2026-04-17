import { createFileRoute } from '@tanstack/react-router'
import { TerminalPage } from '../components/terminal/TerminalPage'

export const Route = createFileRoute('/')({
  component: TerminalPage,
})

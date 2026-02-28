import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ShelfHeader } from '../components/vinyl/ShelfHeader'
import { RecordCrate } from '../components/vinyl/RecordCrate'
import { Turntable } from '../components/vinyl/Turntable'
import type { Service } from '../lib/vinyl-data'
import '../styles/vinyl.css'

export const Route = createFileRoute('/')({
  component: VinylDashboard,
})

function VinylDashboard() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <main className="min-h-screen flex flex-col gap-4 p-4" style={{ background: 'var(--walnut)' }}>
      <ShelfHeader />
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h2 className="px-4 font-bold tracking-widest uppercase" style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: '0.25em' }}>
            ── The Crate ──
          </h2>
          <RecordCrate onServiceSelect={setSelectedService} selectedId={selectedService?.id ?? null} />
        </div>
        <div className="lg:w-80 flex flex-col gap-2 flex-shrink-0">
          <h2 className="px-1 font-bold tracking-widest uppercase" style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: '0.25em' }}>
            ── Turntable ──
          </h2>
          <Turntable service={selectedService} />
        </div>
      </div>
      <footer className="text-center py-2" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.2em' }}>
        VINYL CRATE DASHBOARD · HOMELAB EDITION ·{' '}
        {selectedService ? `${selectedService.name.toUpperCase()} SELECTED` : 'ALL SYSTEMS MONITORED'}
      </footer>
    </main>
  )
}

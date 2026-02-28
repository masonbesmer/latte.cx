import { CrateDivider as CrateDividerType } from '../../lib/vinyl-data'

interface CrateDividerProps {
  divider: CrateDividerType
}

export function CrateDividerCard({ divider }: CrateDividerProps) {
  return (
    <div
      className="flex-shrink-0 flex items-end justify-center pb-4 rounded"
      style={{
        width: 60,
        height: 380,
        background: `linear-gradient(180deg, ${divider.color}cc 0%, ${divider.color} 100%)`,
        border: `2px solid ${divider.color}`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      }}
      aria-label={`Category: ${divider.label}`}
    >
      <span
        style={{
          color: 'var(--cream)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          transform: 'rotate(180deg)',
        }}
      >
        {divider.label}
      </span>
    </div>
  )
}

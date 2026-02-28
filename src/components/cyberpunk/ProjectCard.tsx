import { useState } from 'react'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../lib/projects'
import type { Project } from '../../lib/projects'

interface ProjectCardProps {
  project: Project
  onCardClick?: () => void
}

export function ProjectCard({ project, onCardClick }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (onCardClick) onCardClick()
  }

  return (
    <a
      href={`/cyberpunk/projects/${project.slug}`}
      className={`project-card${hovered ? ' hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      aria-label={`View project: ${project.title}`}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', textDecoration: 'none',
        color: '#02d7f2', background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(12px)',
        border: hovered ? '1px solid rgba(2,215,242,0.7)' : '1px solid rgba(2,215,242,0.3)',
        borderRadius: 4, overflow: 'hidden',
        boxShadow: hovered
          ? '0 0 20px rgba(2,215,242,0.4), 0 0 40px rgba(2,215,242,0.15), inset 0 0 12px rgba(2,215,242,0.1)'
          : '0 0 8px rgba(2,215,242,0.15), inset 0 0 8px rgba(2,215,242,0.05)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {hovered && (
        <>
          <span className="orbit orbit-1" aria-hidden="true" />
          <span className="orbit orbit-2" aria-hidden="true" />
          <span className="orbit orbit-3" aria-hidden="true" />
        </>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, rgba(10,10,15,0.9) 0%, color-mix(in srgb, ${CATEGORY_COLORS[project.category]} 15%, #0a0a0f) 100%)`
        }} />
        <span style={{ position: 'relative', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(2,215,242,0.3)', textTransform: 'uppercase' }}>
          {project.title}
        </span>
      </div>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', color: '#02d7f2', margin: 0, textShadow: '0 0 8px rgba(2,215,242,0.5)' }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', lineHeight: 1.5, color: 'rgba(2,215,242,0.7)', margin: 0 }}>
          {project.summary}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.05em',
              color: CATEGORY_COLORS[tag], border: `1px solid ${CATEGORY_COLORS[tag]}`,
              borderRadius: 2, padding: '0.1em 0.4em', opacity: hovered ? 1 : 0.85, transition: 'opacity 0.2s'
            }}>
              [{CATEGORY_LABELS[tag]}]
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .orbit { position: absolute; width: 6px; height: 6px; border-radius: 50%; animation: orbit-path 2s linear infinite; pointer-events: none; z-index: 10; }
        .orbit-1 { background: #02d7f2; box-shadow: 0 0 6px #02d7f2; animation-delay: 0s; }
        .orbit-2 { background: #f2e900; box-shadow: 0 0 6px #f2e900; animation-delay: -0.66s; }
        .orbit-3 { background: #ed1e79; box-shadow: 0 0 6px #ed1e79; animation-delay: -1.33s; }
        @keyframes orbit-path {
          0%   { top: -3px; left: calc(50% - 3px); }
          25%  { top: calc(50% - 3px); left: calc(100% - 3px); }
          50%  { top: calc(100% - 3px); left: calc(50% - 3px); }
          75%  { top: calc(50% - 3px); left: -3px; }
          100% { top: -3px; left: calc(50% - 3px); }
        }
      `}</style>
    </a>
  )
}

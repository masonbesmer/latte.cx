import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { HeroSection } from '../../components/cyberpunk/HeroSection'
import { GlitchText } from '../../components/cyberpunk/GlitchText'
import { ProjectCard } from '../../components/cyberpunk/ProjectCard'
import { projects } from '../../lib/projects'

export const Route = createFileRoute('/cyberpunk/')({
  component: CyberpunkHome,
})

function CyberpunkHome() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const [glitchFlash, setGlitchFlash] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (_entries) => {
        // section visibility tracking (no-op for now without a store)
      },
      { threshold: 0.3 },
    )
    if (heroRef.current) observer.observe(heroRef.current)
    if (projectsRef.current) observer.observe(projectsRef.current)
    return () => observer.disconnect()
  }, [])

  function handleCardClick(slug: string) {
    setGlitchFlash(true)
    setTimeout(() => {
      setGlitchFlash(false)
      navigate({ to: '/cyberpunk/projects/$slug', params: { slug } })
    }, 220)
  }

  return (
    <>
      {glitchFlash && <div className="glitch-flash" aria-hidden="true" />}
      <section ref={heroRef} id="hero">
        <HeroSection />
      </section>
      <section ref={projectsRef} id="projects" className="projects-section">
        <div className="projects-inner">
          <div className="section-heading">
            <GlitchText tag="h2" text="// ACTIVE PROJECTS" trigger="scroll" />
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onCardClick={() => handleCardClick(project.slug)}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="contact-cta">
        <div className="contact-cta-inner">
          <p className="cta-label">// ESTABLISH UPLINK</p>
          <a href="/cyberpunk/contact" className="cta-btn">[SEND TRANSMISSION]</a>
        </div>
      </section>
      <style>{`
        .glitch-flash {
          position: fixed; inset: 0; z-index: 9998; pointer-events: none;
          animation: glitch-flash-anim 220ms steps(1) forwards;
        }
        @keyframes glitch-flash-anim {
          0%   { background: rgba(255,255,255,0.08); }
          20%  { background: rgba(2,215,242,0.12); }
          40%  { background: rgba(255,255,255,0.06); }
          60%  { background: rgba(237,30,121,0.08); }
          80%  { background: rgba(255,255,255,0.04); }
          100% { background: transparent; }
        }
        .projects-section { border-top: 1px solid rgba(2, 215, 242, 0.15); padding: 4rem 0 6rem; }
        .projects-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .section-heading { margin-bottom: 2.5rem; }
        .projects-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 768px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }
        .contact-cta { border-top: 1px solid rgba(2, 215, 242, 0.15); padding: 4rem 0 5rem; text-align: center; }
        .contact-cta-inner { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
        .cta-label { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(2, 215, 242, 0.45); letter-spacing: 0.1em; margin: 0; }
        .cta-btn { font-family: 'Share Tech Mono', monospace; font-size: 1rem; letter-spacing: 0.1em; color: #F2E900; text-decoration: none; border: 1px solid #F2E900; padding: 0.6rem 1.75rem; box-shadow: 0 0 8px rgba(242,233,0,0.3), inset 0 0 8px rgba(242,233,0,0.05); transition: box-shadow 0.25s ease, color 0.25s ease; display: inline-block; }
        .cta-btn:hover { box-shadow: 0 0 16px rgba(242,233,0,0.6), 0 0 32px rgba(242,233,0,0.3), inset 0 0 12px rgba(242,233,0,0.1); }
      `}</style>
    </>
  )
}

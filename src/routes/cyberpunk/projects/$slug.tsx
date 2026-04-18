import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { GlitchText } from "../../../components/cyberpunk/GlitchText";
import "../../../styles/glitch.css";

const markdownModules = import.meta.glob("/content/*.md", {
  query: "?raw",
  import: "default",
});

interface ProjectMeta {
  title: string;
  slug: string;
  tags: string[];
  category: string;
  date: string;
  summary: string;
}

function parseFrontmatter(raw: string): { meta: ProjectMeta; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {} as ProjectMeta, content: raw };
  const frontmatter = match[1];
  const content = match[2];
  const meta: Record<string, string | string[]> = {};
  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (value.startsWith("[")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/['"]/g, ""));
    } else {
      meta[key] = value.replace(/['"]/g, "");
    }
  }
  return { meta: meta as unknown as ProjectMeta, content };
}

export const Route = createFileRoute("/cyberpunk/projects/$slug")({
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<ProjectMeta | null>(null);
  const [content, setContent] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [cursorDone, setCursorDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = `/content/${slug}.md`;
    const loader = markdownModules[path];
    if (!loader) {
      setNotFound(true);
      return;
    }
    loader().then((raw) => {
      const { meta: m, content: c } = parseFrontmatter(raw as string);
      setMeta(m);
      setContent(c);
    });
  }, [slug]);

  useEffect(() => {
    if (!content || !contentRef.current) return;
    requestAnimationFrame(() => {
      if (!contentRef.current) return;
      const children = Array.from(contentRef.current.children) as HTMLElement[];
      children.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        el.style.transition = "none";
        setTimeout(
          () => {
            el.style.transition = "opacity 200ms ease, transform 200ms ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            if (i === children.length - 1) {
              setTimeout(() => setCursorDone(true), 1000);
            }
          },
          80 + i * 15,
        );
      });
      if (children.length === 0) setCursorDone(true);
    });
  }, [content]);

  if (notFound) {
    return (
      <div
        style={{
          padding: "4rem",
          color: "#02D7F2",
          fontFamily: "Share Tech Mono, monospace",
        }}
      >
        // PROJECT NOT FOUND: {slug.toUpperCase()}
      </div>
    );
  }

  if (!meta) {
    return (
      <div
        style={{
          padding: "4rem",
          color: "#02D7F2",
          fontFamily: "Share Tech Mono, monospace",
        }}
      >
        // LOADING...
      </div>
    );
  }

  return (
    <div className="writeup-page">
      <div className="back-link-row">
        <button
          className="back-link-btn"
          onClick={() => navigate({ to: "/cyberpunk" })}
        >
          ← BACK TO NET
        </button>
      </div>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/cyberpunk" className="crumb">
          NIGHT CITY NET
        </a>
        <span className="crumb-sep">&gt;</span>
        <a href="/cyberpunk" className="crumb">
          SONGBIRD
        </a>
        <span className="crumb-sep">&gt;</span>
        <a href="/cyberpunk" className="crumb">
          PROJECTS
        </a>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb crumb--current">{meta.title}</span>
      </nav>
      <header className="project-header">
        <GlitchText tag="h1" text={meta.title} trigger="always" />
        <div className="project-meta-row">
          <span className="meta-date">// DATE: {meta.date}</span>
          <div className="meta-tags">
            {(meta.tags || []).map((tag: string) => (
              <span key={tag} className="tag-badge">
                [{tag.toUpperCase()}]
              </span>
            ))}
          </div>
        </div>
        <p className="project-summary">{meta.summary}</p>
      </header>
      <div className="terminal-wrapper">
        <div className="terminal-topbar">
          <span className="terminal-label">// OUTPUT</span>
          <span className="terminal-dots">
            <span />
            <span />
            <span />
          </span>
        </div>
        <div className="terminal-body">
          <div className="md-content" ref={contentRef}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {!cursorDone && (
            <span className="stream-cursor" aria-hidden="true">
              |
            </span>
          )}
        </div>
      </div>
      <div className="bottom-nav">
        <button
          className="back-link-btn"
          onClick={() => navigate({ to: "/cyberpunk" })}
        >
          ← BACK TO NET
        </button>
      </div>
      <style>{`
        .writeup-page { max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem 6rem; }
        .back-link-row, .bottom-nav { margin-bottom: 1.5rem; }
        .bottom-nav { margin-top: 3rem; margin-bottom: 0; }
        .back-link-btn { background: none; border: 1px solid rgba(2,215,242,0.35); color: #02D7F2; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; padding: 0.35rem 0.85rem; cursor: pointer; letter-spacing: 0.08em; transition: border-color 0.2s, box-shadow 0.2s, color 0.2s; }
        .back-link-btn:hover { border-color: #02D7F2; box-shadow: 0 0 8px rgba(2,215,242,0.4); color: #25E1ED; }
        .breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; margin-bottom: 2rem; opacity: 0.8; }
        .crumb { color: #02D7F2; text-decoration: none; transition: color 0.2s; }
        .crumb:hover { color: #25E1ED; }
        .crumb--current { color: #F2E900; font-weight: 600; }
        .crumb-sep { color: rgba(2,215,242,0.4); user-select: none; }
        .project-header { margin-bottom: 2rem; }
        .project-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 0.75rem; margin-bottom: 1rem; }
        .meta-date { font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; color: rgba(2,215,242,0.6); }
        .meta-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tag-badge { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; padding: 0.15rem 0.4rem; border: 1px solid rgba(2,215,242,0.4); color: #02D7F2; letter-spacing: 0.05em; }
        .project-summary { font-family: 'Share Tech Mono', monospace; font-size: 0.88rem; color: rgba(2,215,242,0.75); line-height: 1.6; border-left: 2px solid rgba(2,215,242,0.3); padding-left: 1rem; margin: 0; }
        .terminal-wrapper { border: 1px solid rgba(2,215,242,0.2); border-radius: 2px; overflow: hidden; }
        .terminal-topbar { display: flex; align-items: center; justify-content: space-between; background: rgba(2,215,242,0.06); border-bottom: 1px solid rgba(2,215,242,0.15); padding: 0.4rem 1rem; }
        .terminal-label { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: rgba(2,215,242,0.55); letter-spacing: 0.1em; }
        .terminal-dots { display: flex; gap: 0.3rem; }
        .terminal-dots span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: rgba(2,215,242,0.25); }
        .terminal-body { padding: 2rem; position: relative; }
        .stream-cursor { display: inline-block; color: #02D7F2; font-family: 'Share Tech Mono', monospace; font-size: 1rem; animation: blink-cursor 500ms steps(1) infinite; margin-left: 2px; }
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .md-content { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; line-height: 1.8; color: #02D7F2; }
        .md-content h1 { font-family: 'Rajdhani', sans-serif; font-size: 2rem; color: #F2E900; text-shadow: 0 0 12px rgba(242,233,0,0.4); margin: 2rem 0 1rem; letter-spacing: 0.05em; }
        .md-content h2 { font-family: 'Rajdhani', sans-serif; font-size: 1.4rem; color: #25E1ED; text-shadow: 0 0 8px rgba(37,225,237,0.35); margin: 1.75rem 0 0.75rem; letter-spacing: 0.04em; border-bottom: 1px solid rgba(37,225,237,0.2); padding-bottom: 0.4rem; }
        .md-content h3 { font-family: 'Rajdhani', sans-serif; font-size: 1.15rem; color: #02D7F2; margin: 1.5rem 0 0.5rem; letter-spacing: 0.03em; }
        .md-content p { margin: 0 0 1.1rem; color: rgba(2,215,242,0.85); }
        .md-content a { color: #25E1ED; text-decoration: none; border-bottom: 1px solid rgba(37,225,237,0.4); }
        .md-content a:hover { color: #F2E900; border-color: rgba(242,233,0,0.5); }
        .md-content ul, .md-content ol { margin: 0 0 1.1rem 1.5rem; color: rgba(2,215,242,0.85); }
        .md-content li { margin-bottom: 0.35rem; }
        .md-content blockquote { border-left: 3px solid rgba(242,233,0,0.5); background: rgba(242,233,0,0.04); margin: 1.25rem 0; padding: 0.75rem 1.25rem; color: rgba(242,233,0,0.8); }
        .md-content hr { border: none; border-top: 1px solid rgba(2,215,242,0.15); margin: 2rem 0; }
        .md-content pre { background: rgba(10,10,15,0.9); border: 1px solid rgba(2,215,242,0.25); border-radius: 2px; margin: 1.25rem 0; overflow-x: auto; padding: 1rem; }
        .md-content code { font-family: 'Share Tech Mono', monospace; font-size: 0.85em; color: #F2E900; background: rgba(242,233,0,0.08); padding: 0.1em 0.35em; border-radius: 2px; }
        .md-content pre code { color: #25E1ED; background: none; padding: 0; }
      `}</style>
    </div>
  );
}

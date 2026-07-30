import { useEffect, useRef, useState } from "react";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  proficiency: number; // 0-1
  category: string;
}

interface SkillEdge {
  from: string;
  to: string;
}

const NODES: SkillNode[] = [
  // Core — center cluster
  {
    id: "linux",
    label: "LINUX",
    x: 400,
    y: 120,
    proficiency: 1.0,
    category: "systems",
  },
  {
    id: "docker",
    label: "DOCKER",
    x: 250,
    y: 220,
    proficiency: 0.95,
    category: "infra",
  },
  {
    id: "python",
    label: "PYTHON",
    x: 550,
    y: 220,
    proficiency: 0.9,
    category: "lang",
  },

  // Left cluster — infra
  {
    id: "proxmox",
    label: "PROXMOX",
    x: 120,
    y: 320,
    proficiency: 0.9,
    category: "infra",
  },
  {
    id: "pfsense",
    label: "PFSENSE",
    x: 120,
    y: 440,
    proficiency: 0.85,
    category: "net",
  },
  {
    id: "wireguard",
    label: "WIREGUARD",
    x: 250,
    y: 520,
    proficiency: 0.8,
    category: "net",
  },

  // Right cluster — dev
  {
    id: "js",
    label: "JAVASCRIPT",
    x: 680,
    y: 320,
    proficiency: 0.85,
    category: "lang",
  },
  {
    id: "react",
    label: "REACT",
    x: 680,
    y: 440,
    proficiency: 0.8,
    category: "lang",
  },
  {
    id: "threejs",
    label: "THREE.JS",
    x: 560,
    y: 520,
    proficiency: 0.75,
    category: "lang",
  },

  // Bottom cluster — hardware
  {
    id: "esp32",
    label: "ESP32",
    x: 250,
    y: 640,
    proficiency: 0.8,
    category: "hw",
  },
  {
    id: "ha",
    label: "HOME ASSISTANT",
    x: 400,
    y: 620,
    proficiency: 0.95,
    category: "infra",
  },
  {
    id: "mqtt",
    label: "MQTT",
    x: 560,
    y: 640,
    proficiency: 0.85,
    category: "infra",
  },
];

const EDGES: SkillEdge[] = [
  { from: "linux", to: "docker" },
  { from: "linux", to: "python" },
  { from: "linux", to: "proxmox" },
  { from: "docker", to: "proxmox" },
  { from: "docker", to: "ha" },
  { from: "proxmox", to: "pfsense" },
  { from: "pfsense", to: "wireguard" },
  { from: "wireguard", to: "esp32" },
  { from: "python", to: "js" },
  { from: "js", to: "react" },
  { from: "react", to: "threejs" },
  { from: "threejs", to: "mqtt" },
  { from: "ha", to: "esp32" },
  { from: "ha", to: "mqtt" },
  { from: "esp32", to: "mqtt" },
  { from: "python", to: "ha" },
];

const CATEGORY_COLOR: Record<string, string> = {
  systems: "#FFFFFF",
  infra: "#00AAFF",
  net: "#FFCC00",
  lang: "#00AAFF",
  hw: "#FF2200",
};

const VB_W = 800;
const VB_H = 760;

const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));

function nodeColor(node: SkillNode) {
  return CATEGORY_COLOR[node.category] ?? "#00AAFF";
}

function nodeGlow(node: SkillNode, intensity = 1) {
  const c = nodeColor(node);
  return `drop-shadow(0 0 ${6 * node.proficiency * intensity}px ${c}) drop-shadow(0 0 ${12 * node.proficiency * intensity}px ${c}55)`;
}

export function TronSkills() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimated(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observerRef.current.observe(svgRef.current);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section id="skills" className="tron-skills" aria-label="Skills section">
      <div className="tron-skills-inner">
        <div className="tron-section-header">
          <span className="tron-section-tag">// CIRCUIT NODE MAP</span>
          <h2 className="tron-section-title">SKILLS.MATRIX</h2>
        </div>

        <div className="tron-circuit-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="tron-circuit-svg"
            aria-label="Skills circuit diagram"
            role="img"
          >
            <defs>
              <filter id="glow-blue">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges — circuit traces */}
            {EDGES.map((edge, i) => {
              const from = NODE_MAP.get(edge.from);
              const to = NODE_MAP.get(edge.to);
              if (!from || !to) return null;
              const active = activeNode === edge.from || activeNode === edge.to;
              const len = Math.hypot(to.x - from.x, to.y - from.y);
              const animDelay = i * 0.12;

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={active ? "#00AAFF" : "rgba(0,170,255,0.3)"}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={len}
                  strokeDashoffset={animated ? 0 : len}
                  style={{
                    transition: `stroke-dashoffset 0.8s ease ${animDelay}s, stroke 0.3s, stroke-width 0.3s`,
                    filter: active ? "drop-shadow(0 0 4px #00AAFF)" : undefined,
                  }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const color = nodeColor(node);
              const r = 8 + node.proficiency * 10;
              const active = activeNode === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  role="img"
                  aria-label={`${node.label}: ${Math.round(node.proficiency * 100)}% proficiency`}
                >
                  {/* Outer ring */}
                  <circle
                    r={r + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth={active ? 1.5 : 0.5}
                    opacity={active ? 0.7 : 0.25}
                    style={{ transition: "all 0.3s" }}
                  />
                  {/* Core */}
                  <circle
                    r={r}
                    fill={`${color}22`}
                    stroke={color}
                    strokeWidth={active ? 2 : 1}
                    style={{
                      filter: active ? nodeGlow(node, 2) : nodeGlow(node, 0.6),
                      transition: "all 0.3s",
                    }}
                  />
                  {/* Center dot */}
                  <circle r={3} fill={color} opacity={node.proficiency} />
                  {/* Label */}
                  <text
                    y={r + 18}
                    textAnchor="middle"
                    fill={active ? color : `${color}bb`}
                    fontSize={active ? 10 : 9}
                    fontFamily="'Share Tech Mono', monospace"
                    letterSpacing="0.08em"
                    style={{
                      transition: "all 0.3s",
                      filter: active ? nodeGlow(node, 1.5) : undefined,
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="tron-skills-legend">
          <div className="tron-legend-item">
            <span
              className="tron-legend-dot"
              style={{ background: "#FFFFFF" }}
            />
            SYSTEMS
          </div>
          <div className="tron-legend-item">
            <span
              className="tron-legend-dot"
              style={{ background: "#00AAFF" }}
            />
            INFRA / DEV
          </div>
          <div className="tron-legend-item">
            <span
              className="tron-legend-dot"
              style={{ background: "#FFCC00" }}
            />
            NETWORKING
          </div>
          <div className="tron-legend-item">
            <span
              className="tron-legend-dot"
              style={{ background: "#FF2200" }}
            />
            HARDWARE
          </div>
        </div>
      </div>

      <style>{`
        .tron-skills {
          padding: 6rem 1.5rem;
          border-top: 1px solid rgba(0,170,255,0.2);
        }
        .tron-skills-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .tron-circuit-wrap {
          width: 100%;
          border: 1px solid rgba(0,170,255,0.2);
          background: rgba(5,5,16,0.6);
          padding: 1rem;
          box-shadow: inset 0 0 24px rgba(0,170,255,0.04);
        }
        .tron-circuit-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .tron-skills-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2rem;
          justify-content: center;
        }
        .tron-legend-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tron-legend-dot {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
        }
      `}</style>
    </section>
  );
}

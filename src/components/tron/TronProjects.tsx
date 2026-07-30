import { useState } from "react";

interface TronProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagColor: string;
}

const tronProjects: TronProject[] = [
  {
    id: "neural-home-hub",
    title: "NEURAL HOME HUB",
    description:
      "Full-stack home automation node with 200+ integrated sensors, voice control, and presence detection across 12 zones.",
    tags: ["HOME-ASSISTANT", "NETWORKING"],
    tagColor: "#00AAFF",
  },
  {
    id: "proxmox-hypervisor-cluster",
    title: "PROXMOX HYPERVISOR CLUSTER",
    description:
      "High-availability 3-node Proxmox cluster with Ceph storage and automated backup pipelines for 20+ VMs.",
    tags: ["PROXMOX", "LINUX"],
    tagColor: "#FFCC00",
  },
  {
    id: "darknet-infrastructure",
    title: "DARKNET INFRASTRUCTURE",
    description:
      "Zero-trust VLAN-segmented network with pfSense firewall, IDS/IPS, and WireGuard mesh VPN across 8 nodes.",
    tags: ["NETWORKING", "LINUX"],
    tagColor: "#00AAFF",
  },
  {
    id: "vehicle-can-bus-logger",
    title: "VEHICLE CAN BUS LOGGER",
    description:
      "Custom OBD-II CAN bus sniffer with real-time telemetry dashboard and anomaly detection for automotive diagnostics.",
    tags: ["AUTOMOTIVE", "HARDWARE"],
    tagColor: "#FF2200",
  },
  {
    id: "custom-pcb-sensor-array",
    title: "CUSTOM PCB SENSOR ARRAY",
    description:
      "PCB-designed environmental sensor module with ESP32, BME680, and wireless MQTT reporting to the home grid.",
    tags: ["HARDWARE", "HOME-ASSISTANT"],
    tagColor: "#00AAFF",
  },
  {
    id: "linux-kernel-hardening",
    title: "LINUX KERNEL HARDENING",
    description:
      "Custom kernel builds with grsecurity patches, seccomp profiles, and eBPF-based observability for hardened systems.",
    tags: ["LINUX", "NETWORKING"],
    tagColor: "#00AAFF",
  },
];

function TronProjectCard({ project }: { project: TronProject }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`tron-card${hovered ? " tron-card--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="article"
    >
      {hovered && <div className="tron-card-glow-trail" aria-hidden="true" />}
      <div className="tron-card-header">
        <span className="tron-card-id">// {project.id.toUpperCase()}</span>
      </div>
      <h3 className="tron-card-title">{project.title}</h3>
      <p className="tron-card-desc">{project.description}</p>
      <div className="tron-card-tags">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="tron-tag"
            style={{
              color: project.tagColor,
              borderColor: project.tagColor,
              boxShadow: hovered ? `0 0 8px ${project.tagColor}55` : "none",
            }}
          >
            [{tag}]
          </span>
        ))}
      </div>
      <style>{`
        .tron-card {
          position: relative;
          background: rgba(5,5,16,0.7);
          border: 1px solid rgba(0,170,255,0.25);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .tron-card--hovered {
          border-color: rgba(0,170,255,0.7);
          box-shadow:
            0 0 20px rgba(0,170,255,0.3),
            0 0 40px rgba(0,170,255,0.1),
            inset 0 0 12px rgba(0,170,255,0.05);
        }
        .tron-card-glow-trail {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 60%, rgba(0,170,255,0.06));
          pointer-events: none;
        }
        .tron-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tron-card-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(0,170,255,0.4);
          letter-spacing: 0.1em;
        }
        .tron-card-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #00AAFF;
          margin: 0;
          letter-spacing: 0.06em;
          text-shadow: 0 0 8px rgba(0,170,255,0.5);
          line-height: 1.3;
        }
        .tron-card-desc {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.65);
          margin: 0;
          flex: 1;
        }
        .tron-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .tron-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          border: 1px solid;
          padding: 0.1em 0.45em;
          transition: box-shadow 0.2s;
        }
      `}</style>
    </div>
  );
}

export function TronProjects() {
  return (
    <section
      id="projects"
      className="tron-projects"
      aria-label="Projects section"
    >
      <div className="tron-projects-inner">
        <div className="tron-section-header">
          <span className="tron-section-tag">// DATA BLOCKS ON THE GRID</span>
          <h2 className="tron-section-title">ACTIVE_PROGRAMS.LOG</h2>
        </div>
        <div className="tron-projects-grid">
          {tronProjects.map((p) => (
            <TronProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
      <style>{`
        .tron-projects {
          padding: 6rem 1.5rem;
          border-top: 1px solid rgba(0,170,255,0.2);
        }
        .tron-projects-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .tron-projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .tron-projects-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .tron-projects-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
}

import { useState } from "react";
import type { ServiceNode } from "../../lib/synthwave-data";
import { STATUS_COLOR, CATEGORY_COLOR } from "../../lib/synthwave-data";

interface StatCardProps {
  service: ServiceNode;
  onSelect: (s: ServiceNode) => void;
}

export function StatCard({ service, onSelect }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  const accentColor = CATEGORY_COLOR[service.category];
  const borderColor = hovered
    ? accentColor
    : `rgba(${hexToRgb(accentColor)}, 0.25)`;

  const cpuColor = cpuBarColor(service.cpu);
  const ramColor = ramBarColor(service.memory);

  return (
    <div
      className="sw-stat-card"
      style={{ borderColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(service)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(service)}
      role="button"
      tabIndex={0}
      aria-label={`Service: ${service.name}`}
    >
      <div className="sw-stat-card-header">
        <span className="sw-stat-card-icon">{service.icon}</span>
        <span
          className={`sw-status-orb ${service.status}`}
          style={{
            background: STATUS_COLOR[service.status],
            boxShadow: `0 0 6px ${STATUS_COLOR[service.status]}`,
          }}
          title={service.status}
        />
      </div>

      <div
        className="sw-stat-card-name"
        style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}` }}
      >
        {service.name}
      </div>
      <div className="sw-stat-card-desc">{service.description}</div>

      <div className="sw-bar-row">
        <div>
          <div className="sw-bar-label">
            <span>CPU</span>
            <span>{service.cpu}%</span>
          </div>
          <div className="sw-bar-track">
            <div
              className="sw-bar-fill"
              style={{
                width: `${service.cpu}%`,
                background: cpuColor,
                boxShadow: `0 0 6px ${cpuColor}`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="sw-bar-label">
            <span>RAM</span>
            <span>{service.memory}%</span>
          </div>
          <div className="sw-bar-track">
            <div
              className="sw-bar-fill"
              style={{
                width: `${service.memory}%`,
                background: ramColor,
                boxShadow: `0 0 6px ${ramColor}`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="sw-uptime" style={{ marginTop: "0.4rem" }}>
        ↑ {service.uptimeDays}d
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cpuBarColor(pct: number): string {
  if (pct < 50) return "#00F0FF";
  if (pct < 80) return "#FF6C11";
  return "#FF0055";
}

function ramBarColor(pct: number): string {
  if (pct < 60) return "#B967FF";
  if (pct < 85) return "#FF6C11";
  return "#FF0055";
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

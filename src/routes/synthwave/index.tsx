import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { StatCard } from "../../components/synthwave/StatCard";
import { CPUBars } from "../../components/synthwave/CPUBars";
import { NetworkGraph } from "../../components/synthwave/NetworkGraph";
import { CircularGauge } from "../../components/synthwave/CircularGauge";
import { TerminalLog } from "../../components/synthwave/TerminalLog";
import { ServiceModal } from "../../components/synthwave/ServiceModal";
import {
  services,
  mockCpuCores,
  generateNetworkHistory,
  initialLogs,
  newLogTemplates,
} from "../../lib/synthwave-data";
import type {
  ServiceNode,
  NetworkSample,
  LogEntry,
} from "../../lib/synthwave-data";

export const Route = createFileRoute("/synthwave/")({
  component: SynthwaveDashboard,
});

function useClock() {
  const [time, setTime] = useState(() => formatTime());
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function SynthwaveDashboard() {
  const time = useClock();
  const [selectedService, setSelectedService] = useState<ServiceNode | null>(
    null,
  );
  const [cpuCores, setCpuCores] = useState(() => mockCpuCores(16));
  const [networkHistory, setNetworkHistory] = useState<NetworkSample[]>(() =>
    generateNetworkHistory(60),
  );
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const logIdRef = useRef(initialLogs.length + 1);

  // Simulate live data updates
  useEffect(() => {
    const cpuInterval = setInterval(() => {
      setCpuCores((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.48) * 12;
          return Math.max(0, Math.min(100, Math.round(v + delta)));
        }),
      );
    }, 800);

    const netInterval = setInterval(() => {
      setNetworkHistory((prev) => {
        const last = prev[prev.length - 1];
        const newSample: NetworkSample = {
          timestamp: Date.now(),
          upload: Math.max(
            5,
            Math.min(120, last.upload + (Math.random() - 0.5) * 20),
          ),
          download: Math.max(
            10,
            Math.min(350, last.download + (Math.random() - 0.5) * 40),
          ),
        };
        return [...prev.slice(-59), newSample];
      });
    }, 2000);

    const logInterval = setInterval(() => {
      const template =
        newLogTemplates[Math.floor(Math.random() * newLogTemplates.length)];
      const entry: LogEntry = {
        id: logIdRef.current++,
        timestamp: formatTime(),
        ...template,
      };
      setLogs((prev) => [...prev.slice(-49), entry]);
    }, 3500);

    return () => {
      clearInterval(cpuInterval);
      clearInterval(netInterval);
      clearInterval(logInterval);
    };
  }, []);

  const handleSelect = useCallback(
    (s: ServiceNode) => setSelectedService(s),
    [],
  );
  const handleClose = useCallback(() => setSelectedService(null), []);

  // Aggregate stats for gauges
  const proxmox = services.find((s) => s.id === "proxmox");
  const unifi = services.find((s) => s.id === "unifi");

  if (!proxmox || !unifi) {
    throw new Error("Required synthwave services are missing");
  }

  return (
    <>
      {/* Top bar */}
      <header className="sw-topbar">
        <div className="sw-topbar-title">OUTRUN//GRID · HOMELAB</div>

        <div className="sw-topbar-clock" aria-label="Current time">
          {time}
        </div>

        <div className="sw-topbar-status">
          <div className="sw-health-dot" />
          <span>ALL SYSTEMS NOMINAL</span>
          <span style={{ color: "rgba(0,240,255,0.3)" }}>·</span>
          <span>↑ {proxmox.uptimeDays}D</span>
        </div>
      </header>

      {/* Main dashboard */}
      <main className="sw-dashboard">
        {/* Stat Cards */}
        <section className="sw-stat-cards" aria-label="Service status cards">
          {services.map((s) => (
            <StatCard key={s.id} service={s} onSelect={handleSelect} />
          ))}
        </section>

        {/* Visualizers */}
        <div className="sw-viz-row">
          <CPUBars cores={cpuCores} />
          <NetworkGraph samples={networkHistory} />
        </div>

        {/* Circular Gauges */}
        <section className="sw-gauges" aria-label="System resource gauges">
          <CircularGauge
            value={proxmox.memory}
            label="RAM"
            sub="128 GB"
            color="#B967FF"
          />
          <CircularGauge
            value={60}
            label="STORAGE"
            sub="2.4 / 4 TB"
            color="#00F0FF"
          />
          <CircularGauge
            value={proxmox.cpu}
            label="NODE CPU"
            sub="32 cores"
            color="#FF1493"
          />
          <CircularGauge
            value={Math.round(unifi.cpu)}
            label="NETWORK"
            sub="950 Mbps"
            color="#FFD60A"
          />
        </section>

        {/* Terminal Log */}
        <TerminalLog entries={logs} />
      </main>

      {/* Service detail modal */}
      {selectedService && (
        <ServiceModal service={selectedService} onClose={handleClose} />
      )}
    </>
  );
}

export type ServiceStatus = "healthy" | "warning" | "down";

export type ServiceCategory =
  | "Infrastructure"
  | "Media"
  | "Gaming"
  | "Home"
  | "Development"
  | "Monitoring";

export interface Track {
  name: string;
  value: string;
  duration?: string;
}

export interface Service {
  id: string;
  name: string;
  artist: string;
  albumTitle: string;
  category: ServiceCategory;
  status: ServiceStatus;
  coverColor: string;
  accentColor: string;
  icon: string;
  cpu: number; // 0–100
  memory: number; // 0–100
  uptimeDays: number;
  version: string;
  url?: string;
  tracks: Track[];
  description: string;
}

export interface CrateDivider {
  id: string;
  label: ServiceCategory;
  color: string;
}

// ----------------------------------------------------------------
// Mock data – replace with real API calls in production
// ----------------------------------------------------------------

export const dividers: CrateDivider[] = [
  { id: "div-infrastructure", label: "Infrastructure", color: "#8B4513" },
  { id: "div-media", label: "Media", color: "#1a3a5c" },
  { id: "div-gaming", label: "Gaming", color: "#2d4a1e" },
  { id: "div-home", label: "Home", color: "#5c3d2e" },
  { id: "div-development", label: "Development", color: "#3d2b4a" },
  { id: "div-monitoring", label: "Monitoring", color: "#4a3d2b" },
];

export const services: Service[] = [
  // ── Infrastructure ────────────────────────────────────────────
  {
    id: "proxmox",
    name: "Proxmox VE",
    artist: "The Hypervisor",
    albumTitle: "Bare Metal Blues",
    category: "Infrastructure",
    status: "healthy",
    coverColor: "#E45C1F",
    accentColor: "#FF8C42",
    icon: "🖥️",
    cpu: 38,
    memory: 62,
    uptimeDays: 142,
    version: "8.1.3",
    url: "https://proxmox.local:8006",
    description: "Primary hypervisor managing all VMs and containers",
    tracks: [
      { name: "VMs Running", value: "12 / 14", duration: "3:47" },
      { name: "CPU Cores", value: "32 cores", duration: "0:01" },
      { name: "Total RAM", value: "128 GB", duration: "5:20" },
      { name: "Storage Used", value: "2.4 TB / 4 TB", duration: "4:12" },
      { name: "Network In", value: "1.2 Gbps", duration: "2:58" },
      { name: "Last Backup", value: "2h ago", duration: "1:33" },
    ],
  },
  {
    id: "unifi",
    name: "UniFi Network",
    artist: "Ubiquiti Sound Co.",
    albumTitle: "Wireless Dreams",
    category: "Infrastructure",
    status: "healthy",
    coverColor: "#0065FF",
    accentColor: "#4d94ff",
    icon: "📡",
    cpu: 15,
    memory: 28,
    uptimeDays: 87,
    version: "8.0.28",
    url: "https://unifi.local",
    description: "Network controller managing APs and switches",
    tracks: [
      { name: "Active Clients", value: "47 devices", duration: "2:11" },
      { name: "Access Points", value: "4 online", duration: "0:32" },
      { name: "WAN Download", value: "920 Mbps", duration: "3:05" },
      { name: "WAN Upload", value: "45 Mbps", duration: "3:05" },
      { name: "VLANs", value: "6 active", duration: "1:15" },
      { name: "Uptime", value: "87 days", duration: "7:22" },
    ],
  },
  {
    id: "traefik",
    name: "Traefik",
    artist: "Reverse Proxy Players",
    albumTitle: "Edge of the Network",
    category: "Infrastructure",
    status: "healthy",
    coverColor: "#24A1C1",
    accentColor: "#8ed8ec",
    icon: "🔀",
    cpu: 4,
    memory: 12,
    uptimeDays: 56,
    version: "3.0.1",
    description: "Reverse proxy and load balancer",
    tracks: [
      { name: "Active Routes", value: "23 services", duration: "1:48" },
      { name: "SSL Certs", value: "12 valid", duration: "4:00" },
      { name: "Req/sec", value: "142", duration: "0:45" },
      { name: "Cert Expiry", value: "60 days", duration: "2:30" },
    ],
  },

  // ── Media ─────────────────────────────────────────────────────
  {
    id: "plex",
    name: "Plex Media Server",
    artist: "The Streamers",
    albumTitle: "Infinite Library",
    category: "Media",
    status: "healthy",
    coverColor: "#E5A00D",
    accentColor: "#F5C842",
    icon: "🎬",
    cpu: 55,
    memory: 44,
    uptimeDays: 34,
    version: "1.40.1",
    url: "https://plex.local",
    description: "Personal media server streaming movies, TV, and music",
    tracks: [
      { name: "Movies", value: "1,847", duration: "99:59" },
      { name: "TV Shows", value: "312 series", duration: "99:59" },
      { name: "Active Streams", value: "2 playing", duration: "1:30" },
      { name: "Transcodes", value: "1 active", duration: "2:15" },
      { name: "Storage", value: "14.2 TB", duration: "5:00" },
    ],
  },
  {
    id: "navidrome",
    name: "Navidrome",
    artist: "The Audiophiles",
    albumTitle: "Subsonic Sessions",
    category: "Media",
    status: "healthy",
    coverColor: "#2D9B6E",
    accentColor: "#5ecba1",
    icon: "🎵",
    cpu: 8,
    memory: 18,
    uptimeDays: 67,
    version: "0.53.3",
    description: "Self-hosted music streaming server",
    tracks: [
      { name: "Artists", value: "892", duration: "3:22" },
      { name: "Albums", value: "3,104", duration: "4:11" },
      { name: "Songs", value: "42,817", duration: "99:59" },
      { name: "Active Listeners", value: "1", duration: "2:58" },
    ],
  },

  // ── Gaming ────────────────────────────────────────────────────
  {
    id: "minecraft",
    name: "Minecraft Server",
    artist: "Creeper Records",
    albumTitle: "Pixelated Landscapes",
    category: "Gaming",
    status: "healthy",
    coverColor: "#5D8A3C",
    accentColor: "#8dc65a",
    icon: "⛏️",
    cpu: 42,
    memory: 68,
    uptimeDays: 12,
    version: "Paper 1.20.4",
    url: "minecraft://play.local:25565",
    description: "Survival Minecraft server with plugins",
    tracks: [
      { name: "Players Online", value: "3 / 20", duration: "1:24" },
      { name: "TPS", value: "19.8", duration: "0:05" },
      { name: "World Size", value: "4.2 GB", duration: "3:17" },
      { name: "RAM Allocated", value: "8 GB", duration: "2:00" },
      { name: "Peak Players", value: "8 (today)", duration: "0:45" },
    ],
  },

  // ── Home ──────────────────────────────────────────────────────
  {
    id: "homeassistant",
    name: "Home Assistant",
    artist: "The Automation Ensemble",
    albumTitle: "Smart Home Symphony",
    category: "Home",
    status: "healthy",
    coverColor: "#18BCF2",
    accentColor: "#6dd5f7",
    icon: "🏠",
    cpu: 22,
    memory: 35,
    uptimeDays: 203,
    version: "2024.1.6",
    url: "https://ha.local:8123",
    description: "Home automation hub managing smart devices",
    tracks: [
      { name: "Entities", value: "1,204", duration: "4:32" },
      { name: "Automations", value: "87 active", duration: "3:10" },
      { name: "Devices", value: "134", duration: "2:45" },
      { name: "Add-ons Running", value: "11", duration: "1:20" },
      { name: "Integrations", value: "42", duration: "2:00" },
    ],
  },

  // ── Development ───────────────────────────────────────────────
  {
    id: "gitea",
    name: "Gitea",
    artist: "The Fork Artists",
    albumTitle: "Open Source Originals",
    category: "Development",
    status: "healthy",
    coverColor: "#609926",
    accentColor: "#9ed446",
    icon: "🐙",
    cpu: 6,
    memory: 22,
    uptimeDays: 178,
    version: "1.21.4",
    url: "https://git.local",
    description: "Self-hosted Git service",
    tracks: [
      { name: "Repositories", value: "48", duration: "2:22" },
      { name: "Users", value: "3", duration: "0:30" },
      { name: "Open Issues", value: "7", duration: "1:05" },
      { name: "Storage Used", value: "12 GB", duration: "3:00" },
    ],
  },
  {
    id: "jenkins",
    name: "Jenkins CI",
    artist: "The Pipeline Crew",
    albumTitle: "Continuous Delivery",
    category: "Development",
    status: "warning",
    coverColor: "#D33833",
    accentColor: "#f07b77",
    icon: "🔧",
    cpu: 28,
    memory: 55,
    uptimeDays: 8,
    version: "2.440.1",
    description: "CI/CD automation server",
    tracks: [
      { name: "Jobs", value: "24 total", duration: "2:10" },
      { name: "Last Build", value: "UNSTABLE", duration: "4:33" },
      { name: "Queue", value: "2 waiting", duration: "1:00" },
      { name: "Build Agents", value: "3 online", duration: "0:55" },
    ],
  },

  // ── Monitoring ────────────────────────────────────────────────
  {
    id: "grafana",
    name: "Grafana",
    artist: "The Metrics Orchestra",
    albumTitle: "Dashboard Diaries",
    category: "Monitoring",
    status: "healthy",
    coverColor: "#F46800",
    accentColor: "#ffa040",
    icon: "📊",
    cpu: 12,
    memory: 30,
    uptimeDays: 95,
    version: "10.2.3",
    url: "https://grafana.local:3000",
    description: "Observability and analytics platform",
    tracks: [
      { name: "Dashboards", value: "34", duration: "2:48" },
      { name: "Data Sources", value: "8", duration: "1:00" },
      { name: "Active Alerts", value: "1 firing", duration: "0:30" },
      { name: "Panels", value: "247", duration: "4:15" },
    ],
  },
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    artist: "The Watchmen",
    albumTitle: "Always Watching",
    category: "Monitoring",
    status: "healthy",
    coverColor: "#5CBA3C",
    accentColor: "#8adf68",
    icon: "👁️",
    cpu: 3,
    memory: 8,
    uptimeDays: 200,
    version: "1.23.11",
    description: "Self-hosted uptime monitoring tool",
    tracks: [
      { name: "Monitors", value: "32", duration: "1:30" },
      { name: "Up", value: "31", duration: "2:00" },
      { name: "Down", value: "1", duration: "0:15" },
      { name: "Avg Response", value: "42ms", duration: "0:42" },
    ],
  },
];

export const crateItems = (() => {
  const items: Array<
    { type: "divider"; data: CrateDivider } | { type: "service"; data: Service }
  > = [];
  const categories: ServiceCategory[] = [
    "Infrastructure",
    "Media",
    "Gaming",
    "Home",
    "Development",
    "Monitoring",
  ];
  for (const cat of categories) {
    const divider = dividers.find((d) => d.label === cat);
    if (divider) items.push({ type: "divider", data: divider });
    const catServices = services.filter((s) => s.category === cat);
    for (const svc of catServices) items.push({ type: "service", data: svc });
  }
  return items;
})();

export function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case "healthy":
      return "var(--status-green)";
    case "warning":
      return "var(--status-amber)";
    case "down":
      return "var(--status-red)";
  }
}

export function getStatusLabel(status: ServiceStatus): string {
  switch (status) {
    case "healthy":
      return "HEALTHY";
    case "warning":
      return "WARNING";
    case "down":
      return "DOWN";
  }
}

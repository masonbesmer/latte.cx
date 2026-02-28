// ── Synthwave Dashboard — Mock Homelab Data ─────────────────────────────────
// Replace these values with real API / WebSocket data in production.

export type ServiceStatus = 'healthy' | 'warning' | 'down' | 'starting' | 'idle';

export type ServiceCategory =
  | 'infrastructure'
  | 'media'
  | 'gaming'
  | 'home'
  | 'development'
  | 'monitoring';

export const CATEGORY_COLOR: Record<ServiceCategory, string> = {
  infrastructure: '#00F0FF',
  media:          '#FF1493',
  gaming:         '#FFD60A',
  home:           '#B967FF',
  development:    '#39FF14',
  monitoring:     '#FF4444',
};

export const STATUS_COLOR: Record<ServiceStatus, string> = {
  healthy:  '#00F0FF',
  warning:  '#FF6C11',
  down:     '#FF0055',
  starting: '#FFD60A',
  idle:     'rgba(255,255,255,0.4)',
};

export interface ServiceNode {
  id: string;
  name: string;
  icon: string;
  category: ServiceCategory;
  status: ServiceStatus;
  cpu: number;       // 0–100
  memory: number;    // 0–100
  uptimeDays: number;
  version: string;
  url?: string;
  description: string;
  details: Record<string, string>;
}

export interface NetworkSample {
  timestamp: number;
  upload: number;   // Mbps
  download: number; // Mbps
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'ok';
  service: string;
  message: string;
}

// ── Services ─────────────────────────────────────────────────────────────────

export const services: ServiceNode[] = [
  {
    id: 'proxmox',
    name: 'Proxmox VE',
    icon: '🖥️',
    category: 'infrastructure',
    status: 'healthy',
    cpu: 38,
    memory: 62,
    uptimeDays: 142,
    version: '8.1.3',
    url: 'https://proxmox.local:8006',
    description: 'Primary hypervisor — 12 VMs running',
    details: {
      'VMs Running': '12 / 14',
      'CPU Cores': '32',
      'Total RAM': '128 GB',
      'Storage': '2.4 TB / 4 TB',
      'Network In': '1.2 Gbps',
    },
  },
  {
    id: 'unifi',
    name: 'UniFi Network',
    icon: '📡',
    category: 'infrastructure',
    status: 'healthy',
    cpu: 12,
    memory: 34,
    uptimeDays: 198,
    version: '8.3.32',
    url: 'https://unifi.local',
    description: 'Network controller — 47 clients',
    details: {
      'Active Clients': '47',
      'APs Online': '4 / 4',
      'WAN Speed': '950 / 940 Mbps',
      'Switches': '3',
      'Uptime': '198d',
    },
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    icon: '🏠',
    category: 'home',
    status: 'healthy',
    cpu: 8,
    memory: 41,
    uptimeDays: 87,
    version: '2024.12.4',
    url: 'https://ha.local:8123',
    description: 'Smart home — 312 devices',
    details: {
      'Devices': '312',
      'Automations': '48 active',
      'Add-ons': '12',
      'Integrations': '34',
    },
  },
  {
    id: 'plex',
    name: 'Plex Media',
    icon: '🎬',
    category: 'media',
    status: 'healthy',
    cpu: 22,
    memory: 55,
    uptimeDays: 63,
    version: '1.40.2',
    url: 'https://plex.local:32400',
    description: 'Media server — 3 streams active',
    details: {
      'Active Streams': '3',
      'Library': '4,280 items',
      'Transcodes': '1',
      'Storage': '8.2 TB',
    },
  },
  {
    id: 'minecraft',
    name: 'Minecraft SMP',
    icon: '⛏️',
    category: 'gaming',
    status: 'healthy',
    cpu: 45,
    memory: 78,
    uptimeDays: 12,
    version: '1.21.4',
    description: 'SMP Server — 4 players online',
    details: {
      'Players': '4 / 20',
      'TPS': '19.8',
      'World Size': '2.1 GB',
      'Uptime': '12d',
    },
  },
  {
    id: 'grafana',
    name: 'Grafana',
    icon: '📊',
    category: 'monitoring',
    status: 'healthy',
    cpu: 5,
    memory: 28,
    uptimeDays: 201,
    version: '11.4.0',
    url: 'https://grafana.local:3000',
    description: 'Metrics & dashboards',
    details: {
      'Dashboards': '24',
      'Data Sources': '8',
      'Alerts': '3 active',
    },
  },
  {
    id: 'gitea',
    name: 'Gitea',
    icon: '🦝',
    category: 'development',
    status: 'healthy',
    cpu: 3,
    memory: 18,
    uptimeDays: 156,
    version: '1.22.3',
    url: 'https://git.local',
    description: 'Self-hosted Git — 34 repos',
    details: {
      'Repositories': '34',
      'Users': '2',
      'Issues Open': '7',
    },
  },
  {
    id: 'pihole',
    name: 'Pi-hole',
    icon: '🕳️',
    category: 'monitoring',
    status: 'warning',
    cpu: 2,
    memory: 12,
    uptimeDays: 301,
    version: '5.18.3',
    url: 'https://pihole.local',
    description: 'DNS sinkhole — 23% blocked',
    details: {
      'Queries Today': '48,291',
      'Blocked': '11,082 (23%)',
      'Blocklists': '12',
      'Clients': '47',
    },
  },
];

// ── CPU Cores mock (simulate individual core usage) ──────────────────────────

export function mockCpuCores(count = 8): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
}

// ── Network history ───────────────────────────────────────────────────────────

export function generateNetworkHistory(points = 60): NetworkSample[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * 2000,
    upload: Math.random() * 80 + 10,
    download: Math.random() * 200 + 50,
  }));
}

// ── Initial log entries ───────────────────────────────────────────────────────

export const initialLogs: LogEntry[] = [
  { id: 1,  timestamp: '04:12:01', level: 'ok',    service: 'PROXMOX',  message: 'VM 104 (plex) started successfully' },
  { id: 2,  timestamp: '04:11:44', level: 'info',  service: 'UNIFI',    message: 'Client 192.168.1.42 connected to AP-Living' },
  { id: 3,  timestamp: '04:10:58', level: 'warn',  service: 'PIHOLE',   message: 'DNS query rate spike detected: 2400 q/min' },
  { id: 4,  timestamp: '04:09:33', level: 'info',  service: 'HA',       message: 'Automation "Evening Scene" triggered' },
  { id: 5,  timestamp: '04:08:17', level: 'ok',    service: 'GITEA',    message: 'Push received: main@latte.cx (3 commits)' },
  { id: 6,  timestamp: '04:07:52', level: 'info',  service: 'PLEX',     message: 'Transcode started: The Shining (1080p → 720p)' },
  { id: 7,  timestamp: '04:07:01', level: 'info',  service: 'MINECRAFT',message: '4 players online: MasonB, Alex, Steve, Creeper' },
  { id: 8,  timestamp: '04:06:44', level: 'ok',    service: 'GRAFANA',  message: 'Alert resolved: CPU_high on proxmox-node-1' },
  { id: 9,  timestamp: '04:05:30', level: 'warn',  service: 'PROXMOX',  message: 'VM 107 memory usage at 92%' },
  { id: 10, timestamp: '04:04:18', level: 'info',  service: 'UNIFI',    message: 'WAN failover check passed: primary link healthy' },
];

export const newLogTemplates = [
  { level: 'info'  as const, service: 'PROXMOX',   message: 'Backup completed: VM 105 snapshot created' },
  { level: 'ok'    as const, service: 'HA',         message: 'Sensor update: thermostat set to 72°F' },
  { level: 'info'  as const, service: 'UNIFI',      message: 'Client roamed: 192.168.1.88 → AP-Office' },
  { level: 'warn'  as const, service: 'PROXMOX',    message: 'Storage pool usage above 70%' },
  { level: 'ok'    as const, service: 'PLEX',       message: 'Library scan complete: 2 new items added' },
  { level: 'info'  as const, service: 'GRAFANA',    message: 'Dashboard "Homelab Overview" viewed' },
  { level: 'info'  as const, service: 'MINECRAFT',  message: 'Player joined: ZenithCraft' },
  { level: 'error' as const, service: 'PIHOLE',     message: 'Upstream DNS timeout — falling back to secondary' },
  { level: 'ok'    as const, service: 'GITEA',      message: 'CI pipeline passed: latte.cx main branch' },
  { level: 'info'  as const, service: 'HA',         message: 'Motion detected: Front door camera' },
];

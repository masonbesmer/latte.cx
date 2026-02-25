export type ProjectCategory =
  | 'home-assistant'
  | 'proxmox'
  | 'networking'
  | 'automotive'
  | 'hardware'
  | 'linux';

export interface Project {
  slug: string;
  title: string;
  tags: ProjectCategory[];
  thumbnail: string;
  summary: string;
  category: ProjectCategory;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'home-assistant': 'HOME ASSISTANT',
  proxmox: 'PROXMOX',
  networking: 'NETWORKING',
  automotive: 'AUTOMOTIVE',
  hardware: 'HARDWARE',
  linux: 'LINUX',
};

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  'home-assistant': '#02D7F2',
  proxmox: '#F2E900',
  networking: '#25E1ED',
  automotive: '#F2E900',
  hardware: '#ED1E79',
  linux: '#02D7F2',
};

export const projects: Project[] = [
  {
    slug: 'neural-home-hub',
    title: 'NEURAL HOME HUB',
    tags: ['home-assistant', 'networking'],
    thumbnail: '',
    summary: 'Full-stack home automation node with 200+ integrated sensors, voice control, and presence detection.',
    category: 'home-assistant',
  },
  {
    slug: 'proxmox-hypervisor-cluster',
    title: 'PROXMOX HYPERVISOR CLUSTER',
    tags: ['proxmox', 'linux'],
    thumbnail: '',
    summary: 'High-availability 3-node Proxmox cluster with Ceph storage and automated backup pipelines.',
    category: 'proxmox',
  },
  {
    slug: 'darknet-infrastructure',
    title: 'DARKNET INFRASTRUCTURE',
    tags: ['networking', 'linux'],
    thumbnail: '',
    summary: 'Zero-trust VLAN-segmented network with pfSense firewall, IDS/IPS, and WireGuard mesh VPN.',
    category: 'networking',
  },
  {
    slug: 'vehicle-can-bus-logger',
    title: 'VEHICLE CAN BUS LOGGER',
    tags: ['automotive', 'hardware'],
    thumbnail: '',
    summary: 'Custom OBD-II CAN bus sniffer with real-time telemetry dashboard and anomaly detection.',
    category: 'automotive',
  },
  {
    slug: 'custom-pcb-sensor-array',
    title: 'CUSTOM PCB SENSOR ARRAY',
    tags: ['hardware', 'home-assistant'],
    thumbnail: '',
    summary: 'PCB-designed environmental sensor module with ESP32, BME680, and wireless MQTT reporting.',
    category: 'hardware',
  },
  {
    slug: 'linux-kernel-hardening',
    title: 'LINUX KERNEL HARDENING',
    tags: ['linux', 'networking'],
    thumbnail: '',
    summary: 'Custom kernel builds with grsecurity patches, seccomp profiles, and eBPF-based observability.',
    category: 'linux',
  },
];

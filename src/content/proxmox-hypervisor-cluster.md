---
title: PROXMOX HYPERVISOR CLUSTER
slug: proxmox-hypervisor-cluster
tags: [proxmox, linux]
category: proxmox
date: "2024-09-03"
summary: High-availability 3-node Proxmox cluster with Ceph storage and automated backup pipelines.
---

# PROXMOX HYPERVISOR CLUSTER

## // SYSTEM OVERVIEW

A high-availability bare-metal virtualization cluster running Proxmox VE 8.x across three nodes, with a converged Ceph storage backend providing live VM migration and zero-downtime maintenance windows.

## // HARDWARE SPEC

| Node | CPU | RAM | NVMe | Role |
|------|-----|-----|------|------|
| PVE-01 | Ryzen 9 5950X | 128GB ECC | 2× 2TB | Primary |
| PVE-02 | Ryzen 9 5900X | 64GB ECC | 2× 2TB | Secondary |
| PVE-03 | Ryzen 7 5700G | 64GB ECC | 2× 1TB | Quorum |

All nodes are connected via a dedicated 25GbE Ceph network (Mellanox ConnectX-4) to isolate storage traffic from VM guest networks.

## // CEPH CONFIGURATION

```bash
# Ceph pool configuration
ceph osd pool create vm-data 128 128
ceph osd pool set vm-data size 2
ceph osd pool set vm-data min_size 1

# Enable fast rebalancing via CRUSH rules
ceph osd crush rule create-replicated ssd-rule default host ssd
```

The Ceph cluster runs a 3x replication factor for critical VMs, degraded to 2x for dev/test workloads to maximize usable capacity.

## // WORKLOADS

The cluster hosts 40+ VMs and LXC containers:

- **Security**: pfSense firewall, Wazuh SIEM, Graylog
- **Infrastructure**: Gitea, Harbor registry, Vault secrets manager
- **Observability**: Prometheus, Grafana, Loki, Tempo
- **Media**: Plex, Jellyfin, Sonarr/Radarr/Prowlarr stack
- **AI/ML**: ComfyUI with CUDA passthrough to dedicated RTX 3090

## // AUTOMATED BACKUPS

Backup pipeline runs nightly via Proxmox Backup Server (PBS) on a dedicated NAS node:

1. **VM snapshots** at 02:00 UTC — incremental CBT-backed
2. **Deduplication** at the PBS level — ~4:1 reduction ratio in practice
3. **Offsite replication** to Backblaze B2 via `rclone` — 7-day retention

Recovery time objective (RTO) for any VM: **under 8 minutes**.

## // HA FENCING

```bash
# Corosync ring configuration
corosync-cfgtool -s
# Quorum: 3 nodes, 2 votes required
# Fencing: IPMI-based hard reset via pvecm expected-votes
```

Fencing is handled via IPMI stonith — if a node loses quorum contact, remaining nodes fence it before restarting its workloads to prevent split-brain corruption.

## // RESULTS

> After 14 months of operation, the cluster has achieved 99.94% uptime with zero data loss events. The Ceph rebalancing during a drive failure completed in 47 minutes with no VM interruption.

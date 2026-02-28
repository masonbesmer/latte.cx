---
title: PROXMOX HYPERVISOR CLUSTER
slug: proxmox-hypervisor-cluster
tags: ['proxmox', 'linux']
category: proxmox
date: '2024-09-03'
summary: High-availability 3-node Proxmox cluster with Ceph storage and automated backup pipelines.
---

# PROXMOX HYPERVISOR CLUSTER

## System Overview

A three-node Proxmox VE cluster running in high-availability configuration, backed by Ceph distributed storage. The cluster hosts 35 virtual machines and 22 LXC containers across all three nodes, with automatic failover and live migration capabilities.

## Cluster Architecture

```bash
# Node inventory
pve-node-01  192.168.10.11  AMD Ryzen 9 5950X  64GB DDR4  2TB NVMe
pve-node-02  192.168.10.12  AMD Ryzen 9 5950X  64GB DDR4  2TB NVMe
pve-node-03  192.168.10.13  AMD Ryzen 9 5950X  32GB DDR4  1TB NVMe
```

Each node has a dedicated 10GbE interface for Ceph replication traffic, isolated from the management and VM traffic networks.

## Ceph Storage

Ceph is configured in a converged deployment — OSDs run on the same nodes as the hypervisor. The storage pool configuration:

- **Replication factor:** 3 (all data has three copies across three nodes)
- **OSD count:** 9 total (3 per node), NVME-backed
- **Pool layout:** `data` (VM disks), `metadata` (CephFS metadata), `backup` (snapshot archive)

```bash
# Ceph health status
$ ceph -s
  cluster:
    id:     a3f2e1c0-9d8b-4a7e-b6f2-1e3d5c7a9b0e
    health: HEALTH_OK

  services:
    mon: 3 daemons, quorum pve-01,pve-02,pve-03
    mgr: pve-01(active), standby: pve-02
    osd: 9 osds: 9 up, 9 in

  data:
    pools:   4 pools, 256 pgs
    objects: 2.87 Mi objects, 8.4 TiB data
    usage:   25 TiB used, 11 TiB / 36 TiB avail
```

## Backup Pipeline

Automated backup pipeline using Proxmox Backup Server (PBS) running in a dedicated VM:

1. **Daily incrementals** — all VMs backed up nightly at 02:00, deduplication enabled
2. **Weekly fulls** — full snapshots every Sunday, retained 4 weeks
3. **Offsite sync** — weekly backup exported to encrypted remote S3-compatible storage via restic

```bash
# PBS retention policy (proxmox-backup-client)
keep-last     3
keep-daily    7
keep-weekly   4
keep-monthly  3
```

## High Availability

HA groups are configured for all critical workloads. Fencing is handled by the cluster's built-in watchdog daemon with IPMI fallback on each node.

> **Failover time:** ~45 seconds from node failure detection to VM restart on a surviving node.

## Performance Benchmarks

| Test | Result |
|------|--------|
| Sequential read (Ceph) | 4.2 GB/s |
| Sequential write (Ceph) | 3.8 GB/s |
| 4K random IOPS | 180,000 |
| Live migration time (8GB VM) | 12 seconds |

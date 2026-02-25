---
title: DARKNET INFRASTRUCTURE
slug: darknet-infrastructure
tags: [networking, linux]
category: networking
date: "2024-07-22"
summary: Zero-trust VLAN-segmented network with pfSense firewall, IDS/IPS, and WireGuard mesh VPN.
---

# DARKNET INFRASTRUCTURE

## // SYSTEM OVERVIEW

A zero-trust network architecture spanning 12 VLANs with strict inter-VLAN routing rules, deep packet inspection, and a WireGuard mesh VPN for remote access. Built on pfSense CE + Suricata IDS/IPS with custom ruleset maintenance.

## // VLAN TOPOLOGY

```
VLAN 10  — MANAGEMENT     (pfSense, switches, APs)
VLAN 20  — SERVERS        (Proxmox cluster, NAS)
VLAN 30  — IOT            (Home Assistant nodes, ESP devices)
VLAN 40  — TRUSTED        (Primary workstations)
VLAN 50  — UNTRUSTED      (Guest devices, IoT with internet need)
VLAN 60  — CAMERAS        (Frigate NVR, IP cameras — no internet)
VLAN 70  — STORAGE        (Ceph replication, NFS mounts)
VLAN 80  — VPN_MESH       (WireGuard peer endpoints)
VLAN 90  — DMZ            (Traefik reverse proxy, public services)
VLAN 100 — DOCKER         (Container workloads with egress control)
VLAN 110 — AI_WORKLOAD    (GPU passthrough VMs)
VLAN 120 — QUARANTINE     (Auto-blocked devices pending review)
```

## // FIREWALL PHILOSOPHY

Default deny everywhere. Rules are explicit allow-lists:

- IOT devices can reach Home Assistant only — no internet, no LAN
- Cameras are fully airgapped — inbound NVR polling only
- Servers egress to internet via authenticated SOCKS5 proxy
- Trusted workstations go direct; untrusted always through IDS inspection

## // SURICATA IDS/IPS

```bash
# Emerging Threats ruleset update (daily cron)
suricata-update --suricata-conf /etc/suricata/suricata.yaml \
  --no-reload update-sources && suricata-update

# Custom rules for IOT anomaly detection
alert tcp $IOT_NET any -> !$HOME_ASSISTANT any \
  (msg:"IOT lateral movement attempt"; sid:9000001; rev:1;)
```

## // WIREGUARD MESH VPN

A full-mesh WireGuard topology with 6 peers (3 remote sites + 3 mobile endpoints), managed via [wg-meshconf](https://github.com/k4yt3x/wg-meshconf):

- All peers maintain direct tunnels — no hub-and-spoke latency
- Split tunnel: only RFC1918 and internal DNS routes through VPN
- DNS resolver: Unbound with DNSSEC + DNS-over-TLS upstream (Cloudflare 1.1.1.1)

## // THREAT DETECTION RESULTS

Over the trailing 90 days:

| Category | Blocked Events |
|----------|----------------|
| Port scans | 2,847 |
| IOT anomalies | 134 |
| DNS exfiltration attempts | 23 |
| Brute force (SSH, HTTP) | 891 |
| Known malware C2 traffic | 7 |

> All C2 traffic came from a compromised smart TV in the IoT VLAN — isolated automatically via pfSense IPAM block within 4 seconds of first detection.

## // MONITORING

Full observability stack:
- **Graylog** — aggregated firewall, Suricata, and auth logs
- **Grafana** — real-time bandwidth per VLAN, threat event timeline
- **ntopng** — layer-7 protocol visibility and top talker reports
- PagerDuty alerting for P1/P2 events (C2 traffic, firewall rule hits)

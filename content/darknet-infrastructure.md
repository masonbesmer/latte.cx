---
title: DARKNET INFRASTRUCTURE
slug: darknet-infrastructure
tags: ["networking", "linux"]
category: networking
date: "2024-07-20"
summary: Zero-trust VLAN-segmented network with pfSense firewall, IDS/IPS, and WireGuard mesh VPN.
---

# DARKNET INFRASTRUCTURE

## Network Overview

A zero-trust, defense-in-depth network architecture built around pfSense as the perimeter firewall, with full VLAN segmentation, Suricata IDS/IPS on the WAN interface, and a WireGuard mesh VPN connecting remote nodes.

## VLAN Topology

```
VLAN 10  — MANAGEMENT     192.168.10.0/24   Hypervisors, switches, APs
VLAN 20  — TRUSTED        192.168.20.0/24   Personal workstations, phones
VLAN 30  — IOT            192.168.30.0/24   IoT devices (no LAN access)
VLAN 40  — SERVERS        192.168.40.0/24   Self-hosted services
VLAN 50  — GUEST          192.168.50.0/24   Guest WiFi (internet only)
VLAN 60  — DEMILITARIZED   10.0.60.0/24      Publicly reachable services
VLAN 99  — TRANSIT        10.99.0.0/30      WAN-facing uplink
```

No inter-VLAN routing is allowed by default. All traffic crosses the firewall; explicit rules must permit each flow.

## Firewall Rules Philosophy

- **Default deny all** — every VLAN starts with a block-all rule
- **Allowlist model** — only explicitly permitted traffic passes
- **State tracking** — stateful inspection on all interfaces
- **Egress filtering** — outbound traffic from servers is scoped to known destinations

```bash
# Example: IoT VLAN rule — allow MQTT to broker only
pass in on vlan30 proto tcp from any to 192.168.40.15 port 1883
pass in on vlan30 proto udp from any to 192.168.10.1 port 53
block in on vlan30 all
```

## Intrusion Detection

Suricata runs on the WAN interface in IDS/IPS mode:

- **Ruleset:** Emerging Threats Pro + ET Open
- **Custom rules:** alert on known C2 beacon patterns, DNS tunneling, lateral movement indicators
- **Logging:** alerts streamed to Elasticsearch via Filebeat, visualized in Kibana

## WireGuard Mesh VPN

Three remote sites are connected via WireGuard point-to-multipoint mesh:

```ini
# Remote node config excerpt
[Interface]
PrivateKey = <redacted>
Address    = 10.100.0.2/24
ListenPort = 51820

[Peer]
PublicKey  = <redacted>
Endpoint   = home.example.com:51820
AllowedIPs = 10.100.0.0/24, 192.168.40.0/24
PersistentKeepalive = 25
```

Tunnel performance averages 850 Mbps on gigabit uplinks with sub-2ms additional latency between sites.

## Monitoring

All network telemetry flows into a Prometheus/Grafana stack:

| Source    | Metrics                                                   |
| --------- | --------------------------------------------------------- |
| pfSense   | firewall state table, interface throughput, rule counters |
| Suricata  | alert rate, category breakdown, top source IPs            |
| WireGuard | peer handshake timestamps, bytes transferred              |
| Switches  | port utilization, spanning tree events                    |

---
title: NEURAL HOME HUB
slug: neural-home-hub
tags: ['home-assistant', 'networking']
category: home-assistant
date: '2024-11-15'
summary: Full-stack home automation node with 200+ integrated sensors, voice control, and presence detection.
---

# NEURAL HOME HUB

## System Overview

The Neural Home Hub is a full-stack home automation platform built on Home Assistant, running inside a dedicated LXC container on the Proxmox cluster. It aggregates data from over 200 sensors distributed across the property, providing a unified control surface for every subsystem in the building.

## Architecture

The system is composed of three primary layers:

- **Data ingestion layer** — MQTT broker (Mosquitto) receiving telemetry from ESP32 nodes, Zigbee2MQTT for Zigbee devices, and Z-Wave JS for Z-Wave sensors
- **Processing layer** — Home Assistant automations, Node-RED flows, and custom Python scripts for complex event logic
- **Presentation layer** — Lovelace dashboard with custom cards, voice interface via Whisper + Piper running locally

## Hardware

```yaml
# Core hardware stack
hub:
  host: proxmox-node-01
  container: lxc/201
  cpu: 4 vCPU
  ram: 4GB
  storage: 50GB SSD

sensors:
  zigbee_devices: 87
  zwave_devices: 34
  wifi_esp32: 42
  wired_modbus: 12
```

## Presence Detection

Presence detection uses a multi-layer approach to eliminate false negatives and false positives:

1. **Network scanning** — nmap sweep of known MAC addresses every 30 seconds
2. **Bluetooth LE** — passive BLE scanning for known device beacons
3. **Motion aggregation** — PIR sensors in every room, weighted by zone
4. **ML inference** — lightweight model classifying "home" vs "away" from combined signals

```python
# Presence confidence scoring
def calculate_presence_score(signals: dict) -> float:
    weights = {
        'network': 0.35,
        'bluetooth': 0.30,
        'motion': 0.25,
        'power_draw': 0.10,
    }
    return sum(signals[k] * weights[k] for k in weights)
```

## Voice Control

Local voice processing pipeline using Whisper for STT and Piper for TTS — zero cloud dependency, sub-500ms response latency on the local GPU node.

> **NOTE:** All voice data is processed and discarded on-device. No audio is transmitted externally.

## Results

| Metric | Value |
|--------|-------|
| Automation rules | 247 |
| Average response latency | 180ms |
| Uptime (30 days) | 99.97% |
| Power monitoring accuracy | ±2W |

The system has been running in production for 14 months with only one unplanned outage (upstream network issue, 4 hours).

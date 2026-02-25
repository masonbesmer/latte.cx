---
title: NEURAL HOME HUB
slug: neural-home-hub
tags: [home-assistant, networking]
category: home-assistant
date: "2024-11-15"
summary: Full-stack home automation node with 200+ integrated sensors, voice control, and presence detection.
---

# NEURAL HOME HUB

## // SYSTEM OVERVIEW

The Neural Home Hub is a fully autonomous home automation system built on Home Assistant, integrating over 200 sensors across a zero-trust VLAN architecture. The system handles everything from lighting and climate to security and energy monitoring.

## // ARCHITECTURE

The stack runs on a dedicated Intel NUC12 with 32GB RAM, operating a containerized Home Assistant instance alongside:

- **Zigbee2MQTT** — manages 140+ Zigbee sensors via a SLZB-06 coordinator
- **Node-RED** — orchestrates automation logic with sub-100ms response times
- **InfluxDB + Grafana** — time-series sensor telemetry and live dashboards
- **ESPHome** — 60+ custom ESP32/ESP8266 firmware nodes

## // PRESENCE DETECTION

Presence detection runs a multi-layer confidence model:

1. **WiFi probe requests** — passive device tracking without authentication
2. **Bluetooth LE beacons** — room-level presence via BLE scanners at each entry point
3. **mmWave radar** (HLK-LD2410) — occupancy without needing a mobile device
4. **Facial recognition** — Frigate NVR with Coral TPU for person identification

The system reaches 99.2% accuracy across a 3,200 sq/ft layout.

## // VOICE CONTROL

Local voice processing via **Wyoming + Whisper + Piper** — completely offline, no cloud dependency:

```yaml
# Home Assistant voice pipeline config
voice_pipeline:
  name: "LOCAL_VOICE_NODE"
  stt:
    engine: whisper
    model: medium
  tts:
    engine: piper
    voice: en_US-lessac-medium
  intent_engine: conversation
```

## // ENERGY MONITORING

Real-time energy monitoring at the circuit level using Emporia Vue 2 with custom ESPHome firmware, tracking:

- Per-circuit wattage at 1-second intervals
- Daily/weekly/monthly consumption reports
- Automated load-shedding during peak rates

## // RESULTS

| Metric | Value |
|--------|-------|
| Sensors integrated | 214 |
| Average response latency | 47ms |
| Monthly cloud API calls | 0 |
| Uptime (12-month avg) | 99.97% |
| Energy savings vs. baseline | 23% |

## // LESSONS LEARNED

> Running everything local eliminates latency and cloud dependency, but demands rigorous backup strategy. Weekly snapshots to NAS + offsite Backblaze B2 keeps recovery time under 15 minutes.

The most complex challenge was implementing a room-correction algorithm for the mmWave sensors in open-plan spaces — false positives in overlapping detection zones required custom Bayesian probability weighting in Node-RED.

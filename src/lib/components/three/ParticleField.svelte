<script lang="ts">
  import { useThrelte, useTask } from '@threlte/core';
  import { onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { activeSection } from '$lib/stores/scene';

  const { scene, camera } = useThrelte();

  const COUNT = 1000;

  // ── Geometry buffers ─────────────────────────────────────────────────────────
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  // Per-particle state
  const driftY = new Float32Array(COUNT); // upward drift speed
  const impX   = new Float32Array(COUNT); // impulse velocity X
  const impY   = new Float32Array(COUNT); // impulse velocity Y
  const impZ   = new Float32Array(COUNT); // impulse velocity Z
  const jitter = new Float32Array(COUNT); // per-particle color jitter ±10 %

  // ── Color lerp state ──────────────────────────────────────────────────────────
  const cyanColor    = new THREE.Color('#02D7F2');
  const yellowColor  = new THREE.Color('#F2E900');
  const currentColor = new THREE.Color('#02D7F2');
  let   startColor   = new THREE.Color('#02D7F2');
  let   targetColor  = new THREE.Color('#02D7F2');
  let   colorProgress = 1.0; // 1 = no active transition

  function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // ── Initialise particles ──────────────────────────────────────────────────────
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = rand(-30, 30);
    positions[i * 3 + 1] = rand(-5, 20);
    positions[i * 3 + 2] = rand(-30, 10);

    driftY[i] = rand(0.005, 0.02);
    jitter[i] = rand(0.9, 1.1);

    colors[i * 3]     = cyanColor.r;
    colors[i * 3 + 1] = cyanColor.g;
    colors[i * 3 + 2] = cyanColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  // ── Material ──────────────────────────────────────────────────────────────────
  const material = new THREE.PointsMaterial({
    size:            0.15,
    sizeAttenuation: true,
    transparent:     true,
    opacity:         0.75,
    blending:        THREE.AdditiveBlending,
    vertexColors:    true,
    depthWrite:      false,
    fog:             true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ── Mouse tracking ────────────────────────────────────────────────────────────
  let ndcX = 0;
  let ndcY = 0;
  let mouseMoved = false;

  function onMouseMove(e: MouseEvent) {
    ndcX = (e.clientX / window.innerWidth)  *  2 - 1;
    ndcY = (e.clientY / window.innerHeight) * -2 + 1;
    mouseMoved = true;
  }

  window.addEventListener('mousemove', onMouseMove);

  const raycaster  = new THREE.Raycaster();
  const ndcVec2    = new THREE.Vector2(); // reused every frame — avoids heap alloc on mousemove
  // Intersect against a horizontal plane at Y = 5 (mid-height of particle volume)
  const burstPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -5);
  const burstPoint = new THREE.Vector3();

  // ── activeSection → color transition ─────────────────────────────────────────
  const unsubSection = activeSection.subscribe((section) => {
    startColor    = currentColor.clone();
    targetColor   = section === 'projects' ? yellowColor.clone() : cyanColor.clone();
    colorProgress = 0;
  });

  // ── Per-frame task (runs in default stage, before renderStage) ────────────────
  useTask(() => {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = geometry.attributes.color    as THREE.BufferAttribute;

    // ── Color lerp (≈ 60 frames = 1 second) ──────────────────────────────────
    let colorDirty = false;
    if (colorProgress < 1.0) {
      colorProgress = Math.min(1.0, colorProgress + 1 / 60);
      currentColor.lerpColors(startColor, targetColor, colorProgress);
      colorDirty = true;
    }

    // ── Compute mouse burst point ─────────────────────────────────────────────
    let hasBurst = false;
    if (mouseMoved) {
      const cam = camera.current;
      if (cam) {
        raycaster.setFromCamera(ndcVec2.set(ndcX, ndcY), cam);
        if (raycaster.ray.intersectPlane(burstPlane, burstPoint)) {
          hasBurst = true;
        }
      }
      mouseMoved = false;
    }

    // ── Update each particle ──────────────────────────────────────────────────
    for (let i = 0; i < COUNT; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Add mouse burst impulse based on current position
      if (hasBurst) {
        const dx   = x - burstPoint.x;
        const dy   = y - burstPoint.y;
        const dz   = z - burstPoint.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3 && dist > 0.01) {
          const mag = 0.3 / dist;
          impX[i] += dx * mag;
          impY[i] += dy * mag;
          impZ[i] += dz * mag;
        }
      }

      // Upward drift
      y += driftY[i];

      // Apply and dampen impulse (0.95 per frame → nearly zero after ~120 frames / 2 s)
      x += impX[i];
      y += impY[i];
      z += impZ[i];
      impX[i] *= 0.95;
      impY[i] *= 0.95;
      impZ[i] *= 0.95;

      // Recycle particle at top of volume
      if (y > 25) {
        x = rand(-30, 30);
        y = -5;
        z = rand(-30, 10);
        impX[i] = 0;
        impY[i] = 0;
        impZ[i] = 0;
      }

      posAttr.setXYZ(i, x, y, z);

      // Per-particle colour with ±10 % hue jitter
      if (colorDirty) {
        const j = jitter[i];
        colAttr.setXYZ(
          i,
          Math.min(1, currentColor.r * j),
          Math.min(1, currentColor.g * j),
          Math.min(1, currentColor.b * j),
        );
      }
    }

    posAttr.needsUpdate = true;
    if (colorDirty) colAttr.needsUpdate = true;
  });

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  onDestroy(() => {
    window.removeEventListener('mousemove', onMouseMove);
    unsubSection();
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  });
</script>

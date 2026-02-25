<script lang="ts">
  import { useThrelte, useTask } from '@threlte/core';
  import { onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

  const { renderer, scene, camera, autoRenderTask, size, renderStage } = useThrelte();

  // Create and register the perspective camera for the background scene
  const perspCam = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  perspCam.position.set(0, 8, 18);
  perspCam.lookAt(0, 2, -5);
  scene.add(perspCam);
  camera.set(perspCam);

  // Set renderer clear color so the canvas provides the dark background
  renderer.setClearColor('#0A0A0F', 1);

  // Stop Threlte's default auto-render so we can use EffectComposer
  autoRenderTask.stop();

  let composer: EffectComposer | null = null;

  function initComposer() {
    const { width, height } = size.current;

    composer?.dispose();
    composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, perspCam);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.5,  // strength (reduced for subtler glow)
      0.3,  // radius
      0.3   // threshold (higher = only very bright objects bloom)
    );
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    composer.setSize(width, height);
  }

  // Update camera aspect and composer size on canvas resize
  const unsubSize = size.subscribe((s) => {
    perspCam.aspect = s.width / s.height;
    perspCam.updateProjectionMatrix();
    composer?.setSize(s.width, s.height);
  });

  // Mouse parallax state
  let mouseX = 0;
  let mouseY = 0;
  let camX = 0;
  let camY = 0;

  function onMouseMove(e: MouseEvent) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onDeviceOrientation(e: DeviceOrientationEvent) {
    if (e.beta !== null && e.gamma !== null) {
      mouseX = Math.max(-1, Math.min(1, e.gamma / 45));
      mouseY = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
    }
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('deviceorientation', onDeviceOrientation);

  // Render task runs in the render stage (after all main-stage updates)
  useTask(
    () => {
      // Lazy init EffectComposer on first frame
      if (!composer) {
        initComposer();
        if (!composer) return;
      }

      // Camera parallax — lerp toward mouse-driven target (damping 0.05)
      camX += (mouseX * 0.5 - camX) * 0.05;
      camY += (mouseY * 0.25 - camY) * 0.05;
      perspCam.position.x = camX;
      perspCam.position.y = 8 + camY;

      // Render via EffectComposer (replaces autoRenderTask)
      composer.render();
    },
    { stage: renderStage, autoStart: true }
  );

  onDestroy(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    unsubSize();
    scene.remove(perspCam);
    autoRenderTask.start();
    composer?.dispose();
  });
</script>

<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import { Grid, Float } from '@threlte/extras';
  import SceneCore from './SceneCore.svelte';

  // City building data — deterministic layout for a cyberpunk skyline
  const buildings = [
    // Row 1 (z = -25)
    { position: [-28, 12, -25] as [number, number, number], geometry: [3, 24, 3] as [number, number, number], emissive: '#F2E900' },
    { position: [-14, 18, -25] as [number, number, number], geometry: [4, 36, 4] as [number, number, number], emissive: '#02D7F2' },
    { position: [0,   15, -25] as [number, number, number], geometry: [3, 30, 3] as [number, number, number], emissive: '#F2E900' },
    { position: [14,  10, -25] as [number, number, number], geometry: [4, 20, 4] as [number, number, number], emissive: '#02D7F2' },
    { position: [28,  20, -25] as [number, number, number], geometry: [3, 40, 3] as [number, number, number], emissive: '#F2E900' },
    // Row 2 (z = -38)
    { position: [-22, 8,  -38] as [number, number, number], geometry: [5, 16, 5] as [number, number, number], emissive: '#02D7F2' },
    { position: [-8,  17, -38] as [number, number, number], geometry: [3, 34, 3] as [number, number, number], emissive: '#F2E900' },
    { position: [7,   22, -38] as [number, number, number], geometry: [4, 44, 4] as [number, number, number], emissive: '#02D7F2' },
    { position: [20,  13, -38] as [number, number, number], geometry: [3, 26, 3] as [number, number, number], emissive: '#ED1E79' },
    { position: [32,  9,  -38] as [number, number, number], geometry: [5, 18, 5] as [number, number, number], emissive: '#F2E900' },
    // Row 3 (z = -52)
    { position: [-30, 14, -52] as [number, number, number], geometry: [4, 28, 4] as [number, number, number], emissive: '#F2E900' },
    { position: [-16, 19, -52] as [number, number, number], geometry: [3, 38, 3] as [number, number, number], emissive: '#02D7F2' },
    { position: [2,   11, -52] as [number, number, number], geometry: [6, 22, 6] as [number, number, number], emissive: '#ED1E79' },
    { position: [18,  24, -52] as [number, number, number], geometry: [3, 48, 3] as [number, number, number], emissive: '#F2E900' },
    { position: [30,  16, -52] as [number, number, number], geometry: [5, 32, 5] as [number, number, number], emissive: '#02D7F2' },
    // Row 4 (z = -65, far background)
    { position: [-25, 18, -65] as [number, number, number], geometry: [4, 36, 4] as [number, number, number], emissive: '#02D7F2' },
    { position: [-10, 12, -65] as [number, number, number], geometry: [3, 24, 3] as [number, number, number], emissive: '#F2E900' },
    { position: [5,   20, -65] as [number, number, number], geometry: [5, 40, 5] as [number, number, number], emissive: '#F2E900' },
    { position: [22,  15, -65] as [number, number, number], geometry: [3, 30, 3] as [number, number, number], emissive: '#02D7F2' },
    { position: [35,  22, -65] as [number, number, number], geometry: [4, 44, 4] as [number, number, number], emissive: '#ED1E79' },
  ] satisfies { position: [number, number, number]; geometry: [number, number, number]; emissive: string }[];

  // Floating data shards — wireframe octahedra in cyberpunk colors
  const shards = [
    { position: [-8,  6,  -8]  as [number, number, number], size: 0.8, color: '#02D7F2', speed: 1.2, intensity: 0.6 },
    { position: [0,   9,  -14] as [number, number, number], size: 1.0, color: '#F2E900', speed: 0.8, intensity: 0.7 },
    { position: [8,   5,  -6]  as [number, number, number], size: 0.6, color: '#ED1E79', speed: 1.5, intensity: 0.5 },
    { position: [-5,  11, -18] as [number, number, number], size: 1.2, color: '#02D7F2', speed: 0.6, intensity: 0.6 },
    { position: [5,   7,  -11] as [number, number, number], size: 0.9, color: '#F2E900', speed: 1.0, intensity: 0.5 },
  ] satisfies { position: [number, number, number]; size: number; color: string; speed: number; intensity: number }[];
</script>

<div class="scene-wrapper">
  <Canvas>
    <!-- Camera: positioned above the grid at a slight downward angle (managed in SceneCore) -->

    <!-- Atmospheric fog: deep black, fades distant geometry -->
    <T.FogExp2 attach="fog" args={['#0A0A0F', 0.015]} />

    <!-- Subtle ambient light in cyan -->
    <T.AmbientLight intensity={0.3} color="#02D7F2" />

    <!-- Dim directional light for building depth -->
    <T.DirectionalLight intensity={0.5} color="#02D7F2" position={[0, 20, 10]} />

    <!-- Cyberpunk grid plane -->
    <Grid
      cellColor="#02D7F2"
      sectionColor="#25E1ED"
      gridSize={[120, 120]}
      cellSize={2}
      sectionSize={10}
      backgroundOpacity={0}
      fadeDistance={90}
      fadeStrength={1.5}
      cellThickness={0.5}
      sectionThickness={1}
      position={[0, 0, 0]}
    />

    <!-- City skyline silhouettes -->
    {#each buildings as building}
      <T.Mesh position={building.position}>
        <T.BoxGeometry args={building.geometry} />
        <T.MeshStandardMaterial
          color="#0A0A0F"
          emissive={building.emissive}
          emissiveIntensity={0.5}
        />
      </T.Mesh>
    {/each}

    <!-- Floating data shards -->
    {#each shards as shard}
      <Float
        speed={shard.speed}
        floatIntensity={shard.intensity}
        floatingRange={[-0.3, 0.3]}
        rotationIntensity={1}
        rotationSpeed={0.5}
      >
        <T.Mesh position={shard.position}>
          <T.OctahedronGeometry args={[shard.size]} />
          <T.MeshStandardMaterial
            color={shard.color}
            emissive={shard.color}
            emissiveIntensity={1.5}
            wireframe={true}
          />
        </T.Mesh>
      </Float>
    {/each}

    <!-- Scene core: bloom post-processing + mouse parallax -->
    <SceneCore />
  </Canvas>
</div>

<style>
  .scene-wrapper {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
</style>

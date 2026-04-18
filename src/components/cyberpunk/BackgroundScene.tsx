import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Float } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const buildings = [
  {
    position: [-28, 12, -25] as [number, number, number],
    geometry: [3, 24, 3] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [-14, 18, -25] as [number, number, number],
    geometry: [4, 36, 4] as [number, number, number],
    emissive: "#02D7F2",
  },
  {
    position: [0, 15, -25] as [number, number, number],
    geometry: [3, 30, 3] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [14, 10, -25] as [number, number, number],
    geometry: [4, 20, 4] as [number, number, number],
    emissive: "#02D7F2",
  },
  {
    position: [28, 20, -25] as [number, number, number],
    geometry: [3, 40, 3] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [-22, 8, -38] as [number, number, number],
    geometry: [5, 16, 5] as [number, number, number],
    emissive: "#02D7F2",
  },
  {
    position: [-8, 17, -38] as [number, number, number],
    geometry: [3, 34, 3] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [7, 22, -38] as [number, number, number],
    geometry: [4, 44, 4] as [number, number, number],
    emissive: "#02D7F2",
  },
  {
    position: [20, 13, -38] as [number, number, number],
    geometry: [3, 26, 3] as [number, number, number],
    emissive: "#ED1E79",
  },
  {
    position: [32, 9, -38] as [number, number, number],
    geometry: [5, 18, 5] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [-30, 14, -52] as [number, number, number],
    geometry: [4, 28, 4] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [-16, 19, -52] as [number, number, number],
    geometry: [3, 38, 3] as [number, number, number],
    emissive: "#02D7F2",
  },
  {
    position: [2, 11, -52] as [number, number, number],
    geometry: [6, 22, 6] as [number, number, number],
    emissive: "#ED1E79",
  },
  {
    position: [18, 24, -52] as [number, number, number],
    geometry: [3, 48, 3] as [number, number, number],
    emissive: "#F2E900",
  },
  {
    position: [30, 16, -52] as [number, number, number],
    geometry: [5, 32, 5] as [number, number, number],
    emissive: "#02D7F2",
  },
];

const shards = [
  {
    position: [-8, 6, -8] as [number, number, number],
    size: 0.8,
    color: "#02D7F2",
    speed: 1.2,
    intensity: 0.6,
  },
  {
    position: [0, 9, -14] as [number, number, number],
    size: 1.0,
    color: "#F2E900",
    speed: 0.8,
    intensity: 0.7,
  },
  {
    position: [8, 5, -6] as [number, number, number],
    size: 0.6,
    color: "#ED1E79",
    speed: 1.5,
    intensity: 0.5,
  },
  {
    position: [-5, 11, -18] as [number, number, number],
    size: 1.2,
    color: "#02D7F2",
    speed: 0.6,
    intensity: 0.6,
  },
  {
    position: [5, 7, -11] as [number, number, number],
    size: 0.9,
    color: "#F2E900",
    speed: 1.0,
    intensity: 0.5,
  },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ParticleField() {
  const COUNT = 1000;
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useRef(new Float32Array(COUNT * 3));
  const colors = useRef(new Float32Array(COUNT * 3));
  const driftY = useRef(new Float32Array(COUNT));

  useEffect(() => {
    const cyanColor = new THREE.Color("#02D7F2");
    for (let i = 0; i < COUNT; i++) {
      positions.current[i * 3] = rand(-30, 30);
      positions.current[i * 3 + 1] = rand(-5, 20);
      positions.current[i * 3 + 2] = rand(-30, 10);
      driftY.current[i] = rand(0.005, 0.02);
      colors.current[i * 3] = cyanColor.r;
      colors.current[i * 3 + 1] = cyanColor.g;
      colors.current[i * 3 + 2] = cyanColor.b;
    }
  }, []);

  useFrame(() => {
    const geo = geometryRef.current;
    if (!geo) return;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      y += driftY.current[i];
      if (y > 25) {
        posAttr.setXYZ(i, rand(-30, 30), -5, rand(-30, 10));
      } else {
        posAttr.setXYZ(i, x, y, z);
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        vertexColors
        depthWrite={false}
      />
    </points>
  );
}

function SceneCore() {
  const { gl, scene, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const camRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const camX = useRef(0);
  const camY = useRef(0);

  useEffect(() => {
    const cam = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      200,
    );
    cam.position.set(0, 8, 18);
    cam.lookAt(0, 2, -5);
    camRef.current = cam;
    scene.add(cam);

    gl.setClearColor("#0A0A0F", 1);

    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, cam));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        0.5,
        0.3,
        0.3,
      ),
    );
    composer.addPass(new OutputPass());
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    function onMouseMove(e: MouseEvent) {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      scene.remove(cam);
      composerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!camRef.current || !composerRef.current) return;
    camRef.current.aspect = size.width / size.height;
    camRef.current.updateProjectionMatrix();
    composerRef.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    if (!composerRef.current) return;
    camX.current += (mouseX.current * 0.5 - camX.current) * 0.05;
    camY.current += (mouseY.current * 0.25 - camY.current) * 0.05;
    if (camRef.current) {
      camRef.current.position.x = camX.current;
      camRef.current.position.y = 8 + camY.current;
    }
    composerRef.current.render();
  }, 1);

  return null;
}

export function BackgroundScene() {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <Canvas gl={{ antialias: true }} frameloop="always">
        <fog attach="fog" args={["#0A0A0F", 0, 80]} />
        <ambientLight intensity={0.3} color="#02D7F2" />
        <directionalLight
          intensity={0.5}
          color="#02D7F2"
          position={[0, 20, 10]}
        />
        <Grid
          cellColor="#02D7F2"
          sectionColor="#25E1ED"
          args={[120, 120]}
          cellSize={2}
          sectionSize={10}
          fadeDistance={90}
          fadeStrength={1.5}
          cellThickness={0.5}
          sectionThickness={1}
          position={[0, 0, 0]}
        />
        {buildings.map((b, i) => (
          <mesh key={i} position={b.position}>
            <boxGeometry args={b.geometry} />
            <meshStandardMaterial
              color="#0A0A0F"
              emissive={b.emissive}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        {shards.map((s, i) => (
          <Float
            key={i}
            speed={s.speed}
            floatIntensity={s.intensity}
            floatingRange={[-0.3, 0.3]}
            rotationIntensity={1}
          >
            <mesh position={s.position}>
              <octahedronGeometry args={[s.size]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={1.5}
                wireframe
              />
            </mesh>
          </Float>
        ))}
        <SceneCore />
        <ParticleField />
      </Canvas>
    </div>
  );
}

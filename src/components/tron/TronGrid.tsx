import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const GRID_COLOR = "#00AAFF";
const GRID_BG = "#050510";

function SceneInner() {
  const { gl, scene, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const camRef = useRef<THREE.PerspectiveCamera | null>(null);
  const offsetRef = useRef(0);
  const gridRef = useRef<THREE.LineSegments | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- gl/scene/size refs are stable on mount
  useEffect(() => {
    gl.setClearColor(GRID_BG, 1);

    // Camera: slight angle looking down at the grid floor
    const cam = new THREE.PerspectiveCamera(
      55,
      size.width / size.height,
      0.1,
      500,
    );
    cam.position.set(0, 6, 0);
    cam.lookAt(0, 0, -40);
    camRef.current = cam;
    scene.add(cam);

    // Build grid floor as LineSegments for precise control
    const COLS = 30;
    const ROWS = 60;
    const CELL_W = 4;
    const DEPTH = 200;
    const WIDTH = COLS * CELL_W;

    const vertices: number[] = [];
    // horizontal lines
    for (let r = 0; r <= ROWS; r++) {
      const z = -(r / ROWS) * DEPTH;
      vertices.push(-WIDTH / 2, 0, z, WIDTH / 2, 0, z);
    }
    // vertical lines
    for (let c = 0; c <= COLS; c++) {
      const x = -WIDTH / 2 + c * CELL_W;
      vertices.push(x, 0, 0, x, 0, -DEPTH);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    const mat = new THREE.LineBasicMaterial({
      color: GRID_COLOR,
      transparent: true,
      opacity: 0.65,
    });
    const lines = new THREE.LineSegments(geo, mat);
    gridRef.current = lines;
    scene.add(lines);

    // Bloom post-processing
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, cam));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        0.8,
        0.4,
        0.2,
      ),
    );
    composer.addPass(new OutputPass());
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    return () => {
      scene.remove(cam);
      scene.remove(lines);
      geo.dispose();
      mat.dispose();
      composerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!camRef.current || !composerRef.current) return;
    camRef.current.aspect = size.width / size.height;
    camRef.current.updateProjectionMatrix();
    composerRef.current.setSize(size.width, size.height);
  }, [size]);

  useFrame((_state, delta) => {
    if (!composerRef.current || !gridRef.current) return;
    // Animate grid scrolling forward (recession toward viewer)
    offsetRef.current = (offsetRef.current + delta * 6) % 4;
    gridRef.current.position.z = offsetRef.current;
    composerRef.current.render();
  }, 1);

  return null;
}

export function TronGrid() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: GRID_BG,
      }}
    >
      <Canvas gl={{ antialias: true }} frameloop="always">
        <fog attach="fog" args={[GRID_BG, 30, 180]} />
        <SceneInner />
      </Canvas>
    </div>
  );
}

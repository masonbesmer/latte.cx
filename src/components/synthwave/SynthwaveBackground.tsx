import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

// ── Scrolling synthwave perspective grid ─────────────────────────────────────

const GRID_W     = 50    // half-width of grid in world units
const GRID_DEPTH = 80    // how far grid extends back
const H_COUNT    = 28    // number of horizontal lines
const V_COUNT    = 22    // number of vertical lines
const H_SPACING  = GRID_DEPTH / H_COUNT
const GRID_SPEED = 0.04  // world units per frame

function SynthwaveGrid() {
  const linesRef = useRef<THREE.LineSegments | null>(null)
  const offsetRef = useRef(0)

  // Build geometry: horizontal lines + vertical lines
  const { geometry, hPositions } = useMemo(() => {
    const totalLines = H_COUNT + V_COUNT + 1
    const positions = new Float32Array(totalLines * 2 * 3)
    let idx = 0

    // Horizontal lines – we'll update Z each frame
    for (let i = 0; i < H_COUNT; i++) {
      const z = -i * H_SPACING
      positions[idx++] = -GRID_W; positions[idx++] = 0; positions[idx++] = z
      positions[idx++] =  GRID_W; positions[idx++] = 0; positions[idx++] = z
    }
    // Vertical lines – static (span full depth)
    for (let i = 0; i <= V_COUNT; i++) {
      const x = -GRID_W + i * (GRID_W * 2 / V_COUNT)
      positions[idx++] = x; positions[idx++] = 0; positions[idx++] = 0
      positions[idx++] = x; positions[idx++] = 0; positions[idx++] = -GRID_DEPTH
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return { geometry: geo, hPositions: positions }
  }, [])

  useFrame(() => {
    const lines = linesRef.current
    if (!lines) return

    offsetRef.current = (offsetRef.current + GRID_SPEED) % H_SPACING
    const off = offsetRef.current
    const posAttr = lines.geometry.attributes.position as THREE.BufferAttribute

    // Update horizontal line Z positions
    for (let i = 0; i < H_COUNT; i++) {
      const baseZ = -i * H_SPACING + off
      const z = baseZ > 2 ? baseZ - GRID_DEPTH : baseZ  // wrap around
      posAttr.setZ(i * 2,     z)
      posAttr.setZ(i * 2 + 1, z)
    }
    posAttr.needsUpdate = true
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#FF006E" transparent opacity={0.9} />
    </lineSegments>
  )
}

// ── Mountain silhouettes ──────────────────────────────────────────────────────
function Mountains() {
  const shape = useMemo(() => {
    const peaks: [number, number][] = [
      [-50, 0], [-35, 8], [-25, 5], [-15, 12], [-5, 7],
      [5, 14], [15, 6], [25, 10], [35, 7], [50, 0],
    ]
    const shape = new THREE.Shape()
    shape.moveTo(-50, 0)
    peaks.forEach(([x, y]) => shape.lineTo(x, y))
    shape.lineTo(50, 0)
    shape.lineTo(-50, 0)
    return shape
  }, [])

  const geo = useMemo(() => new THREE.ShapeGeometry(shape), [shape])

  return (
    <mesh geometry={geo} position={[0, 0, -GRID_DEPTH]}>
      <meshBasicMaterial color="#100525" />
    </mesh>
  )
}

// ── Ambient particles ─────────────────────────────────────────────────────────
function Particles() {
  const COUNT = 600
  const ref = useRef<THREE.Points | null>(null)
  const driftY = useRef(new Float32Array(COUNT))

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const pink  = new THREE.Color('#FF1493')
    const cyan  = new THREE.Color('#00F0FF')
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = Math.random() * 20
      pos[i * 3 + 2] = -Math.random() * 60
      driftY.current[i] = 0.005 + Math.random() * 0.015
      const c = Math.random() > 0.5 ? pink : cyan
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(() => {
    const pts = ref.current
    if (!pts) return
    const pa = pts.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < COUNT; i++) {
      let y = pa.getY(i) + driftY.current[i]
      if (y > 22) y = -2
      pa.setY(i, y)
    }
    pa.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        vertexColors
        depthWrite={false}
      />
    </points>
  )
}

// ── Scene core: camera + bloom composer ──────────────────────────────────────
function SceneCore() {
  const { gl, scene, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const camRef      = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    const cam = new THREE.PerspectiveCamera(55, size.width / size.height, 0.1, 300)
    cam.position.set(0, 4, 6)
    cam.lookAt(0, 0, -30)
    camRef.current = cam
    scene.add(cam)
    gl.setClearColor('#000000', 0)   // transparent — CSS sky shows through

    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, cam))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.8,   // strength
      0.5,   // radius
      0.05,  // threshold (low = more elements bloom)
    )
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
    composer.setSize(size.width, size.height)
    composerRef.current = composer

    return () => {
      scene.remove(cam)
      composerRef.current?.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!camRef.current || !composerRef.current) return
    camRef.current.aspect = size.width / size.height
    camRef.current.updateProjectionMatrix()
    composerRef.current.setSize(size.width, size.height)
  }, [size])

  useFrame(() => {
    if (document.hidden) return
    composerRef.current?.render()
  }, 1)

  return null
}

// ── Exported component ────────────────────────────────────────────────────────
export function SynthwaveBackground() {
  return (
    <>
      {/* CSS gradient sky + sun */}
      <div className="sw-sky" aria-hidden="true">
        <div className="sw-sun" />
      </div>

      {/* Three.js grid canvas */}
      <div className="sw-canvas-wrapper" aria-hidden="true">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          frameloop="always"
          style={{ width: '100%', height: '100%' }}
        >
          <fog attach="fog" args={['#0A0E27', 20, 85]} />
          <SynthwaveGrid />
          <Mountains />
          <Particles />
          <SceneCore />
        </Canvas>
      </div>
    </>
  )
}

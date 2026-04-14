"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"

const ORBIT_ITEMS = [
  { label: "Python",  radius: 2.2, speed: 0.55, color: "#6366f1", yOffset: 0.3,  size: 0.12 },
  { label: "LLMs",    radius: 1.7, speed: -0.7, color: "#22d3ee", yOffset: -0.2, size: 0.10 },
  { label: "RAG",     radius: 2.6, speed: 0.4,  color: "#8b5cf6", yOffset: 0.5,  size: 0.11 },
  { label: "Next.js", radius: 2.0, speed: -0.5, color: "#06b6d4", yOffset: -0.4, size: 0.09 },
  { label: "FastAPI", radius: 2.8, speed: 0.35, color: "#a5f3fc", yOffset: 0.1,  size: 0.10 },
  { label: "Docker",  radius: 1.5, speed: 0.9,  color: "#818cf8", yOffset: -0.1, size: 0.09 },
]

/* ─── Glowing center sphere ─────────────────────────────────────────────── */
function CenterSphere() {
  const meshRef    = useRef<THREE.Mesh>(null!)
  const glowRef    = useRef<THREE.Mesh>(null!)
  const innerRef   = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.3
      innerRef.current.rotation.x = t * 0.15
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.06
      glowRef.current.scale.setScalar(s)
    }
  })

  return (
    <>
      {/* Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 2]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.9} />
      </mesh>
      {/* Glow shell 1 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {/* Glow shell 2 — cyan */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

/* ─── Single orbiting satellite ─────────────────────────────────────────── */
function OrbitSatellite({
  label,
  radius,
  speed,
  color,
  yOffset,
  size,
  initialAngle,
}: (typeof ORBIT_ITEMS)[0] & { initialAngle: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const dotRef   = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = initialAngle + t * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius
      groupRef.current.position.z = Math.sin(angle) * radius
      groupRef.current.position.y = yOffset + Math.sin(t * 0.8 + initialAngle) * 0.15
    }
    if (dotRef.current) {
      dotRef.current.rotation.y = t * 2
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={dotRef}>
        <octahedronGeometry args={[size, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <Text
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="bottom"
        position={[0, size + 0.14, 0]}
        // @ts-ignore
        renderOrder={10}
        depthTest={false}
      >
        {label}
      </Text>
    </group>
  )
}

/* ─── Orbit ring rings ───────────────────────────────────────────────────── */
function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return pts
  }, [radius])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])

  return (
    <line rotation={[tilt, 0, 0]}>
      <primitive object={geo} />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
    </line>
  )
}

/* ─── Full 3D scene ─────────────────────────────────────────────────────── */
function OrbScene() {
  const initialAngles = useMemo(
    () => ORBIT_ITEMS.map((_, i) => (i / ORBIT_ITEMS.length) * Math.PI * 2),
    []
  )

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 3, 3]} intensity={0.8} color="#6366f1" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color="#22d3ee" />

      <CenterSphere />

      {ORBIT_ITEMS.map((item, i) => (
        <OrbitSatellite key={item.label} {...item} initialAngle={initialAngles[i]} />
      ))}

      {/* Orbit guide rings at varied tilts */}
      <OrbitRing radius={1.7} tilt={0.2} />
      <OrbitRing radius={2.2} tilt={-0.3} />
      <OrbitRing radius={2.6} tilt={0.5} />
      <OrbitRing radius={2.8} tilt={-0.1} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  )
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function TechOrb() {
  return (
    <div className="w-full aspect-square" style={{ cursor: "grab" }}>
      <Canvas
        camera={{ position: [0, 1, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <OrbScene />
      </Canvas>
    </div>
  )
}

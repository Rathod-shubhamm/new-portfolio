"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

type ShapeType = "icosahedron" | "octahedron" | "tetrahedron"

/* ─── Holographic crystal shape ──────────────────────────────────────────── */
function CrystalShape({
  position, shape, speed, scale, color,
}: {
  position: [number, number, number]
  shape: ShapeType
  speed: number
  scale: number
  color: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!meshRef.current) return
    meshRef.current.rotation.x = t * speed * 0.3 + offset
    meshRef.current.rotation.y = t * speed * 0.5 + offset
    meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.5
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.4 + offset) * 0.25
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {shape === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {shape === "octahedron"  && <octahedronGeometry  args={[1]} />}
      {shape === "tetrahedron" && <tetrahedronGeometry args={[1]} />}
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        metalness={0.1}
        transmission={0.95}    // Strong glass refraction
        thickness={3.0}        // Deep volume
        ior={2.4}              // Diamond Index of Refraction
        clearcoat={1}          // Extra shiny outer layer
        clearcoatRoughness={0.1}
        flatShading={true}     // CRITICAL: Gives the faceted, cut-diamond look
        envMapIntensity={2.5}  // Stronger environment reflections
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ─── Wireframe grid shape ───────────────────────────────────────────────── */
function WireShape({
  position, shape, speed, scale, color,
}: {
  position: [number, number, number]
  shape: ShapeType
  speed: number
  scale: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!meshRef.current) return
    meshRef.current.rotation.x = t * speed * 0.4 + offset
    meshRef.current.rotation.y = t * speed * 0.6 + offset
    meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.6
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.5 + offset) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {shape === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {shape === "octahedron"  && <octahedronGeometry  args={[1]} />}
      {shape === "tetrahedron" && <tetrahedronGeometry args={[1]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
  )
}

/* ─── Scene ──────────────────────────────────────────────────────────────── */
function Scene({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  // Large holographic crystal shapes pushed further to the edges, avoiding the center
  const crystalShapes = useMemo<Array<{
    id: number; position: [number, number, number]
    shape: ShapeType; speed: number; scale: number; color: number
  }>>(() => [
    { id: 0, position: [-12, -6, -2], shape: "tetrahedron",  speed: 0.12, scale: 2.0, color: 0xa78bfa },
    { id: 1, position: [ 11, -5, -2], shape: "octahedron",   speed: 0.15, scale: 1.6, color: 0x818cf8 },
    { id: 2, position: [-10,  6, -4], shape: "icosahedron",  speed: 0.10, scale: 1.2, color: 0x93c5fd },
    { id: 3, position: [ 10,  7, -3], shape: "tetrahedron",  speed: 0.18, scale: 0.9, color: 0xc4b5fd },
    { id: 4, position: [  5, -8, -2], shape: "octahedron",   speed: 0.14, scale: 0.8, color: 0x7dd3fc },
    { id: 5, position: [ -6, -8, -3], shape: "tetrahedron",  speed: 0.20, scale: 0.7, color: 0xa5b4fc },
  ], [])

  // Smaller wireframe shapes scattered everywhere EXCEPT the center
  const wireShapes = useMemo(() => {
    const types: ShapeType[] = ["icosahedron", "octahedron", "tetrahedron"]
    const colors = ["#a5b4fc", "#818cf8", "#93c5fd", "#c4b5fd", "#67e8f9"]
    return Array.from({ length: 12 }, (_, i) => {
      let x = (Math.random() - 0.5) * 35;
      let y = (Math.random() - 0.5) * 22;
      
      // If the generated position falls in the center text zone, push it completely out
      if (Math.abs(x) < 9 && Math.abs(y) < 7) {
        if (Math.random() > 0.5) {
          x = (Math.abs(x) + 9) * Math.sign(x || 1);
        } else {
          y = (Math.abs(y) + 7) * Math.sign(y || 1);
        }
      }

      return {
        id: i,
        position: [x, y, (Math.random() - 0.5) * 8 - 3] as [number, number, number],
        shape: types[i % types.length],
        speed: 0.10 + Math.random() * 0.20,
        scale: 0.25 + Math.random() * 0.50,
        color: colors[i % colors.length],
      };
    })
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      const target = -scrollY * 0.003
      groupRef.current.position.y += (target - groupRef.current.position.y) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]}  intensity={4} color="#a5b4fc" />
      <pointLight position={[-10, -5, 5]} intensity={3} color="#67e8f9"  />
      <pointLight position={[0, 5, 12]}   intensity={2} color="#ffffff"  />
      <Environment preset="city" background={false} />
      {crystalShapes.map(s => <CrystalShape key={`c-${s.id}`} {...s} />)}
      {wireShapes.map(s    => <WireShape    key={`w-${s.id}`} {...s} />)}
    </group>
  )
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function ThreeBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 62 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  )
}

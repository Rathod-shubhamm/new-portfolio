"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ─── Individual floating geometry ───────────────────────────────────────── */
type ShapeType = "icosahedron" | "octahedron" | "tetrahedron"

function FloatingShape({
  position,
  shape,
  speed,
  scale,
  color,
}: {
  position: [number, number, number]
  shape: ShapeType
  speed: number
  scale: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const offset  = useMemo(() => Math.random() * Math.PI * 2, [])

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
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  )
}

/* ─── Scene ──────────────────────────────────────────────────────────────── */
function AmbientScene({ scrollY }: { scrollY: number }) {
  const cameraGroupRef = useRef<THREE.Group>(null!)

  const shapes = useMemo(() => {
    const types: ShapeType[] = ["icosahedron", "octahedron", "tetrahedron"]
    const colors = ["#6366f1", "#22d3ee", "#8b5cf6", "#06b6d4"]
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12 - 2,
      ] as [number, number, number],
      shape: types[i % types.length],
      speed: 0.15 + Math.random() * 0.25,
      scale: 0.2 + Math.random() * 0.45,
      color: colors[i % colors.length],
    }))
  }, [])

  useFrame(() => {
    if (cameraGroupRef.current) {
      // Parallax drift based on scroll
      const target = -scrollY * 0.003
      cameraGroupRef.current.position.y += (target - cameraGroupRef.current.position.y) * 0.05
    }
  })

  return (
    <group ref={cameraGroupRef}>
      {shapes.map((s) => (
        <FloatingShape key={s.id} {...s} />
      ))}
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
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 62 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1]}
      >
        <AmbientScene scrollY={scrollY} />
      </Canvas>
    </div>
  )
}

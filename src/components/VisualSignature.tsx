"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Particles({ count = 5000 }) {
  const points = useRef<THREE.Points>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = Math.random() * 0.01
    }
    
    return { positions, speeds }
  }, [count])

  useFrame((state) => {
    const { positions, speeds } = particles
    for (let i = 0; i < count; i++) {
      // Gentle float up
      positions[i * 3 + 1] += speeds[i]
      if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5
      
      // React to mouse
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const _z = positions[i * 3 + 2]
      
      const mouseX = state.mouse.x * 5
      const mouseY = state.mouse.y * 5
      
      const dx = mouseX - x
      const dy = mouseY - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 1.5) {
        positions[i * 3] -= dx * 0.01
        positions[i * 3 + 1] -= dy * 0.01
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y += 0.001
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
          // @ts-ignore
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function VisualSignature() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Particles />
      </Canvas>
    </div>
  )
}

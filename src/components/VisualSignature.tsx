"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function NeuralNetwork({ count = 80, connectionDistance = 2.5 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    const { positions, velocities } = particles
    const linePositions = []
    
    for (let i = 0; i < count; i++) {
      // Update positions
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Bounce off boundaries
      if (Math.abs(positions[i * 3]) > 5) velocities[i * 3] *= -1
      if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1
      if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1

      // Mouse interaction
      const mouseX = state.mouse.x * 5
      const mouseY = state.mouse.y * 5
      const dx = mouseX - positions[i * 3]
      const dy = mouseY - positions[i * 3 + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 2) {
        positions[i * 3] -= dx * 0.005
        positions[i * 3 + 1] -= dy * 0.005
      }

      // Find connections
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        
        if (distSq < connectionDistance * connectionDistance) {
          linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
          linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#6366f1"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#6366f1" transparent opacity={0.15} linewidth={1} />
      </lineSegments>
    </>
  )
}

export default function VisualSignature() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <NeuralNetwork />
      </Canvas>
    </div>
  )
}

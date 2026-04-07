"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function NeuralNetwork({ count = 120, connectionDistance = 2.8 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.015
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015
    }
    
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return
    
    const { positions, velocities } = particles
    const linePositions = []
    
    for (let i = 0; i < count; i++) {
      // Update positions
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Bounce off boundaries
      if (Math.abs(positions[i * 3]) > 6) velocities[i * 3] *= -1
      if (Math.abs(positions[i * 3 + 1]) > 6) velocities[i * 3 + 1] *= -1
      if (Math.abs(positions[i * 3 + 2]) > 6) velocities[i * 3 + 2] *= -1

      // Mouse interaction
      const mouseX = state.mouse.x * 6
      const mouseY = state.mouse.y * 6
      const dx = mouseX - positions[i * 3]
      const dy = mouseY - positions[i * 3 + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 2.5) {
        positions[i * 3] -= dx * 0.008
        positions[i * 3 + 1] -= dy * 0.008
      }

      // Find connections
      for (let j = i + 1; j < count; j++) {
        const dx_line = positions[i * 3] - positions[j * 3]
        const dy_line = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz_line = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distSq = dx_line * dx_line + dy_line * dy_line + dz_line * dz_line
        
        if (distSq < connectionDistance * connectionDistance) {
          linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
          linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Explicitly update line segments attribute
    linesRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
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
            // @ts-ignore
            args={[particles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#6366f1"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#6366f1" transparent opacity={0.4} linewidth={1} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  )
}

export default function VisualSignature() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <NeuralNetwork />
      </Canvas>
    </div>
  )
}

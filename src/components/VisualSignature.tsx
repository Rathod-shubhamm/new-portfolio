"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/* ─── Gradient-colored Neural Particles ─────────────────────────────────── */
function NeuralNetwork({ count = 150, connectionDistance = 2.6 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8

      velocities[i * 3]     = (Math.random() - 0.5) * 0.012
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006

      // Gradient: indigo (#6366f1) → cyan (#22d3ee)
      const t = Math.random()
      colors[i * 3]     = 0.38 + t * (0.13 - 0.38)   // R
      colors[i * 3 + 1] = 0.40 + t * (0.83 - 0.40)   // G
      colors[i * 3 + 2] = 0.95 + t * (0.93 - 0.95)   // B
    }

    return { positions, velocities, colors }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return

    const { positions, velocities } = particles
    const linePositions: number[] = []
    const mouseX = state.mouse.x * 7
    const mouseY = state.mouse.y * 7

    for (let i = 0; i < count; i++) {
      positions[i * 3]     += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      if (Math.abs(positions[i * 3])     > 7) velocities[i * 3]     *= -1
      if (Math.abs(positions[i * 3 + 1]) > 7) velocities[i * 3 + 1] *= -1
      if (Math.abs(positions[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1

      // Mouse repulsion
      const dx   = mouseX - positions[i * 3]
      const dy   = mouseY - positions[i * 3 + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 3) {
        positions[i * 3]     -= dx * 0.006
        positions[i * 3 + 1] -= dy * 0.006
      }

      for (let j = i + 1; j < count; j++) {
        const dx2    = positions[i * 3]     - positions[j * 3]
        const dy2    = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz2    = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distSq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2

        if (distSq < connectionDistance * connectionDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          )
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.setAttribute(
      "position",
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
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
            // @ts-ignore
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

/* ─── Floating Wireframe Torus Knot ─────────────────────────────────────── */
function TorusKnot() {
  const meshRef   = useRef<THREE.Mesh>(null!)
  const glowRef   = useRef<THREE.Mesh>(null!)
  const groupRef  = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Gentle mouse tilt
    const targetX = state.mouse.y * 0.25
    const targetY = state.mouse.x * 0.25
    if (groupRef.current) {
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04
    }

    // Constant slow rotation + float
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.18
      meshRef.current.rotation.z = t * 0.12
    }
    if (glowRef.current) {
      glowRef.current.rotation.x = t * 0.18
      glowRef.current.rotation.z = t * 0.12
      // Subtle pulse
      const scale = 1.08 + Math.sin(t * 1.4) * 0.04
      glowRef.current.scale.setScalar(scale)
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.35
    }
  })

  return (
    <group ref={groupRef} position={[3.5, 0.5, -2]}>
      {/* Inner wire mesh */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.35, 180, 20, 2, 3]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <torusKnotGeometry args={[1.1, 0.40, 100, 16, 2, 3]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function VisualSignature() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 58 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <NeuralNetwork />
        <TorusKnot />
      </Canvas>
    </div>
  )
}

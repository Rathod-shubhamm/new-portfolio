"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Database, Cpu, Zap, Search, MessageSquare, Code } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const STEPS = [
  { icon: Database, label: "Ingestion",   description: "Multi-source data collection & cleaning",  color: "#6366f1" },
  { icon: Search,   label: "Processing",  description: "Semantic embedding & vector storage",       color: "#22d3ee" },
  { icon: Cpu,      label: "Reasoning",   description: "LLM Orchestration & RAG retrieval",         color: "#8b5cf6" },
  { icon: MessageSquare, label: "Action", description: "Autonomous decision making & output",        color: "#afff00" },
]

/* ─── 3D Particle Pipeline Stream ─────────────────────────────────────── */
const PARTICLE_COUNT = 80

function PipelineParticles() {
  const pointsRef = useRef<THREE.Points>(null!)

  /* Bezier control points spanning the four pipeline nodes */
  const curve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(-2, 1.5, 0),
        new THREE.Vector3(2, -1.5, 0),
        new THREE.Vector3(6, 0, 0)
      ),
    []
  )

  const data = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3)
    const progresses = new Float32Array(PARTICLE_COUNT)
    const speeds     = new Float32Array(PARTICLE_COUNT)
    const offsets    = new Float32Array(PARTICLE_COUNT * 2) // x/y random offset

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      progresses[i] = Math.random()
      speeds[i]     = 0.08 + Math.random() * 0.14
      offsets[i * 2]     = (Math.random() - 0.5) * 0.4
      offsets[i * 2 + 1] = (Math.random() - 0.5) * 0.4
    }
    return { positions, progresses, speeds, offsets }
  }, [])

  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3)
    const palette = [
      new THREE.Color("#6366f1"),
      new THREE.Color("#22d3ee"),
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#06b6d4"),
    ]
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = palette[i % palette.length]
      c[i * 3]     = col.r
      c[i * 3 + 1] = col.g
      c[i * 3 + 2] = col.b
    }
    return c
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const { positions, progresses, speeds, offsets } = data

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      progresses[i] = (progresses[i] + speeds[i] * delta) % 1
      const pt = curve.getPoint(progresses[i])
      positions[i * 3]     = pt.x + offsets[i * 2]
      positions[i * 3 + 1] = pt.y + offsets[i * 2 + 1]
      positions[i * 3 + 2] = pt.z
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={data.positions}
          itemSize={3}
          // @ts-ignore
          args={[data.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
          // @ts-ignore
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function PipelineCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1]}
      >
        <PipelineParticles />
      </Canvas>
    </div>
  )
}

/* ─── Main Section ──────────────────────────────────────────────────────── */
export default function ProcessFlow() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
            Engineering Lifecycle
          </span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            How I <span className="text-white/40">Architect</span> Intelligence
          </h2>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* 3D Pipeline Canvas — sits behind step cards */}
          <div className="absolute inset-x-0 top-0 h-48 md:block hidden" style={{ zIndex: 0 }}>
            <PipelineCanvas />
          </div>

          {/* Connecting line fallback */}
          <div className="absolute top-[40px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group relative"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    style={{ boxShadow: `0 0 0 0 ${step.color}` }}
                    whileInView={{ boxShadow: [`0 0 0 0 ${step.color}22`, `0 0 20px 2px ${step.color}22`, `0 0 0 0 ${step.color}22`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-20 h-20 rounded-3xl glass border-white/5 flex items-center justify-center relative group-hover:border-accent/40 transition-all duration-500 shadow-2xl"
                  >
                    <step.icon className="w-8 h-8 text-white group-hover:text-accent transition-colors duration-500" />
                    {i < STEPS.length - 1 && (
                      <motion.div
                        animate={{ x: [0, 20, 0], opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 hidden md:block"
                      >
                        <Zap className="w-4 h-4 text-accent/50" />
                      </motion.div>
                    )}
                  </motion.div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
                      0{i + 1}
                    </div>
                    <h3 className="text-xl font-bold font-display uppercase tracking-widest text-white group-hover:text-accent transition-colors">
                      {step.label}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-relaxed px-4">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical detail bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24 glass border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-white">Full-Stack Autonomy</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                  Optimizing the recursive feedback loop for agentic workflows.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-2 glass border-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:border-accent/30 transition-all">
                Latency: {"<"} 50ms
              </div>
              <div className="px-5 py-2 glass border-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:border-accent/30 transition-all">
                Recall: 99.2%
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

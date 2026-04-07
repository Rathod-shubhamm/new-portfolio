"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { skillClusters } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function TechStack() {
  return (
    <section id="skills" className="py-32 bg-[#050508] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
            Technical Toolkit
          </span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            Specialized <span className="text-white/40">Competencies</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-6 text-lg leading-relaxed">
            A comprehensive stack built for high-performance AI systems and
            modern full-stack engineering.
          </p>
        </motion.div>

        {/* Bento grid — 4-column with intentional spans */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 max-w-7xl mx-auto">
          {skillClusters.map((cluster, index) => (
            <SkillCard key={cluster.title} cluster={cluster} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Confidence scores per cluster
const CONFIDENCE_DATA: Record<string, { score: string; pct: string; desc: string }> = {
  "AI & Machine Learning": {
    score: "0.982",
    pct: "98%",
    desc: "Transformer architectures, RAG optimization, autonomous agent orchestration.",
  },
  "Backend & Systems": {
    score: "0.941",
    pct: "94%",
    desc: "High-performance API design, async task queues, and containerized deployments.",
  },
  "Frontend Engineering": {
    score: "0.876",
    pct: "88%",
    desc: "Component-driven UIs with smooth animations and responsive design systems.",
  },
  "Infrastructure & Cloud": {
    score: "0.831",
    pct: "83%",
    desc: "Serverless pipelines, CI/CD automation, and scalable cloud architecture.",
  },
};

function SkillCard({ cluster, index }: { cluster: any; index: number }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const conf = CONFIDENCE_DATA[cluster.title] ?? { score: "0.900", pct: "90%", desc: "" };

  // Bento spans — large hero card top-left, others fill it out
  const spanClass = [
    "md:col-span-2 md:row-span-2", // AI — hero card
    "md:col-span-2 md:row-span-1", // Backend — wide top-right
    "md:col-span-1 md:row-span-1", // Frontend — bottom-left
    "md:col-span-1 md:row-span-1", // Cloud — bottom-right
  ][index % 4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: "0 0 40px rgba(99,102,241,0.2)" }}
      className={cn(
        "bento-card group flex flex-col justify-between min-h-[260px] transition-all relative overflow-hidden",
        spanClass
      )}
    >
      {/* Neural node decoration — first card only */}
      {index === 0 && isMounted && (
        <div className="absolute top-0 right-0 w-36 h-36 opacity-15 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
            <motion.circle
              cx="50" cy="50" r="10" fill="currentColor"
              animate={{ r: [10, 16, 10] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.line
                key={angle}
                x1="50" y1="50"
                x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                stroke="currentColor" strokeWidth="0.8"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: angle / 360, ease: "easeInOut" }}
              />
            ))}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.circle
                key={`dot-${angle}`}
                cx={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                cy={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                r={2} fill="currentColor"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: angle / 360, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Header row */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner shadow-white/5">
          {cluster.icon}
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">
          0{index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-6 space-y-4 flex-1 flex flex-col justify-end">
        <h3 className="text-xl md:text-2xl font-bold font-display uppercase tracking-wider text-white group-hover:text-accent transition-colors duration-300">
          {cluster.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {cluster.skills.map((skill: string) => (
            <span
              key={skill}
              className="text-[9px] px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-slate-400 uppercase tracking-[0.1em] font-medium group-hover:border-white/15 transition-all"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Debug Specs on hover */}
        <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-700 overflow-hidden pt-2">
          <div className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase tracking-widest font-bold text-slate-500">
                Confidence Score
              </span>
              <span className="text-[10px] font-mono font-bold text-accent">{conf.score}</span>
            </div>
            <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: conf.pct }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-accent to-cyan-400"
              />
            </div>
            <p className="text-[8px] text-slate-600 uppercase tracking-[0.15em] leading-relaxed">
              {conf.desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

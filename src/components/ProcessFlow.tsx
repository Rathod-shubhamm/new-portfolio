"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ARCHITECTURE_NODES = [
  {
    id: "01",
    label: "Ingestion",
    description: "Signals enter through resilient data infrastructure and clean intake layers.",
    accent: "from-cyan-400/30 via-cyan-400/10 to-transparent",
  },
  {
    id: "02",
    label: "Processing",
    description: "Structured memory, embeddings, and transformation logic make context usable.",
    accent: "from-violet-400/30 via-violet-400/10 to-transparent",
  },
  {
    id: "03",
    label: "Reasoning",
    description: "Models retrieve, synthesize, and evaluate state before committing decisions.",
    accent: "from-sky-400/30 via-sky-400/10 to-transparent",
  },
  {
    id: "04",
    label: "Action",
    description: "Interfaces, tools, and automations convert intelligence into execution.",
    accent: "from-fuchsia-400/30 via-fuchsia-400/10 to-transparent",
  },
] as const;

const PROCESS_FLOW_IMAGE = "/assets/images/process-architecture-lifecycle-v2.png";

export default function ProcessFlow() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/6 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-500/8 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
            Engineering Lifecycle
          </span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            How I <span className="text-white/40">Architect</span> Intelligence
          </h2>
          <p className="max-w-3xl mx-auto mt-6 text-base md:text-lg text-slate-400 leading-relaxed">
            A systems view of how raw signals become durable memory, model reasoning,
            and autonomous execution.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#071127]/80 shadow-[0_0_90px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.14),transparent_35%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-[2.75rem] border border-white/5 pointer-events-none" />

            <div className="relative aspect-[21/10] sm:aspect-[21/9] lg:aspect-[21/8]">
              <Image
                src={PROCESS_FLOW_IMAGE}
                alt="Isometric AI lifecycle illustration showing ingestion, processing, reasoning, and action connected by glowing data lines."
                fill
                quality={95}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06091a]/10 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {ARCHITECTURE_NODES.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.1, duration: 0.6 }}
                className="glass relative overflow-hidden rounded-[1.75rem] border-white/8 px-6 py-5"
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${node.accent}`} />
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
                  {node.id}
                </div>
                <h3 className="mt-3 text-lg font-display font-bold uppercase tracking-[0.18em] text-white">
                  {node.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {node.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/data";

// Dynamically import TechOrb (SSR off — Three.js needs browser)
const TechOrb = dynamic(() => import("./TechOrb"), { ssr: false });

/* ─── Animated CountUp hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, trigger: () => setStarted(true) };
}

function CounterStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { count, trigger } = useCountUp(value);

  useEffect(() => {
    if (isInView) trigger();
  }, [isInView]);

  return (
    <div ref={ref} className="space-y-1">
      <span className="block text-4xl md:text-5xl font-display font-extrabold text-white tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

/* ─── Identity badges below the orb ─────────────────────────────────────── */
const IDENTITY_BADGES = [
  { label: "Python",  color: "from-indigo-500/20 to-indigo-500/5",  border: "border-indigo-500/30" },
  { label: "LLMs",    color: "from-cyan-500/20   to-cyan-500/5",    border: "border-cyan-500/30"   },
  { label: "RAG",     color: "from-violet-500/20 to-violet-500/5",  border: "border-violet-500/30" },
  { label: "FastAPI", color: "from-teal-500/20   to-teal-500/5",    border: "border-teal-500/30"   },
  { label: "Next.js", color: "from-blue-500/20   to-blue-500/5",    border: "border-blue-500/30"   },
  { label: "Docker",  color: "from-purple-500/20 to-purple-500/5",  border: "border-purple-500/30" },
];

/* ─── Main Section ───────────────────────────────────────────────────────── */
export default function About() {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* ── Left: Bio ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
                Strategic Context
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight text-white">
                Engineering{" "}
                <span className="text-white/40">the Future of</span>{" "}
                AI Interaction
              </h2>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              I am a Computer Science graduate specializing in{" "}
              <span className="text-white font-medium">AI Engineering</span>. My
              work represents the bridge between static data and autonomous
              intelligence — building systems that don&apos;t just process
              information, but understand it.
            </p>

            <p className="text-slate-500 leading-relaxed max-w-xl italic border-l-2 border-accent/30 pl-6">
              &ldquo;The next generation of software won&apos;t just follow instructions — it
              will reason through problems and take intelligent actions to solve
              real-world challenges.&rdquo;
            </p>

            {/* Animated CountUp Stats */}
            <div className="grid grid-cols-3 pt-4 divide-x divide-white/5">
              <div className="pr-6 space-y-1">
                <CounterStat value={5} suffix="+" label="Major Projects" />
              </div>
              <div className="px-6 space-y-1">
                <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">2024</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Graduation</span>
              </div>
              <div className="pl-6 space-y-1">
                <CounterStat value={100} suffix="%" label="Commitment" />
              </div>
            </div>
          </motion.div>

          {/* ── Right: 3D TechOrb ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Label */}
            <div className="self-start flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
                Tech Orbit
              </span>
              <div className="h-px w-12 bg-accent/30" />
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-mono">
                drag to rotate
              </span>
            </div>

            {/* Orb canvas */}
            <div className="relative w-full rounded-[40px] overflow-hidden glass border-white/8 shadow-[0_0_80px_rgba(99,102,241,0.12)]">
              <TechOrb />
              {/* Subtle inner glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]/60 pointer-events-none rounded-[40px]" />
            </div>

            {/* Identity badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {IDENTITY_BADGES.map((badge, i) => (
                <motion.span
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.5 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r ${badge.color} border ${badge.border} text-slate-300 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.2)]`}
                >
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Availability badge */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
                Open to opportunities
              </span>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

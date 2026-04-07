"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/data";

// Animated CountUp hook
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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

// Terminal-style identity card
function IdentityCard() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const lines = [
    { label: "name", value: "Shubham Rathod", color: "text-accent" },
    { label: "role", value: "AI Engineer", color: "text-emerald-400" },
    { label: "focus", value: "LLMs · RAG · Agents", color: "text-yellow-400" },
    { label: "status", value: "AVAILABLE", color: "text-green-400" },
    { label: "location", value: "India (IST UTC+5:30)", color: "text-slate-300" },
    { label: "stack", value: "Python · Next.js · FastAPI", color: "text-blue-400" },
  ];

  return (
    <div className="aspect-square rounded-[40px] glass border-white/10 overflow-hidden p-1">
      <div className="w-full h-full rounded-[38px] bg-gradient-to-br from-white/5 to-transparent flex flex-col p-8 space-y-0 relative overflow-hidden group">
        {/* Terminal top bar */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            ~/identity.json
          </span>
        </div>

        {/* JSON body */}
        <div className="font-mono text-[11px] leading-7 space-y-0 flex-1 overflow-hidden">
          <p className="text-slate-500">{"{"}</p>
          {isMounted && lines.map((line, i) => (
            <motion.p
              key={line.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="pl-4"
            >
              <span className="text-slate-500">&quot;{line.label}&quot;</span>
              <span className="text-slate-600">: </span>
              <span className={line.color}>&quot;{line.value}&quot;</span>
              {i < lines.length - 1 && <span className="text-slate-600">,</span>}
            </motion.p>
          ))}
          <p className="text-slate-500">{"}"}</p>
        </div>

        {/* Pulsing availability badge */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
            Open to opportunities
          </span>
        </div>

        {/* Background glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors duration-700" />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Left: Bio */}
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
                {/* Year displayed statically — no count-up needed */}
                <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">2024</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Graduation</span>
              </div>
              <div className="pl-6 space-y-1">
                <CounterStat value={100} suffix="%" label="Commitment" />
              </div>
            </div>
          </motion.div>

          {/* Right: Terminal Identity Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <IdentityCard />

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

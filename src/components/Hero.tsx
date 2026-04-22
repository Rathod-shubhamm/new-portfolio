"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Network, Database, GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/data";
import VisualSignature from "./VisualSignature";
import NeuralLog from "./NeuralLog";

const ROLES = [
  "AI Engineer",
  "LLM Systems Builder",
  "ML Infrastructure",
  "RAG Pipeline Architect",
  "Autonomous Agent Dev",
];

const STATS = [
  { value: "5+", label: "Projects", Icon: Network },
  { value: "3+", label: "LLM Stacks", Icon: Database },
  { value: "2026", label: "Graduate", Icon: GraduationCap },
];

const letterVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = ROLES[roleIndex];
    if (!deleting) {
      if (charIndex < current.length) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (charIndex > 0) {
        const t = setTimeout(() => { setDisplayed(current.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }, 30);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setRoleIndex(r => (r + 1) % ROLES.length);
      }
    }
  }, [charIndex, deleting, roleIndex]);

  return (
    <span className="font-mono text-sm md:text-base tracking-widest uppercase" style={{ color: "#a78bfa" }}>
      {displayed}
      <span className="animate-pulse ml-0.5 inline-block w-0.5 h-4 align-middle" style={{ backgroundColor: "#a78bfa" }} />
    </span>
  );
}

export default function Hero() {
  // Pre-calculate global char indices for staggered animation
  const words = siteConfig.name.split(" "); // ["Shubham", "Rathod"]
  let charCounter = 0;
  const wordData = words.map(word => {
    const start = charCounter;
    charCounter += word.length;
    return { word, start };
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <VisualSignature />
      <NeuralLog />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 70%)" }} />

      <div className="container relative z-10 mx-auto px-6 text-center pt-16">

        {/* Main Name — two-line, two-style */}
        <h1 className="font-bold font-display tracking-tight leading-[0.88] mb-6 mt-10 md:mt-0"
          style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}>

          {/* Line 1 — "Shubham" in pure white with 3D/bevel effect */}
          <div className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
            <span
              className="inline-block text-white"
              style={{
                textShadow: "0px 4px 15px rgba(0,0,0,0.5), inset 0px -2px 4px rgba(0,0,0,0.3)"
              }}
            >
              {wordData[0].word.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={wordData[0].start + i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </div>

          {/* Line 2 — "Rathod" in gradient purple with inner/outer glow */}
          <div className="block overflow-hidden" style={{ marginTop: '-0.15em', paddingBottom: '0.1em' }}>
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(180deg, #d8b4fe 0%, #a855f7 50%, #7e22ce 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.6))",
              }}
            >
              {wordData[1]?.word.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={wordData[1].start + i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </div>
        </h1>

        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-7 rounded-full backdrop-blur-md"
          style={{ border: "1px solid rgba(139,92,246,0.35)", background: "rgba(139,92,246,0.10)" }}
        >
          <span className="font-mono text-sm text-slate-400">~/</span>
          <TypewriterRole />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed mb-8"
        >
          Bridging the gap between{" "}
          <span className="text-white font-semibold">Complex Data</span> and{" "}
          <span className="text-white font-semibold">Intelligent Action</span>.
        </motion.p>

        {/* Stats pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="relative inline-flex items-center rounded-3xl mb-9 backdrop-blur-md overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(10,12,24,0.4)", padding: "12px 16px" }}
        >
          {/* Glowing orbs behind stats */}
          <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-16 h-16 bg-indigo-500/40 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-500/30 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-16 h-16 bg-cyan-500/30 blur-2xl rounded-full pointer-events-none" />

          {STATS.map(({ value, label, Icon }, i) => (
            <div key={label} className="relative z-10 flex items-center">
              <div className="flex items-center gap-4 px-6 py-2">
                <Icon className="w-6 h-6 flex-shrink-0 text-white opacity-90" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white leading-none">{value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">{label}</div>
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.15)" }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#projects" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-3 transition-all"
            style={{ boxShadow: "0 0 30px rgba(255,255,255,0.20)" }}
          >
            View My Work <ArrowRight className="w-4 h-4" />
          </motion.a>
          <motion.a
            href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-white transition-all backdrop-blur-md"
            style={{ border: "1px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.05)" }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-slate-500">Explore</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

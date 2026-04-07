"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/data";
import VisualSignature from "./VisualSignature";
import NeuralLog from "./NeuralLog";

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1,
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero() {
  const name = siteConfig.name;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden scanline">
      <VisualSignature />
      <NeuralLog />

      {/* Hero Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] } as any}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-medium text-slate-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          AVAILABLE FOR PARTNERSHIPS
        </motion.div>

        <h1 className="text-6xl md:text-[10rem] font-bold font-display tracking-tight leading-[0.9] mb-8 text-white glitch-hover">
          {name.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-4 last:mr-0">
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  custom={wordIndex * 10 + charIndex}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className={charIndex % 2 === 1 && wordIndex === 1 ? "text-accent" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <h2 className="text-xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            {siteConfig.role} bridging the gap between <span className="text-white font-medium">Complex Data</span> and <span className="text-white font-medium">Intelligent Action</span>.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-slate-200"
            >
              View My Work <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 glass border-white/10 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:border-accent/40"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-slate-500">Explore Experience</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

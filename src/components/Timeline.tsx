"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { experience } from "@/lib/data";
import { ChevronDown } from "lucide-react";

const PREVIEW_COUNT = 3; // achievements shown by default

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-32 bg-[#08080a] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
            Career Trajectory
          </span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            Professional <span className="text-white/40">Continuum</span>
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent to-transparent z-0"
          />

          <div className="space-y-24">
            {experience.map((exp, index) => (
              <TimelineEntry key={exp.company} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ exp, index }: { exp: any; index: number }) {
  const isEven = index % 2 === 0;
  const [expanded, setExpanded] = useState(false);

  const hasMore = exp.achievements.length > PREVIEW_COUNT;
  const visibleAchievements = expanded
    ? exp.achievements
    : exp.achievements.slice(0, PREVIEW_COUNT);

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-start justify-between gap-8 md:gap-0 ${
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Date/Period — desktop */}
      <div className={`hidden md:block w-[45%] pt-2 ${isEven ? "text-left pl-12" : "text-right pr-12"}`}>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-slate-500">
          {exp.period}
        </span>
      </div>

      {/* Circle center */}
      <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 z-10 mt-1">
        <div className="w-6 h-6 rounded-full border-2 border-accent bg-[#08080a] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Content card */}
      <div
        className={`w-[85%] md:w-[45%] flex flex-col ${
          isEven ? "md:items-end md:text-right pr-4" : "md:items-start md:text-left pl-4"
        }`}
      >
        <div className="glass p-8 rounded-3xl border-white/5 hover:border-white/20 transition-all duration-500 w-full group">

          {/* Header */}
          <div className="space-y-1 mb-4">
            <span className="md:hidden text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-slate-500 mb-2 block">
              {exp.period}
            </span>
            <h3 className="text-2xl font-bold font-display uppercase tracking-widest text-white group-hover:text-accent transition-colors">
              {exp.company}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {exp.role}
            </p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {exp.description}
          </p>

          {/* Achievements list */}
          <ul className={`space-y-3 ${isEven ? "md:items-end" : "md:items-start"}`}>
            <AnimatePresence initial={false}>
              {visibleAchievements.map((achievement: string, i: number) => (
                <motion.li
                  key={achievement}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-[11px] uppercase tracking-widest text-slate-500 leading-normal text-left">
                    {achievement}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Expand / Collapse toggle */}
          {hasMore && (
            <motion.button
              onClick={() => setExpanded((v) => !v)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-accent hover:text-white transition-colors border border-accent/20 hover:border-accent/50 rounded-full px-4 py-2 backdrop-blur-sm"
            >
              {expanded ? "Show less" : `+${exp.achievements.length - PREVIEW_COUNT} more`}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-3 h-3" />
              </motion.span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

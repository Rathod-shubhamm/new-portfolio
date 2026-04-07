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
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">Technical Toolkit</span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            Specialized <span className="text-white/40">Competencies</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-6 text-lg leading-relaxed">
            A comprehensive stack built for high-performance AI systems and modern full-stack engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {skillClusters.map((cluster, index) => (
            <SkillCard key={cluster.title} cluster={cluster} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ cluster, index }: { cluster: any; index: number }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Bento grid-like spans
  const spans = [
    "md:col-span-2 md:row-span-2", // AI
    "md:col-span-2 md:row-span-1", // Backend
    "md:col-span-1 md:row-span-1", // Frontend
    "md:col-span-1 md:row-span-1", // Cloud
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: "0 0 40px rgba(99,102,241,0.2)" }}
      className={cn(
        "bento-card group flex flex-col justify-between h-full min-h-[260px] transition-all relative overflow-hidden",
        spans[index % spans.length]
      )}
    >
      {/* Background Neural Animation for first card - Client Only to prevent hydration mismatch */}
      {index === 0 && isMounted && (
         <div className="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
               <motion.circle 
                  cx="50" cy="50" r="10" fill="currentColor"
                  animate={{ r: [10, 15, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
               />
               {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <motion.line 
                     key={angle}
                     x1="50" y1="50" 
                     x2={50 + 40 * Math.cos(angle * Math.PI / 180)}
                     y2={50 + 40 * Math.sin(angle * Math.PI / 180)}
                     stroke="currentColor" strokeWidth="0.5"
                     animate={{ opacity: [0.2, 1, 0.2] }}
                     transition={{ duration: 3, repeat: Infinity, delay: angle / 360 }}
                  />
               ))}
            </svg>
         </div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner shadow-white/5">
          {cluster.icon}
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">0{index + 1}</span>
      </div>

      <div className="relative z-10 mt-8 space-y-4">
        <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-white group-hover:text-accent transition-colors">
          {cluster.title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {cluster.skills.map((skill: string) => (
            <span 
              key={skill} 
              className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-[0.1em] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
        
        {/* Debug Specs revealed on hover */}
        <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-700 overflow-hidden pt-4">
           <div className="space-y-3">
              <div className="flex justify-between items-center text-[8px] uppercase tracking-widest font-bold">
                 <span className="text-slate-500">Confidence Score</span>
                 <span className="text-accent">0.982</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "98%" }}
                    className="h-full bg-accent"
                 />
              </div>
              <p className="text-[8px] text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
                 {index === 0 
                  ? "Expertise in Transformer-based architectures, RAG optimization, and autonomous agent orchestration." 
                  : "High-performance infrastructure design with low-latency inference and scalable vector retrieval."}
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

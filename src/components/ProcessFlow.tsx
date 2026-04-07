"use client"

import { motion } from "framer-motion"
import { Database, Cpu,Zap, Search, MessageSquare, Code } from "lucide-react"

const STEPS = [
  { icon: Database, label: "Ingestion", description: "Multi-source data collection & cleaning", color: "#6366f1" },
  { icon: Search, label: "Processing", description: "Semantic embedding & vector storage", color: "#22d3ee" },
  { icon: Cpu, label: "Reasoning", description: "LLM Orchestration & RAG retrieval", color: "#8b5cf6" },
  { icon: MessageSquare, label: "Action", description: "Autonomous decision making & output", color: "#afff00" },
]

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
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">Engineering Lifecycle</span>
          <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
            How I <span className="text-white/40">Architect</span> Intelligence
          </h2>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 hidden md:block" />
          
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
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-3xl glass border-white/5 flex items-center justify-center relative group-hover:border-accent/40 transition-all duration-500 shadow-2xl"
                  >
                     <step.icon className="w-8 h-8 text-white group-hover:text-accent transition-colors duration-500" />
                     {i < STEPS.length - 1 && (
                        <motion.div 
                           animate={{ x: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                           transition={{ duration: 2, repeat: Infinity }}
                           className="absolute -right-6 top-1/2 -translate-y-1/2 hidden md:block"
                        >
                           <Zap className="w-4 h-4 text-accent/30" />
                        </motion.div>
                     )}
                  </motion.div>

                  <div className="space-y-2">
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
          
          {/* Technical detail overlay */}
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
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Optimizing the recursive feedback loop for agentic workflows.</p>
               </div>
             </div>
             <div className="flex gap-4">
                <div className="px-5 py-2 glass border-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:border-accent/30 transition-all">Latency: {"<"} 50ms</div>
                <div className="px-5 py-2 glass border-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:border-accent/30 transition-all">Recall: 99.2%</div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

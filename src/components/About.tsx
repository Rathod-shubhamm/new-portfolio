"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">Strategic Context</span>
              <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight text-white">
                Engineering <span className="text-white/40">the Future of</span> AI Interaction
              </h2>
            </div>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              I am a Computer Science graduate specializing in <span className="text-white font-medium">AI Context Engineering</span>. My work represents the bridge between static data and autonomous intelligence—building systems that don't just process information, but understand it.
            </p>
            
            <p className="text-slate-500 leading-relaxed max-w-xl italic border-l-2 border-accent/30 pl-6">
              "The next generation of software won't just follow instructions—it will reason through problems and take intelligent actions to solve real-world challenges."
            </p>

            <div className="grid grid-cols-3 gap-8 pt-4">
              <div className="space-y-1">
                <span className="block text-3xl font-display font-extrabold text-white">5+</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Major Projects</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-display font-extrabold text-white">2024</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Graduation</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-display font-extrabold text-white">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Commitment</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] glass border-white/10 overflow-hidden p-1 flex items-center justify-center">
               <div className="w-full h-full rounded-[38px] bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center p-12 text-center space-y-6 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <span className="relative text-8xl block mb-2 grayscale group-hover:grayscale-0 transition-all duration-500">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display uppercase tracking-widest text-white">Computer Science<br/><span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-8">Background</span></h3>
                  <p className="text-xs text-slate-500 max-w-xs uppercase tracking-[0.25em] leading-relaxed">Highly enthusiastic about AI/ML development and creative problem solving.</p>
               </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

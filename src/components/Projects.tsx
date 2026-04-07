"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { RiExternalLinkLine, RiGithubFill } from "react-icons/ri";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "AI & Automation", "Machine Learning", "AI / Finance", "Security", "AI & Education"];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section id="projects" className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">Selected Innovations</span>
            <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
              Impactful <span className="text-white/40">Portfolio</span>
            </h2>
            <p className="text-slate-400 max-w-xl mt-6 text-lg">
              A selection of my most significant work in AI engineering and autonomous systems.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border",
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-slate-500 border-white/10 hover:border-white/20 hover:text-white"
                )}
              >
                {cat === "All" ? "Every Logic" : cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  // Staggered heights for masonry effect
  const isLarge = index % 3 === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[3rem] glass border-white/5 cursor-pointer bg-white/[0.02]",
        isLarge ? "md:h-[600px]" : "md:h-[500px]"
      )}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Project Content */}
        <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">{project.category}</span>
            <h3 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tighter text-white">
              {project.title}
            </h3>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3">
             {project.metrics.map((metric: string) => (
                <div key={metric} className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                   <span className="text-[9px] uppercase tracking-widest font-bold text-white">{metric}</span>
                </div>
             ))}
          </div>

          <div className="flex items-center gap-6 pt-4">
            <a href={project.live} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent transition-colors">
              <RiExternalLinkLine className="w-4 h-4" /> Final Logic
            </a>
            <a href={project.github} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
              <RiGithubFill className="w-4 h-4" /> Source
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

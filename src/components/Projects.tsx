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
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">
              Selected Innovations
            </span>
            <h2 className="text-4xl md:text-7xl font-bold font-display mt-4 text-white">
              Impactful <span className="text-white/40">Portfolio</span>
            </h2>
            <p className="text-slate-400 max-w-xl mt-6 text-lg">
              A selection of my most significant work in AI engineering and
              autonomous systems.
            </p>
          </div>

          {/* Filter tabs with Framer Motion layout animation */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border overflow-hidden",
                  activeCategory === cat
                    ? "text-black border-white"
                    : "bg-transparent text-slate-500 border-white/10 hover:border-white/20 hover:text-white"
                )}
              >
                {activeCategory === cat && (
                  <motion.span
                    layoutId="filter-active"
                    className="absolute inset-0 bg-white -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat === "All" ? "Every Logic" : cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
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
  const isLarge = index % 3 === 0;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -12 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.5 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] cursor-pointer",
        isLarge ? "md:h-[650px]" : "md:h-[550px]"
      )}
    >
      {/* Spotlight Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
        }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] glass border-white/5 bg-slate-900/40 backdrop-blur-3xl">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        
        {/* Complex Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Project Content */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end space-y-6 z-20">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-accent drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {project.category}
              </span>
              <div className="h-px w-8 bg-white/20" />
            </div>
            
            <h3 className="text-4xl md:text-6xl font-bold font-display leading-[0.9] tracking-tighter text-white group-hover:text-gradient transition-all duration-500">
              {project.title}
            </h3>
          </div>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-700 ease-in-out">
            {project.description}
          </p>

          {/* Tech stack & metrics */}
          <div className="flex flex-wrap gap-3">
            {project.tags?.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-slate-300 backdrop-blur-xl group-hover:border-accent/30 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider and Technical Specs */}
          <div className="space-y-4 pt-2">
            <div className="h-px bg-white/10 w-full group-hover:bg-accent/20 transition-colors" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                  Core Architecture
                </span>
                <span className="text-xs text-white font-medium">
                  {project.architecture}
                </span>
              </div>
              <div className="hidden md:block space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                  Latency Peak
                </span>
                <span className="text-xs text-accent font-bold">
                  {project.latency}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                  Key Metric
                </span>
                <span className="text-xs text-white font-medium">
                  {project.metrics[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-8 pt-4">
            <a
              href={project.live}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-accent transition-all duration-300"
            >
              <span className="relative">
                Live Preview
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
              </span>
              <RiExternalLinkLine className="w-4 h-4" />
            </a>
            <a
              href={project.github}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all duration-300"
            >
              Source Code
              <RiGithubFill className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
           <div className="w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
        </div>
      </div>
    </motion.div>
  );
}

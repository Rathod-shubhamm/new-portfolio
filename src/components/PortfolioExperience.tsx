"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Layers3,
  Mail,
  Menu,
  MonitorSmartphone,
  ServerCog,
  X,
} from "lucide-react";
import { RiGithubFill, RiLinkedinBoxFill } from "react-icons/ri";
import { useMemo, useState } from "react";
import { experience, projects, siteConfig, skillClusters } from "@/lib/data";
import HeroParticles from "./HeroParticles";
import SandParticleText from "./SandParticleText";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Profile", href: "#profile" },
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Method", href: "#method" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

const capabilityIcons = [BrainCircuit, ServerCog, MonitorSmartphone, Cloud];
const projectCategories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];

export default function PortfolioExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects = useMemo(
    () => projects.filter((project) => activeCategory === "All" || project.category === activeCategory),
    [activeCategory]
  );

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <main className="site-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label={`${siteConfig.name} home`}>
            <span className="grid h-9 w-9 place-items-center rounded-sm border border-[var(--line)] bg-[var(--surface)] font-display text-sm font-extrabold">
              SR
            </span>
            <span className="hidden text-sm font-semibold tracking-wide text-[var(--foreground)] sm:block">
              {siteConfig.name}
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={`mailto:${siteConfig.email}`} className="hidden items-center h-10 gap-2 rounded-sm border border-[var(--line)] px-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--nav-hover)] md:flex">
              <Mail className="h-4 w-4" />
              Email
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--nav-hover)] md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-[var(--line)] bg-[var(--background)] px-5 py-4 md:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-sm px-2 py-3 text-sm font-semibold text-[var(--muted)]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <motion.section 
        id="top" 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="sticky top-0 z-0 flex h-screen flex-col items-center justify-center overflow-hidden pt-16"
      >
        <HeroParticles className="z-0" />
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex w-full max-w-6xl flex-col items-center"
          >
            <p className="eyebrow">Portfolio / AI systems / 2026</p>
            <h1 className="sr-only">Shubham Rathod</h1>
            <div className="relative mt-5 h-[260px] w-full max-w-6xl overflow-hidden sm:h-[330px] lg:h-[430px]">
              <SandParticleText text={"Shubham\nRathod"} fontScale={0.19} className="h-full w-full" />
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
              I design AI products that turn messy inputs into reliable workflows:
              LLM systems, data pipelines, automation engines, and full-stack interfaces
              that make model behavior usable in production.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#work" className="command-button bg-[var(--foreground)] text-[var(--background)]">
                View work
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="command-button border border-[var(--line)] text-[var(--foreground)]">
                Start a conversation
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="relative z-10 rounded-t-[2.5rem] bg-[var(--background)] shadow-[0_-20px_40px_rgba(0,0,0,0.12)] sm:rounded-t-[3.5rem]">
        <section className="rounded-t-[2.5rem] bg-[var(--foreground)] px-5 py-28 text-[var(--background)] sm:rounded-t-[3.5rem] md:py-36">
          <div className="mx-auto max-w-5xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Turning models into reliable workflows.
            </motion.h2>
          </div>
        </section>

        <section id="profile" className="section-band">
        <div className="section-grid">
          <div>
            <p className="eyebrow">Profile</p>
            <h2 className="section-title">Practical AI engineering, from prototype to deployed workflow.</h2>
          </div>
          <div className="space-y-8">
            <p className="section-copy">
              My strongest work sits between model capability and product reality:
              retrieval, data ingestion, validation, async backends, dashboards, and
              automations that keep the system useful after the demo ends.
            </p>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--line)]">
              {[
                ["5+", "Major projects"],
                ["12", "Prompt systems"],
                ["30 FPS", "Vision pipeline"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[var(--surface)] p-5">
                  <p className="font-display text-3xl font-extrabold text-[var(--foreground)]">{value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="section-band bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Stack</p>
            <h2 className="section-title">A compact toolkit for intelligent systems.</h2>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4"
          >
            {skillClusters.map((cluster, index) => {
              const Icon = capabilityIcons[index] ?? Layers3;
              return (
                <motion.article
                  key={cluster.title}
                  variants={{
                    hidden: { opacity: 0, x: 300 },
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  className="min-h-[330px] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-black" strokeWidth={1.8} />
                    <span className="font-mono text-xs text-gray-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 text-xl font-bold text-black">{cluster.title}</h3>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {cluster.skills.map((skill) => (
                      <span key={skill} className="rounded-sm border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="work" className="section-band">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">Selected Work</p>
              <h2 className="section-title">Projects framed by outcome, architecture, and execution.</h2>
            </div>
            <div className="flex max-w-3xl flex-wrap gap-2">
              {projectCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                    activeCategory === category
                      ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                      : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {category === "All" ? "All" : category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5">
            {visibleProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="project-row group"
              >
                <motion.div 
                  className="relative h-full min-h-[260px] w-full overflow-hidden md:min-h-[320px]"
                  initial={{ clipPath: "inset(15% 0 15% 0)" }}
                  whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                     initial={{ scale: 1.15 }}
                     whileInView={{ scale: 1 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 1.2, ease: "easeOut" }}
                     className="absolute inset-0 h-full w-full"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 38vw"
                      className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                  </motion.div>
                </motion.div>
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="eyebrow text-[var(--accent)]">{project.category}</p>
                      <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-5 text-3xl font-extrabold leading-none text-[var(--foreground)] md:text-5xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">{project.description}</p>
                  </div>

                  <div className="mt-8">
                    <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
                      <Spec label="Architecture" value={project.architecture} />
                      <Spec label="Stack" value={project.stack} />
                      <Spec label="Metric" value={project.metrics[0]} />
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <a href={project.github} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] transition hover:text-[var(--accent)]">
                        Source
                        <RiGithubFill className="h-4 w-4" />
                      </a>
                      {project.live !== "#" && (
                        <a href={project.live} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] transition hover:text-[var(--accent)]">
                          Live
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-sm bg-[var(--nav-hover)] px-2.5 py-1 text-xs text-[var(--muted)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="section-band bg-[var(--surface)]">
        <div className="section-grid">
          <div>
            <p className="eyebrow">Method</p>
            <h2 className="section-title">How I shape AI systems before writing the interface.</h2>
            <div className="mt-10 h-[300px] overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--background)]">
              <SandParticleText compact text={"BUILD\nSHIP"} className="h-full w-full" />
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--line)]">
            {[
              ["01", "Map", "Define the inputs, failure modes, human approvals, and state that the system must remember."],
              ["02", "Model", "Choose retrieval, prompts, tools, and evaluation loops around measurable user outcomes."],
              ["03", "Ship", "Build the API, worker, database, and interface layers needed to keep the workflow observable."],
              ["04", "Tighten", "Use logs and user behavior to reduce latency, cost, hallucination risk, and operational noise."],
            ].map(([id, title, copy], index) => (
              <motion.div 
                key={id} 
                className="bg-[var(--background)] p-7"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <p className="font-mono text-xs text-[var(--accent)]">{id}</p>
                <h3 className="mt-4 text-2xl font-bold text-[var(--foreground)]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" className="section-band">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="eyebrow">Timeline</p>
          <h2 className="section-title max-w-4xl">Experience across applied AI, consulting, and formal AI education.</h2>
          <div className="mt-12 border-l border-[var(--line)]">
            {experience.map((item, index) => (
              <motion.article 
                key={item.company} 
                className="relative pb-12 pl-8 last:pb-0"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{item.period}</p>
                <h3 className="mt-3 text-2xl font-extrabold text-[var(--foreground)]">{item.company}</h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent-2)]">{item.role}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">{item.description}</p>
                <ul className="mt-5 grid gap-3">
                  {item.achievements.slice(0, item.company === "Apexneural Pvt Ltd" ? 5 : 3).map((achievement) => (
                    <li key={achievement} className="max-w-4xl text-sm leading-6 text-[var(--muted-strong)]">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-[var(--line)] bg-[var(--surface)] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Contact</p>
            <motion.h2 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-none text-[var(--foreground)] md:text-7xl"
            >
              Let&apos;s build a sharper AI workflow.
            </motion.h2>
            <a href={`mailto:${siteConfig.email}`} className="mt-8 inline-flex text-lg font-semibold text-[var(--accent)]">
              {siteConfig.email}
            </a>
          </div>
          <div className="flex gap-3">
            <a href={siteConfig.github} className="social-link" aria-label="GitHub">
              <RiGithubFill className="h-5 w-5" />
            </a>
            <a href={siteConfig.linkedin} className="social-link" aria-label="LinkedIn">
              <RiLinkedinBoxFill className="h-5 w-5" />
            </a>
            <a href={`mailto:${siteConfig.email}`} className="social-link" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
      </div>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--background)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-[var(--foreground)]">{value}</p>
    </div>
  );
}

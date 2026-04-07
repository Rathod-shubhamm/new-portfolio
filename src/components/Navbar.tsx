"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Process", href: "#process" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSegment, setActiveSegment] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSegment(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-500",
          isScrolled ? "py-4" : "py-6"
        )}
      >
        <nav
          className={cn(
            "mx-auto max-w-5xl flex items-center justify-between px-6 py-2.5 rounded-full transition-all duration-500 border",
            isScrolled
              ? "glass border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold text-white font-display overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              {siteConfig.name.charAt(0)}
            </div>
            <span className="font-bold text-lg font-display tracking-tight hidden sm:block">
              {siteConfig.name.split(" ")[0]}
              <span className="text-accent">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSegment === item.href.substring(1);
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 rounded-full",
                      isActive ? "text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 bg-white/5 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:block px-6 py-2 rounded-full border border-white/10 text-white font-medium text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Resume
            </motion.button>

            {/* Hamburger — Mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[99] bg-[#050508]/95 backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
          >
            {/* Background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <ul className="relative z-10 flex flex-col items-center gap-2 w-full px-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between w-full py-5 px-4 border-b border-white/5 text-3xl font-bold font-display uppercase tracking-widest text-white/70 hover:text-white hover:text-accent transition-colors group"
                  >
                    <span>{item.name}</span>
                    <span className="text-accent text-base opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 mt-16 flex flex-col items-center gap-3"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Available for work</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <p className="text-[10px] font-mono text-slate-400">{siteConfig.email}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

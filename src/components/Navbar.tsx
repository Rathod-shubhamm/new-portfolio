"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Basic intersection observer logically
      const sections = NAV_ITEMS.map(item => item.href.substring(1));
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

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-6 py-6 transition-all duration-500",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <nav className={cn(
        "mx-auto max-w-5xl flex items-center justify-between px-6 py-2.5 rounded-full transition-all duration-500 border",
        isScrolled 
          ? "glass border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
          : "bg-transparent border-transparent"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold text-white font-display overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            {siteConfig.name.charAt(0)}
          </div>
          <span className="font-bold text-lg font-display tracking-tight hidden sm:block">
            {siteConfig.name.split(' ')[0]}<span className="text-accent">.</span>
          </span>
        </div>

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

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-full border border-white/10 text-white font-medium text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Resume
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}

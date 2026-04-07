"use client";

import { motion } from "framer-motion";
import { RiGithubFill, RiLinkedinBoxFill, RiMailFill } from "react-icons/ri";
import { siteConfig } from "@/lib/data";
import { useState, useRef } from "react";

export default function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setBtnPos({ x: x * 0.3, y: y * 0.3 });
    }
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  return (
    <footer id="contact" className="py-32 bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-accent">Availability Check</span>
              <h2 className="text-4xl md:text-7xl font-bold font-display leading-[0.9] text-white">
                Initiate <br/><span className="text-white/40">Collaboration</span>
              </h2>
              <p className="text-slate-400 max-w-md mt-6 text-lg">
                Open for high-impact AI projects, deep-tech research, and innovative autonomous systems. 
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 group-hover:text-accent transition-all">
                  <RiMailFill className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Electronic Mail</p>
                   <a href={`mailto:${siteConfig.email}`} className="text-lg text-white hover:text-accent transition-colors font-medium">
                     {siteConfig.email}
                   </a>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                 {siteConfig.socials.map((social) => (
                   <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="w-14 h-14 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:border-accent/40"
                   >
                      {social.platform === 'github' && <RiGithubFill className="w-6 h-6" />}
                      {social.platform === 'linkedin' && <RiLinkedinBoxFill className="w-6 h-6" />}
                   </motion.a>
                 ))}
              </div>
            </div>
            
            <div className="pt-20 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-slate-700">
                &copy; {new Date().getFullYear()} {siteConfig.name} &bull; {siteConfig.role}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-[40px] p-8 md:p-12 border-white/5"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block ml-1">Identity</label>
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block ml-1">Digital Address</label>
                  <input
                    type="email"
                    placeholder="YOUR@EMAIL.COM"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block ml-1">Transmission Context</label>
                <textarea
                  rows={5}
                  placeholder="WHAT INNOVATION ARE WE DISCUSSING?"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none"
                />
              </div>

              <motion.button
                ref={btnRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: btnPos.x, y: btnPos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-slate-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
              >
                Send Transmission
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

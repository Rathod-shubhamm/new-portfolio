"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOGS = [
  "[SYSTEM]: Initializing Neural Agent...",
  "[DATABASE]: Loading Vector Embeddings (128k)...",
  "[ML]: Pre-fetching RAG Context... OK",
  "[SYSTEM]: Inference Engine Ready.",
  "[AUTH]: Personal Credentials Validated.",
  "[FETCH]: Retrieving Project Manifest...",
  "[ML]: Optimizing Query Pipelines...",
  "[SYSTEM]: All Nodes Active.",
  "[DEBUG]: Memory Usage: 42.4 MiB",
  "[DEBUG]: Latency: 18ms",
]

export default function NeuralLog() {
  const [currentLogs, setCurrentLogs] = useState<string[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOGS.length)
      setCurrentLogs((prev) => {
        const next = [...prev, LOGS[index]]
        if (next.length > 5) return next.slice(1)
        return next
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [index])

  return (
    <div className="absolute bottom-10 right-10 hidden lg:block w-72 pointer-events-none group">
      <div className="glass rounded-2xl border-white/5 p-4 font-mono text-[10px] space-y-2 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-slate-500 uppercase tracking-widest font-bold">Neural Inference Log</span>
        </div>
        
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {currentLogs.map((log, i) => (
              <motion.div
                key={`${log}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "whitespace-nowrap transition-colors",
                  log.includes("SYSTEM") ? "text-accent" : "text-slate-400"
                )}
              >
                <span className="opacity-30 mr-2">{">"}</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Blinking cursor */}
        <motion.div
           animate={{ opacity: [0, 1, 0] }}
           transition={{ duration: 0.8, repeat: Infinity }}
           className="w-1.5 h-3 bg-accent/40 mt-1"
        />
      </div>
    </div>
  )
}

// Helper function to handle class merging
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

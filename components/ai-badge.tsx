"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function AiBadge() {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sparkles className="h-3.5 w-3.5 text-purple-400" />
      <span>AI-Powered Career Guidance</span>
    </motion.div>
  )
}

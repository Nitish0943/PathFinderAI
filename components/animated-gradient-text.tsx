"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedGradientTextProps {
  children: ReactNode
}

export function AnimatedGradientText({ children }: AnimatedGradientTextProps) {
  return (
    <motion.span
      className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.8 },
      }}
      style={{
        backgroundSize: "200% 200%",
        animation: "gradient-animation 6s ease infinite",
      }}
    >
      <style jsx global>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
      {children}
    </motion.span>
  )
}

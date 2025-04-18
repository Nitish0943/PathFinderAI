"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  gradient: string
  glowColor: string
}

export function FeatureCard({ title, description, icon, gradient, glowColor }: FeatureCardProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ boxShadow: `0 0 30px ${glowColor}` }}
      />
      <div className="relative h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 flex flex-col">
        <div className="mb-4 p-2 rounded-lg bg-white/5 w-fit">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
        <div className="mt-4 pt-4 border-t border-white/10">
          <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            Learn more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

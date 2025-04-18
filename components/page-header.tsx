"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description?: string
  gradient?: string
}

export function PageHeader({ title, description, gradient = "from-purple-500/10 to-blue-500/10" }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b dark:border-blue-800/30 light:border-blue-200/50">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`} />

      {/* Background grid */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(10,1fr)] dark:opacity-10 light:opacity-5">
        {Array.from({ length: 400 }).map((_, i) => (
          <div
            key={i}
            className="dark:border-[0.5px] dark:border-blue-900/30 light:border-[0.5px] light:border-blue-500/20"
          ></div>
        ))}
      </div>

      <div className="container px-4 py-16 md:py-20 relative z-10">
        <motion.h1
          className="text-3xl md:text-5xl font-bold dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-gray-400 light:text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            className="mt-4 text-lg dark:text-gray-400 light:text-gray-600 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  )
}

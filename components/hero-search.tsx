"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSearch() {
  return (
    <motion.div
      className="mt-10 w-full max-w-2xl relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl opacity-50" />
      <div className="relative flex rounded-lg border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] overflow-hidden">
        <Input
          type="text"
          placeholder="Search for jobs, courses, or skills..."
          className="flex-1 border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 px-4"
        />
        <Button
          type="submit"
          className="rounded-l-none h-14 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>

      {/* 3D effect elements */}
      <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -left-1 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute -right-1 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
    </motion.div>
  )
}

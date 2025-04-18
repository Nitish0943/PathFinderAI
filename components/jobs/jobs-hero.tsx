"use client"

import { motion } from "framer-motion"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function JobsHero() {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden border border-orange-800/30 bg-orange-950/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-pink-600/10" />

      <div className="relative p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Find your dream job in India</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Job title or keyword"
                className="pl-10 bg-orange-950/50 border-orange-800/50 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="City or state"
                className="pl-10 bg-orange-950/50 border-orange-800/50 text-white placeholder:text-gray-500"
              />
            </div>

            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-sm text-gray-400 mr-2">Popular:</div>
            {["Bengaluru", "Software Engineer", "Data Scientist", "Product Manager", "Remote"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="border-orange-800/50 bg-orange-950/30 text-gray-300 hover:bg-orange-900/50"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

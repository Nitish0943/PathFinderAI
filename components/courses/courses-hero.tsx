"use client"

import { motion } from "framer-motion"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CoursesHero() {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden border border-green-800/30 bg-green-950/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-teal-600/10" />

      <div className="relative p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-green-900/30">
              <Sparkles className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Discover AI-recommended courses for Indian professionals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for courses, skills, or topics..."
                className="pl-10 bg-green-950/50 border-green-800/50 text-white placeholder:text-gray-500"
              />
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Search className="mr-2 h-4 w-4" />
              Find Courses
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-sm text-gray-400 mr-2">Trending in India:</div>
            {["Data Science", "Full Stack Development", "Digital Marketing", "Cloud Computing", "AI & ML"].map(
              (tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="border-green-800/50 bg-green-950/30 text-gray-300 hover:bg-green-900/50"
                >
                  {tag}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

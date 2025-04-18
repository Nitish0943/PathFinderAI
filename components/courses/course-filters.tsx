"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CourseFiltersProps {
  filters: {
    search: string
    category: string
    level: string
    duration: string
    price: number[]
    rating: number
  }
  setFilters: (filters: any) => void
}

const categories = [
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "Cloud Computing",
  "Business Management",
  "Design",
]
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]
const durations = ["< 5 hours", "5-10 hours", "10-20 hours", "> 20 hours"]
const providers = ["Coursera", "upGrad", "Great Learning", "Udemy", "NPTEL", "Simplilearn"]

export function CourseFilters({ filters, setFilters }: CourseFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    level: true,
    duration: true,
    price: true,
    rating: true,
    provider: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-green-800/30 bg-green-950/20 overflow-hidden">
        <div className="p-4 border-b border-green-800/30 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Reset
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("category")}>
              <h4 className="font-medium">Category</h4>
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.category && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category === category}
                      onCheckedChange={() => setFilters({ ...filters, category: category })}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm text-gray-300">
                      {category}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Provider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("provider")}>
              <h4 className="font-medium">Provider</h4>
              {expandedSections.provider ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.provider && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {providers.map((provider) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <Checkbox
                      id={`provider-${provider}`}
                      checked={filters.category === provider}
                      onCheckedChange={() => setFilters({ ...filters, category: provider })}
                    />
                    <Label htmlFor={`provider-${provider}`} className="text-sm text-gray-300">
                      {provider}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("level")}>
              <h4 className="font-medium">Level</h4>
              {expandedSections.level ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.level && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroup value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={`level-${level}`} />
                      <Label htmlFor={`level-${level}`} className="text-sm text-gray-300">
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("duration")}>
              <h4 className="font-medium">Duration</h4>
              {expandedSections.duration ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.duration && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroup
                  value={filters.duration}
                  onValueChange={(value) => setFilters({ ...filters, duration: value })}
                >
                  {durations.map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <RadioGroupItem value={duration} id={`duration-${duration}`} />
                      <Label htmlFor={`duration-${duration}`} className="text-sm text-gray-300">
                        {duration}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("price")}>
              <h4 className="font-medium">Price Range (₹)</h4>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.price && (
              <motion.div
                className="space-y-4 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Slider
                  value={filters.price}
                  max={20000}
                  step={500}
                  className="py-4"
                  onValueChange={(value) => setFilters({ ...filters, price: value })}
                />
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>₹{filters.price[0]}</span>
                  <span>₹{filters.price[1]}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("rating")}>
              <h4 className="font-medium">Rating</h4>
              {expandedSections.rating ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.rating && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.rating === rating}
                      onCheckedChange={() => setFilters({ ...filters, rating: rating })}
                    />
                    <Label htmlFor={`rating-${rating}`} className="text-sm text-gray-300 flex items-center">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gray-600" />
                      ))}
                      <span className="ml-2">& up</span>
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

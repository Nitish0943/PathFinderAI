"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CourseCard } from "./course-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List } from "lucide-react"

interface CourseGridProps {
  filters: {
    search: string
    category: string
    level: string
    duration: string
    price: number[]
    rating: number
  }
  courses: Array<any>
}

export function CourseGrid({ filters, courses }: CourseGridProps) {
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid")

  console.log("Received courses:", courses) // Debug log

  // Filter courses based on filters
  const filteredCourses = courses.filter((course) => {
    // Filter by category
    if (filters.category && course.category !== filters.category) return false

    // Filter by level
    if (filters.level && course.level !== filters.level) return false

    // Filter by price range
    if (course.price < filters.price[0] || course.price > filters.price[1]) return false

    // Filter by rating
    if (filters.rating > 0 && course.rating < filters.rating) return false

    return true
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "recommended") {
      return b.rating - a.rating || b.students - a.students
    } else if (sortBy === "popular") {
      return b.students - a.students
    } else if (sortBy === "newest") {
      return b.id - a.id
    } else if (sortBy === "price-low") {
      return a.price - b.price
    } else if (sortBy === "price-high") {
      return b.price - a.price
    }
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">{sortedCourses.length} courses found</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Tabs defaultValue="grid" value={viewMode} onValueChange={setViewMode} className="h-9">
            <TabsList className="bg-green-950/30 border border-green-800/50 dark:bg-green-950/30 dark:border-green-800/50 light:bg-green-100 light:border-green-200">
              <TabsTrigger
                value="grid"
                className="data-[state=active]:bg-green-900/50 light:data-[state=active]:bg-green-200"
              >
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-green-900/50 light:data-[state=active]:bg-green-200"
              >
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-green-950/30 border-green-800/50 text-white dark:bg-green-950/30 dark:border-green-800/50 light:bg-white light:border-green-200 light:text-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-green-950 border-green-800/50 text-white dark:bg-green-950 dark:border-green-800/50 light:bg-white light:border-green-200 light:text-gray-800">
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <motion.div
        className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sortedCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <CourseCard course={course} viewMode={viewMode} />
          </motion.div>
        ))}

        {sortedCourses.length === 0 && (
          <div className="col-span-full text-center py-12 bg-green-950/20 rounded-xl border border-green-800/30 dark:bg-green-950/20 dark:border-green-800/30 light:bg-green-50 light:border-green-200">
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

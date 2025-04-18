"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { Clock, Star, Users, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: {
    id: number
    title: string
    provider: string
    thumbnail: string
    rating: number
    level: string
    duration: string
    price: number
    badge: string | null
    progress: number
    category: string
    description: string
    instructor: string
    students: number
    certificate?: string
  }
  viewMode: "grid" | "list"
}

export function CourseCard({ course, viewMode }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // For 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    mouseX.set(x - rect.width / 2)
    mouseY.set(y - rect.height / 2)
  }

  const rotateX = useMotionTemplate`${mouseY.get() * -0.01}deg`
  const rotateY = useMotionTemplate`${mouseX.get() * 0.01}deg`

  if (viewMode === "list") {
    return (
      <motion.div
        className={cn(
          "relative rounded-xl border overflow-hidden transition-all duration-300",
          "dark:border-green-800/30 dark:bg-green-950/20 light:border-green-200 light:bg-white",
          isHovered ? "shadow-lg dark:shadow-green-900/20 light:shadow-green-200/50" : "shadow-sm",
        )}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="relative md:w-64 h-48 md:h-auto">
            <Image src={course.thumbnail || "/placeholder.svg"} alt={course.title} fill className="object-cover" />

            {/* Badge */}
            {course.badge && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-600 text-white border-0">{course.badge}</Badge>
              </div>
            )}

            {/* Provider logo */}
            <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-md bg-black/50 text-white backdrop-blur-sm">
              {course.provider}
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-1 dark:text-white light:text-gray-800">{course.title}</h3>
              <p className="text-sm dark:text-gray-400 light:text-gray-600 line-clamp-2">{course.description}</p>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="ml-1 text-sm font-medium">{course.rating}</span>
              </div>
              <div className="text-xs text-gray-500">•</div>
              <div className="flex items-center text-sm dark:text-gray-400 light:text-gray-600">
                <Users className="h-3 w-3 mr-1" />
                {course.students.toLocaleString()} students
              </div>
              <div className="text-xs text-gray-500">•</div>
              <div className="text-sm dark:text-gray-400 light:text-gray-600">{course.level}</div>
            </div>

            <div className="flex items-center gap-3 mb-3 text-sm dark:text-gray-400 light:text-gray-600">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {course.category}
              </div>
              {course.certificate && (
                <div className="flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  {course.certificate}
                </div>
              )}
            </div>

            {/* Progress bar (if enrolled) */}
            {course.progress > 0 && (
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="dark:text-gray-400 light:text-gray-600">Progress</span>
                  <span className="dark:text-gray-400 light:text-gray-600">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1" />
              </div>
            )}

            <div className="mt-auto flex items-center justify-between">
              <div className="font-semibold text-lg dark:text-white light:text-gray-800">
                ₹{course.price.toLocaleString()}
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                {course.progress > 0 ? "Continue" : "Enroll"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="relative h-full"
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        className={cn(
          "relative h-full rounded-xl border overflow-hidden transition-all duration-300",
          "dark:border-green-800/30 dark:bg-green-950/20 light:border-green-200 light:bg-white",
          isHovered ? "shadow-lg dark:shadow-green-900/20 light:shadow-green-200/50" : "shadow-sm",
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Badge */}
        {course.badge && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              className="px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white"
              initial={{ scale: 1 }}
              animate={isHovered ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" }}
            >
              {course.badge}
            </motion.div>
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

          {/* Provider logo */}
          <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-md bg-black/50 text-white backdrop-blur-sm">
            {course.provider}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold line-clamp-2 dark:text-white light:text-gray-800">{course.title}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="ml-1 text-sm font-medium">{course.rating}</span>
            </div>
            <div className="text-xs text-gray-500">•</div>
            <div className="text-sm dark:text-gray-400 light:text-gray-600">{course.level}</div>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-sm dark:text-gray-400 light:text-gray-600">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>

          {/* Certificate */}
          {course.certificate && (
            <div className="flex items-center text-sm dark:text-gray-400 light:text-gray-600">
              <Award className="h-3 w-3 mr-1" />
              <span>{course.certificate}</span>
            </div>
          )}

          {/* Progress bar (if enrolled) */}
          {course.progress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="dark:text-gray-400 light:text-gray-600">Progress</span>
                <span className="dark:text-gray-400 light:text-gray-600">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1" />
            </div>
          )}

          {/* Price and action */}
          <div className="flex items-center justify-between pt-2">
            <div className="font-semibold dark:text-white light:text-gray-800">₹{course.price.toLocaleString()}</div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              {course.progress > 0 ? "Continue" : "Enroll"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

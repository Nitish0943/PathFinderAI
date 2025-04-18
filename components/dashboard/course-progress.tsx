"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for courses in progress
const coursesInProgress = [
  {
    id: 1,
    title: "Advanced React Patterns",
    provider: "Frontend Masters",
    progress: 65,
    lastAccessed: "2 days ago",
    nextLesson: "Higher-Order Components",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    provider: "Coursera",
    progress: 42,
    lastAccessed: "1 week ago",
    nextLesson: "Supervised Learning Algorithms",
  },
  {
    id: 3,
    title: "UX Research Methods",
    provider: "Udemy",
    progress: 78,
    lastAccessed: "Yesterday",
    nextLesson: "User Interviews",
  },
]

export function CourseProgress() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coursesInProgress.map((course, index) => (
            <motion.div
              key={course.id}
              className="space-y-2 p-3 rounded-lg border border-border/50 bg-card/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.provider}</p>
                </div>
                <Button size="sm">Continue</Button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Last accessed {course.lastAccessed}</span>
                <span>Next: {course.nextLesson}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

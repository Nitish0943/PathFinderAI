"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MentorCard } from "@/components/mentorship/mentor-card"

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Product Manager",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
    experience: "8 years",
    rate: "$120/hour",
    availability: "Weekends",
    rating: 4.9,
    reviews: 24,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Staff Engineer",
    company: "Google",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["React", "Node.js", "System Design", "Mentorship"],
    experience: "12 years",
    rate: "$150/hour",
    availability: "Evenings",
    rating: 4.8,
    reviews: 36,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "UX Research Lead",
    company: "DesignStudio",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["User Research", "Usability Testing", "Design Thinking", "Prototyping"],
    experience: "7 years",
    rate: "$110/hour",
    availability: "Flexible",
    rating: 4.7,
    reviews: 19,
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Data Science Manager",
    company: "DataInsights",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["Machine Learning", "Python", "Data Visualization", "Team Leadership"],
    experience: "10 years",
    rate: "$140/hour",
    availability: "Weekdays",
    rating: 4.9,
    reviews: 28,
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    role: "DevOps Architect",
    company: "CloudTech",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["AWS", "Kubernetes", "CI/CD", "Infrastructure as Code"],
    experience: "9 years",
    rate: "$130/hour",
    availability: "Weekends",
    rating: 4.8,
    reviews: 22,
  },
  {
    id: 6,
    name: "David Kim",
    role: "Frontend Lead",
    company: "CreativeWeb",
    avatar: "/placeholder.svg?height=150&width=150",
    expertise: ["React", "TypeScript", "Design Systems", "Performance Optimization"],
    experience: "8 years",
    rate: "$125/hour",
    availability: "Evenings",
    rating: 4.7,
    reviews: 31,
  },
]

export function MentorGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div className="space-y-6" ref={ref}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{mentors.length} mentors available</h2>
        <div className="text-sm text-muted-foreground">Sorted by: Rating</div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {mentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <MentorCard mentor={mentor} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

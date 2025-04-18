"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { JobCard } from "./job-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for jobs with Indian context
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Infosys",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Bengaluru, Karnataka",
    salary: "₹18-25 LPA",
    type: "Full-time",
    experience: "3-5 years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    posted: "2 days ago",
    description:
      "We're looking for a Senior Frontend Developer to join our Digital Experience team and help build beautiful, responsive web applications using React and TypeScript for our global clients.",
    featured: true,
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "Flipkart",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Bengaluru, Karnataka",
    salary: "₹20-30 LPA",
    type: "Full-time",
    experience: "3-5 years",
    skills: ["Python", "TensorFlow", "PyTorch", "Computer Vision"],
    posted: "1 week ago",
    description:
      "Join our AI team working on cutting-edge computer vision solutions to enhance the e-commerce shopping experience for millions of customers.",
    featured: true,
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Paytm",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Noida, Uttar Pradesh",
    salary: "₹18-28 LPA",
    type: "Full-time",
    experience: "5-8 years",
    skills: ["Product Strategy", "Agile", "User Research", "Fintech"],
    posted: "3 days ago",
    description:
      "Lead product development for our financial services platform, working closely with engineering, design, and marketing teams to drive innovation in digital payments.",
    featured: false,
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Swiggy",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Bengaluru, Karnataka",
    salary: "₹12-18 LPA",
    type: "Full-time",
    experience: "2-4 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    posted: "5 days ago",
    description:
      "Create beautiful and intuitive user interfaces for our food delivery platform, with a focus on enhancing the ordering experience for millions of users across India.",
    featured: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Razorpay",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Bengaluru, Karnataka",
    salary: "₹15-25 LPA",
    type: "Full-time",
    experience: "3-5 years",
    skills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"],
    posted: "1 day ago",
    description:
      "Build and maintain our cloud infrastructure, implement CI/CD pipelines, and ensure high availability of our payment processing services used by thousands of businesses.",
    featured: false,
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Ola",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Gurugram, Haryana",
    salary: "₹16-24 LPA",
    type: "Full-time",
    experience: "2-5 years",
    skills: ["Python", "SQL", "Data Visualization", "Machine Learning"],
    posted: "4 days ago",
    description:
      "Analyze large datasets from our ride-sharing platform, build predictive models, and create data visualizations to optimize driver allocation and pricing strategies.",
    featured: false,
  },
]

interface JobListProps {
  filters: {
    search: string
    location: string
    jobType: string
    experience: string
    skills: string[]
  }
}

export function JobList({ filters }: JobListProps) {
  const [sortBy, setSortBy] = useState("relevance")

  // Filter jobs based on filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by location
    if (filters.location && job.location.indexOf(filters.location) === -1) return false

    // Filter by job type
    if (filters.jobType && job.type !== filters.jobType) return false

    // Filter by experience
    if (filters.experience && job.experience !== filters.experience) return false

    // Filter by skills (if any skills are selected)
    if (filters.skills.length > 0) {
      const hasMatchingSkill = job.skills.some((skill) => filters.skills.includes(skill))
      if (!hasMatchingSkill) return false
    }

    return true
  })

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "relevance") {
      // Sort by featured first, then by match with skills
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    } else if (sortBy === "recent") {
      // Sort by posted date (mock implementation)
      return a.posted.localeCompare(b.posted)
    } else if (sortBy === "salary-high") {
      // Sort by salary (mock implementation)
      return -1 // In a real app, parse and compare actual salary values
    } else if (sortBy === "salary-low") {
      // Sort by salary (mock implementation)
      return 1 // In a real app, parse and compare actual salary values
    }
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{sortedJobs.length} jobs found</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-orange-950/30 border-orange-800/50 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-orange-950 border-orange-800/50 text-white">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Salary (High to Low)</SelectItem>
              <SelectItem value="salary-low">Salary (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sortedJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}

        {sortedJobs.length === 0 && (
          <div className="text-center py-12 bg-orange-950/20 rounded-xl border border-orange-800/30">
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

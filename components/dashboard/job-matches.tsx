"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for job matches
const jobMatches = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA (Remote)",
    matchScore: 92,
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "ProductLabs",
    location: "Remote",
    matchScore: 87,
    skills: ["Product Strategy", "Agile", "User Research"],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "London, UK",
    matchScore: 85,
    skills: ["Figma", "User Research", "Prototyping"],
  },
]

export function JobMatches() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personalized Job Matches</CardTitle>
          <CardDescription>Based on your skills and preferences</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobMatches.map((job, index) => (
            <motion.div
              key={job.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{job.title}</h3>
                  <Badge variant="outline" className="bg-primary/5">
                    {job.matchScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="shrink-0">
                View
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

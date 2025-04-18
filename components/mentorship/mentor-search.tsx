"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const domains = ["Web Development", "Data Science", "UX/UI Design", "DevOps", "Product Management", "Marketing"]
const experiences = ["1-3 years", "3-5 years", "5-10 years", "10+ years"]
const availabilities = ["Weekdays", "Weekends", "Evenings", "Flexible"]

export function MentorSearch() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search mentors by name or expertise..." className="pl-10" />
        </div>

        <Button variant="outline" className="sm:w-auto w-full" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Domain</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain.toLowerCase().replace(/\s+/g, "-")}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Experience</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {experiences.map((exp) => (
                  <SelectItem key={exp} value={exp.toLowerCase().replace(/\s+/g, "-")}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Availability</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilities.map((avail) => (
                  <SelectItem key={avail} value={avail.toLowerCase()}>
                    {avail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}
    </div>
  )
}

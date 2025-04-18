"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface JobFiltersProps {
  filters: {
    search: string
    location: string
    jobType: string
    experience: string
    skills: string[]
  }
  setFilters: (filters: any) => void
}

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"]
const experienceLevels = ["Fresher", "1-3 years", "3-5 years", "5-8 years", "8+ years"]
const skills = [
  "JavaScript",
  "React",
  "Python",
  "Data Analysis",
  "UI/UX Design",
  "Product Management",
  "AWS",
  "Machine Learning",
]
const locations = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Pune", "Remote"]

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    experience: true,
    salary: true,
    skills: true,
    location: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handleSkillToggle = (skill: string) => {
    if (filters.skills.includes(skill)) {
      setFilters({
        ...filters,
        skills: filters.skills.filter((s) => s !== skill),
      })
    } else {
      setFilters({
        ...filters,
        skills: [...filters.skills, skill],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-orange-800/30 bg-orange-950/20 overflow-hidden">
        <div className="p-4 border-b border-orange-800/30 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Reset
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("location")}>
              <h4 className="font-medium">Location</h4>
              {expandedSections.location ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.location && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.location === location}
                      onCheckedChange={() => setFilters({ ...filters, location: location })}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm text-gray-300">
                      {location}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("jobType")}>
              <h4 className="font-medium">Job Type</h4>
              {expandedSections.jobType ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.jobType && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`job-type-${type}`}
                      checked={filters.jobType === type}
                      onCheckedChange={() => setFilters({ ...filters, jobType: type })}
                    />
                    <Label htmlFor={`job-type-${type}`} className="text-sm text-gray-300">
                      {type}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("experience")}
            >
              <h4 className="font-medium">Experience Level</h4>
              {expandedSections.experience ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.experience && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {experienceLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-level-${level}`}
                      checked={filters.experience === level}
                      onCheckedChange={() => setFilters({ ...filters, experience: level })}
                    />
                    <Label htmlFor={`exp-level-${level}`} className="text-sm text-gray-300">
                      {level}
                    </Label>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Salary Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("salary")}>
              <h4 className="font-medium">Salary Range (LPA)</h4>
              {expandedSections.salary ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.salary && (
              <motion.div
                className="space-y-4 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Slider defaultValue={[5, 25]} max={50} step={1} className="py-4" />
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>₹5 LPA</span>
                  <span>₹25 LPA</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("skills")}>
              <h4 className="font-medium">Skills</h4>
              {expandedSections.skills ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {expandedSections.skills && (
              <motion.div
                className="space-y-2 pt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={filters.skills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        filters.skills.includes(skill)
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-transparent border-orange-800/50 hover:bg-orange-900/30"
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

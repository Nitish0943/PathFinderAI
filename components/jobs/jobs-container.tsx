"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { JobFilters } from "./job-filters"
import { JobList } from "./job-list"
import { JobsHero } from "./jobs-hero"

export function JobsContainer() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experience: "",
    skills: [] as string[],
  })

  return (
    <div className="container px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <JobsHero />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <JobFilters filters={filters} setFilters={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <JobList filters={filters} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

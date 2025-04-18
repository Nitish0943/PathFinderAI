"use client"

import { useEffect, useState } from "react"
import { CourseGrid } from "./course-grid"

export function CoursesContainer({ filters }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/courses?search=${filters.search}&category=${filters.category}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`)
        }

        const data = await response.json()
        setCourses(data.results)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [filters])

  if (loading) {
    return <div className="text-center text-white">Loading courses...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <CourseGrid filters={filters} courses={courses} />
    </div>
  )
}

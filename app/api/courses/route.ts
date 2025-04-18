import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const demoCourses = [
  {
    id: "1",
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning. Perfect for beginners looking to start their AI journey.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    level: "Beginner",
    duration: "4 weeks",
    category: "Artificial Intelligence",
    provider: "Indian Institute of Technology",
    rating: "4.8",
    students: 12500,
    price: 0,
    certificate: "Included",
    instructor: "Dr. Rajesh Kumar",
    slug: "introduction-to-ai"
  },
  {
    id: "2",
    title: "Data Science Fundamentals",
    description: "Master the basics of data science, statistics, and data visualization using Python.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    level: "Intermediate",
    duration: "6 weeks",
    category: "Data Science",
    provider: "Indian Statistical Institute",
    rating: "4.7",
    students: 9800,
    price: 0,
    certificate: "Included",
    instructor: "Prof. Meera Sharma",
    slug: "data-science-fundamentals"
  },
  {
    id: "3",
    title: "Web Development Bootcamp",
    description: "Comprehensive course covering HTML, CSS, JavaScript, and modern frameworks like React.",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop",
    level: "Beginner",
    duration: "8 weeks",
    category: "Web Development",
    provider: "National Institute of Technology",
    rating: "4.9",
    students: 15600,
    price: 0,
    certificate: "Included",
    instructor: "Dr. Amit Patel",
    slug: "web-development-bootcamp"
  },
  {
    id: "4",
    title: "Cloud Computing Essentials",
    description: "Learn about cloud platforms, deployment, and management with hands-on projects.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    level: "Intermediate",
    duration: "5 weeks",
    category: "Cloud Computing",
    provider: "Indian Institute of Science",
    rating: "4.6",
    students: 8700,
    price: 0,
    certificate: "Included",
    instructor: "Prof. Sunil Verma",
    slug: "cloud-computing-essentials"
  },
  {
    id: "5",
    title: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity concepts and best practices to protect digital assets.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    level: "Intermediate",
    duration: "6 weeks",
    category: "Cybersecurity",
    provider: "Indian Institute of Information Technology",
    rating: "4.7",
    students: 7500,
    price: 0,
    certificate: "Included",
    instructor: "Dr. Priya Singh",
    slug: "cybersecurity-fundamentals"
  },
  {
    id: "6",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native and Flutter.",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    level: "Intermediate",
    duration: "7 weeks",
    category: "Mobile Development",
    provider: "Delhi Technological University",
    rating: "4.8",
    students: 9200,
    price: 0,
    certificate: "Included",
    instructor: "Prof. Rahul Mehta",
    slug: "mobile-app-development"
  }
]

export async function GET(req: NextRequest) {
  try {
    const { search = "", category = "", level = "", duration = "", price = "0,100000", rating = "0" } = 
      Object.fromEntries(req.nextUrl.searchParams)

    // If no search query is provided, return demo courses
    if (!search) {
      return NextResponse.json({ 
        results: demoCourses,
        total: demoCourses.length,
        page: 1,
        limit: 12
      })
    }

    // Try to fetch from Coursera's public API
    try {
      const courseRes = await axios.get("https://www.coursera.org/api/courses.v1", {
        params: {
          q: "search",
          query: search,
          limit: 12,
          fields: "name,photoUrl,description,slug,difficultyLevel,primaryLanguages,estimatedClassWorkload,instructors,partnerIds",
        }
      })

      const elements = courseRes.data.elements || []

      // Format and return course data
      const formatted = elements.map((course: any) => {
        const instructor = course.instructors?.[0]?.fullName || "Coursera Instructor"
        const partner = course.partnerIds?.[0] || "Coursera Partner"
        
        return {
          id: course.id,
          title: course.name,
          description: course.description || "No description provided.",
          thumbnail: course.photoUrl || "/placeholder.svg",
          level: course.difficultyLevel || "Unknown",
          duration: course.estimatedClassWorkload || "Varies",
          category: course.primaryLanguages?.join(", ") || "General",
          provider: partner,
          rating: (Math.random() * 5).toFixed(1),
          students: Math.floor(Math.random() * 10000),
          price: 0,
          certificate: "Included",
          instructor: instructor,
          slug: course.slug,
        }
      })

      return NextResponse.json({ 
        results: formatted,
        total: elements.length,
        page: 1,
        limit: 12
      })
    } catch (err: any) {
      console.error("Coursera API error:", err.response?.data || err.message)
      // Return demo courses if API call fails
      return NextResponse.json({ 
        results: demoCourses,
        total: demoCourses.length,
        page: 1,
        limit: 12
      })
    }
  } catch (err) {
    console.error("Unhandled error:", err)
    // Return demo courses if any other error occurs
    return NextResponse.json({ 
      results: demoCourses,
      total: demoCourses.length,
      page: 1,
      limit: 12
    })
  }
}

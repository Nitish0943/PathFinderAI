import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlaneTakeoff, ChevronRight, Star, BookOpen, Users, LayoutGrid } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col bg-[#010817] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]"></div>
          <div className="grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)] h-full w-full opacity-20">
            {Array.from({ length: 800 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-blue-900/30"></div>
            ))}
          </div>
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center px-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800/50 backdrop-blur-sm text-sm font-medium text-blue-400">
            <PlaneTakeoff className="h-3.5 w-3.5 text-blue-500" />
            <span>AI-Powered Career Guidance for India</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-blue-500 to-green-500">
            Your AI-Powered Career Journey Starts Here
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl">
            Discover your perfect career path with personalized learning recommendations and expert guidance tailored
            for the Indian job market.
          </p>

          <div className="mt-10 w-full max-w-xl relative">
            <div className="relative flex rounded-lg border border-blue-800/50 bg-blue-950/30 backdrop-blur-sm overflow-hidden">
              <Input
                type="text"
                placeholder="Search for jobs, courses, or skills..."
                className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4"
              />
              <Button type="submit" className="rounded-l-none h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2">
              <Link href="/dashboard">
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-800/50 bg-transparent text-white hover:bg-blue-900/20"
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Recommendations",
                description:
                  "Get personalized job and course recommendations based on your skills and the Indian job market.",
                icon: <LayoutGrid className="h-8 w-8 text-orange-400" />,
                color: "border-orange-800/30 bg-orange-950/30",
              },
              {
                title: "Industry-Recognized Learning",
                description: "Follow structured learning paths with certifications valued by top Indian employers.",
                icon: <BookOpen className="h-8 w-8 text-green-400" />,
                color: "border-green-800/30 bg-green-950/30",
              },
              {
                title: "AI Career Guidance",
                description: "Get personalized career advice tailored to India's unique job market and industries.",
                icon: <Users className="h-8 w-8 text-blue-400" />,
                color: "border-blue-800/30 bg-blue-950/30",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative rounded-xl border ${feature.color} p-6 transition-all duration-300`}
              >
                <div className="relative h-full flex flex-col">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="text-blue-500 text-sm font-medium mb-2">FEATURED COURSES</div>
            <h2 className="text-3xl font-bold">Most Popular Courses</h2>
            <p className="text-gray-400 mt-2">Start your journey with our top-rated learning paths</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Full Stack Web Development",
                description: "Master MERN stack development with projects relevant to Indian startups",
                category: "Development",
                icon: "code",
                weeks: "24 weeks",
                level: "Intermediate",
                students: "75k+",
                rating: 4.9,
              },
              {
                title: "Data Science & AI",
                description: "Learn data science with case studies from Indian companies",
                category: "AI/ML",
                icon: "database",
                weeks: "20 weeks",
                level: "Advanced",
                students: "62k+",
                rating: 4.8,
              },
              {
                title: "Digital Marketing",
                description: "Master digital marketing strategies for the Indian market",
                category: "Marketing",
                icon: "design",
                weeks: "12 weeks",
                level: "All Levels",
                students: "58k+",
                rating: 4.9,
              },
              {
                title: "Cloud Computing AWS",
                description: "Become an AWS certified architect with India-specific case studies",
                category: "Cloud",
                icon: "cloud",
                weeks: "16 weeks",
                level: "Intermediate",
                students: "44k+",
                rating: 4.7,
              },
            ].map((course, index) => (
              <div key={index} className="relative rounded-xl border border-blue-800/30 bg-blue-950/30 overflow-hidden">
                <div className="p-4 border-b border-blue-800/30 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                    {course.category === "Development" && <code className="text-xs">&lt;/&gt;</code>}
                    {course.category === "AI/ML" && (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400"></div>
                    )}
                    {course.category === "Marketing" && (
                      <div className="w-4 h-4 transform rotate-45 border-2 border-blue-400"></div>
                    )}
                    {course.category === "Cloud" && <div className="w-4 h-2 border-2 rounded-sm border-blue-400"></div>}
                  </div>
                  <span className="text-sm text-blue-400">{course.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.weeks}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {course.level}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-blue-800/50 bg-transparent text-white hover:bg-blue-900/20 gap-2"
            >
              Browse All Courses
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="text-blue-500 text-sm font-medium mb-2">TESTIMONIALS</div>
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="text-gray-400 mt-2">
              Join thousands of professionals who have transformed their careers with PathFinderAI India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Software Engineer at Amazon",
                company: "Previously at TCS",
                avatar: "/placeholder.svg?height=60&width=60",
                testimonial:
                  "PathFinderAI's personalized approach helped me transition from a service-based company to a product role. The AI-driven learning path was exactly what I needed to upskill and crack the interviews!",
                rating: 5,
              },
              {
                name: "Priya Patel",
                role: "Data Scientist at Flipkart",
                company: "Previously at Infosys",
                avatar: "/placeholder.svg?height=60&width=60",
                testimonial:
                  "The AI recommendations were spot-on! It helped me identify the exact skills I needed to break into data science. Now I'm earning twice my previous salary and loving my work.",
                rating: 5,
              },
              {
                name: "Vikram Singh",
                role: "Product Manager at Swiggy",
                company: "Previously at Cognizant",
                avatar: "/placeholder.svg?height=60&width=60",
                testimonial:
                  "From coding to product management, PathFinderAI guided me through every step. The mentorship feature was particularly helpful in preparing for Indian tech interviews.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="relative rounded-xl border border-blue-800/30 bg-blue-950/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-blue-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-400 text-sm">"{testimonial.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-blue-800/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "15k+", label: "Career Transitions" },
              { value: "92%", label: "Placement Rate" },
              { value: "300+", label: "Indian Companies" },
              { value: "40k+", label: "Active Users" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-500">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-blue-800/30 bg-blue-950/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <PlaneTakeoff className="h-5 w-5 text-orange-500" />
                PathFinderAI India
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Empowering Indian careers through AI-driven guidance and personalized learning paths.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Integration
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-800/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">© 2024 PathFinderAI India. All rights reserved.</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

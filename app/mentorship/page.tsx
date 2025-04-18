import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { AICareerChatbot } from "@/components/mentorship/ai-career-chatbot"

export const metadata: Metadata = {
  title: "AI Career Advisor - PathFinderAI India",
  description: "Get personalized career guidance for the Indian job market.",
}

export default function MentorshipPage() {
  return (
    <div className="flex flex-col bg-[#010817] text-white min-h-screen">
      <PageHeader
        title="Your AI Career Guide for India"
        description="Chat with our AI to get personalized career guidance, skill recommendations, and insights into India's job market."
        gradient="from-blue-600 to-indigo-600"
      />

      <AICareerChatbot />
    </div>
  )
}

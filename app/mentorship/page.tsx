import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AICareerChatbot } from "@/components/mentorship/ai-career-chatbot";

export const metadata: Metadata = {
  title: "AI Career Advisor - PathFinderAI India",
  description: "Get personalized career guidance for the Indian job market.",
};

export default function MentorshipPage() {
  return (
    // The body tag (from layout.tsx) and globals.css will handle the overall background
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Your AI Career Guide for India"
        description="Chat with our AI to get personalized career guidance, skill recommendations, and insights into India's job market."
        gradient="from-blue-600 to-indigo-600 dark:from-blue-500/20 dark:to-indigo-500/20" // Gradient adjusted
      />

      {/* AICareerChatbot needs to be theme-aware internally */}
      {/* Its container might be styled within the component itself or rely on the page's container */}
      <div className="flex-grow"> {/* Added flex-grow to help AICareerChatbot fill space if needed */}
        <AICareerChatbot />
      </div>
    </div>
  );
}
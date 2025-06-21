import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { JobsContainer } from "@/components/jobs/jobs-container";
import { RecommendationSection } from "@/components/recommendations/recommendation-section";

export const metadata: Metadata = {
  title: "Jobs - PathFinderAI India",
  description: "Explore jobs tailored to your skills and career goals in India.",
};

export default function JobsPage() {
  return (
    // The body tag (from layout.tsx) and globals.css will handle the overall background
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Discover Top Jobs Across India"
        description="AI-matched opportunities from leading Indian companies and global organizations."
        gradient="from-orange-600 to-pink-600 dark:from-orange-500/20 dark:to-pink-500/20" // Gradient adjusted for potential light mode
      />

       <div className="container px-4 py-8 space-y-8">
         <RecommendationSection
            type="jobs"
            title="Jobs Recommended For You"
            apiUrl="/api/recommendations/jobs"
            itemComponent="JobCard" // Ensure JobCard is theme-aware
            limit={5}
            emptyMessage="Complete your profile or explore below to get personalized recommendations!"
        />
        <JobsContainer /> {/* Ensure JobsContainer and its children are theme-aware */}
      </div>
    </div>
  );
}
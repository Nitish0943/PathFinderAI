// app/jobs/page.tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { JobsContainer } from "@/components/jobs/jobs-container";
import { RecommendationSection } from "@/components/recommendations/recommendation-section"; // Import the new component


export const metadata: Metadata = {
  title: "Jobs - PathFinderAI India",
  description: "Explore jobs tailored to your skills and career goals in India.",
};

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#010817] light:bg-[#f8fafc]">
      <PageHeader
        title="Discover Top Jobs Across India"
        description="AI-matched opportunities from leading Indian companies and global organizations."
        gradient="from-orange-600 to-pink-600 dark:from-orange-600/20 dark:to-pink-600/20"
      />

       <div className="container px-4 py-8 space-y-8"> {/* Add container and spacing */}

         {/* --- Add Recommendation Section --- */}
         <RecommendationSection
            type="jobs"
            title="Jobs Recommended For You"
            apiUrl="/api/recommendations/jobs"
            itemComponent="JobCard"
            limit={5} // Show a few more jobs maybe
            emptyMessage="Complete your profile or explore below to get personalized recommendations!"
        />
        {/* --- End Recommendation Section --- */}

        {/* Existing Jobs Container (for browsing/searching all) */}
        <JobsContainer />
      </div>
    </div>
  );
}
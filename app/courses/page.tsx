// app/courses/page.tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CoursesContainer } from "@/components/courses/courses-container";
import { RecommendationSection } from "@/components/recommendations/recommendation-section"; // Import the new component

export const metadata: Metadata = {
  title: "Courses - PathFinderAI India",
  description: "Recommended learning for your career path in India.",
};

export default function CoursesPage() {
  // Filters for the main course container (searching/filtering all courses)
  // Note: These filters are NOT directly used by the RecommendationSection,
  // which gets its tailored list from its dedicated API.
  const filters = {
    search: "",
    category: "",
    level: "",
    duration: "",
    price: [0, 100000], // Example range
    rating: 0,
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-[#010817] light:bg-[#f8fafc]">
      <PageHeader
        title="Upskill for India's Growing Industries"
        description="Courses and certifications recognized by top Indian employers and global companies."
        gradient="from-green-600 to-teal-600 dark:from-green-600/20 dark:to-teal-600/20"
      />

      <div className="container px-4 py-8 space-y-8"> {/* Add container and spacing */}

        {/* --- Add Recommendation Section --- */}
        <RecommendationSection
            type="courses"
            title="Courses Recommended For You"
            apiUrl="/api/recommendations/courses"
            itemComponent="CourseCard"
            limit={3} // Show fewer items at the top maybe
            emptyMessage="Complete your profile or explore below to get personalized recommendations!"
        />
        {/* --- End Recommendation Section --- */}


        {/* Existing Courses Container (for browsing/searching all) */}
        {/* Pass filters if CoursesContainer uses them for its own fetch/display */}
        <CoursesContainer filters={filters} />

      </div>
    </div>
  );
}
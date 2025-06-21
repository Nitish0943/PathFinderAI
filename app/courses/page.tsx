import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CoursesContainer } from "@/components/courses/courses-container";
import { RecommendationSection } from "@/components/recommendations/recommendation-section";

export const metadata: Metadata = {
  title: "Courses - PathFinderAI India",
  description: "Recommended learning for your career path in India.",
};

export default function CoursesPage() {
  const filters = {
    search: "",
    category: "",
    level: "",
    duration: "",
    price: [0, 100000],
    rating: 0,
  };

  return (
    // The body tag (from layout.tsx) and globals.css will handle the overall background
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Upskill for India's Growing Industries"
        description="Courses and certifications recognized by top Indian employers and global companies."
        gradient="from-green-600 to-teal-600 dark:from-green-500/20 dark:to-teal-500/20" // Gradient adjusted
      />

      <div className="container px-4 py-8 space-y-8">
        <RecommendationSection
            type="courses"
            title="Courses Recommended For You"
            apiUrl="/api/recommendations/courses"
            itemComponent="CourseCard" // Ensure CourseCard is theme-aware
            limit={3}
            emptyMessage="Complete your profile or explore below to get personalized recommendations!"
        />
        <CoursesContainer filters={filters} /> {/* Ensure CoursesContainer and its children are theme-aware */}
      </div>
    </div>
  );
}
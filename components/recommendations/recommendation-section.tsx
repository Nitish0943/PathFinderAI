// components/recommendations/recommendation-section.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { CourseCard } from '@/components/courses/course-card';
import { JobCard } from '@/components/jobs/job-card';
import { Loader2, AlertTriangle, Info } from 'lucide-react'; // Added Info icon

interface RecommendationSectionProps {
  type: 'courses' | 'jobs';
  title: string;
  apiUrl: string; // e.g., '/api/recommendations/courses'
  itemComponent: 'CourseCard' | 'JobCard';
  emptyMessage?: string;
  limit?: number;
}

export function RecommendationSection({
  type,
  title,
  apiUrl,
  itemComponent,
  emptyMessage = `No ${type} recommendations available right now. Explore all ${type}!`,
  limit = 3 // Default limit for sections
}: RecommendationSectionProps) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch only when Clerk is loaded and user is signed in
    if (!isLoaded || !isSignedIn) {
        // If Clerk is loaded but not signed in, don't attempt fetch, maybe show message?
        if (isLoaded && !isSignedIn) {
            setIsLoading(false);
            // Optionally set an info message instead of error
            // setError("Sign in to see personalized recommendations.");
        } else {
             setIsLoading(true); // Still waiting for Clerk
        }
        return;
    }

    const fetchRecs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication token not available.");

        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
             // Handle 404 (profile not found) gracefully
             if (response.status === 404 || errorData.message?.includes('profile')) {
                 console.log(`RecSection (${type}): Profile not found, skipping recs.`);
                 setError(null); // Not really an error for this component, handled by redirect elsewhere
                 setRecommendations([]); // Ensure empty
             } else {
                 throw new Error(errorData.error || `Failed to fetch ${type}: ${response.statusText}`);
             }
        } else {
            const data = await response.json();
            setRecommendations(data.recommendations || []);
             console.log(`RecSection (${type}): Fetched ${data.recommendations?.length || 0} items.`);
        }
      } catch (err: any) {
        console.error(`RecSection (${type}): Error fetching recommendations:`, err);
        setError(err.message || `Could not load ${type} recommendations.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecs();
  }, [apiUrl, getToken, type, isSignedIn, isLoaded]); // Add isSignedIn/isLoaded dependencies

  if (!isLoaded) {
    return <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />; // Small loader while waiting for auth
  }

  // Don't show section if loading or not signed in (or profile missing, indicated by empty recs + no error)
  if (isLoading) {
     return (
         <section className="mb-8 p-4 rounded-lg border border-dashed border-border/50">
             <h2 className="text-xl font-semibold mb-4 text-muted-foreground">{title}</h2>
             <div className="flex justify-center items-center h-20">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
             </div>
         </section>
     );
  }

  if (error) {
      return (
         <section className="mb-8 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
             <h2 className="text-xl font-semibold mb-2 text-destructive">{title}</h2>
             <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5"/>
                <span>{error}</span>
             </div>
         </section>
      );
  }

   // Only render content if signed in and no error and recommendations exist
  if (isSignedIn && recommendations.length > 0) {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          {itemComponent === 'CourseCard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, limit).map(course => (
                <CourseCard key={course.id} course={{ ...course, progress: 0, badge: course.isPresetMatch ? "Top Match" : "Recommended" }} viewMode="grid" />
              ))}
            </div>
          )}
          {itemComponent === 'JobCard' && (
            <div className="space-y-4">
              {recommendations.slice(0, limit).map(job => (
                <JobCard key={job.id} job={{ ...job, featured: true }} />
              ))}
            </div>
          )}
        </section>
      );
  }

  // Optional: Show a message if signed in but no recommendations found (and no error)
  if (isSignedIn && recommendations.length === 0 && !error) {
     return (
         <section className="mb-8 p-4 rounded-lg border border-dashed border-border/50">
             <h2 className="text-xl font-semibold mb-4 text-muted-foreground">{title}</h2>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-5 w-5"/>
                <span>{emptyMessage}</span>
             </div>
         </section>
     );
  }


  return null; // Don't render anything if not signed in or loading failed silently
}
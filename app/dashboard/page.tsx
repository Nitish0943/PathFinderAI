// app/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Correctly import both hooks
import { useUser, useAuth } from '@clerk/nextjs';
import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { JobMatches } from "@/components/dashboard/job-matches";
import { CourseProgress } from "@/components/dashboard/course-progress";
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  // Get getToken directly from the hook at the component top level
  const { getToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'checking_profile' | 'error' | 'redirecting_register' | 'redirecting_signin' | 'authorized'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- useCallback for checkProfile, depends on getToken ---
  const checkProfile = useCallback(async () => {
    // Guard clause: Ensure required auth state and getToken exist before proceeding
    if (!isSignedIn || !user || !getToken) {
        console.warn("checkProfile called before auth ready or getToken available.");
        // Optionally set an error or just return if called prematurely
        // setStatus('error');
        // setErrorMessage('Authentication context not ready.');
        return;
    }

    console.log("Dashboard: Checking profile status...");
    setStatus('checking_profile');
    setErrorMessage(null);

    try {
        const token = await getToken(); // Call the function obtained from the hook
        if (!token) {
            throw new Error("Authentication token could not be retrieved.");
        }
        console.log("Dashboard: Got token for profile check.");

        const response = await fetch('/api/profile/status', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 404) {
            console.log("Dashboard: Profile not found (404). Redirecting to register.");
            setStatus('redirecting_register');
            router.replace('/register'); // Use replace
            return;
        }
        if (response.status === 401) {
             // This might indicate a server-side issue with the token or session
             throw new Error("Unauthorized session checking profile status (401). Please log in again.");
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to check profile: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.exists) {
            console.log("Dashboard: Profile exists. Authorizing dashboard.");
            setStatus('authorized'); // Profile exists, dashboard can load fully
        } else {
            console.log("Dashboard: Profile does not exist (API Check). Redirecting to /register.");
            setStatus('redirecting_register');
            router.replace('/register');
        }
    } catch (err: any) {
        console.error("Dashboard: Error during checkProfile:", err);
        setErrorMessage(err.message || "Could not verify profile status.");
        setStatus('error');
    }
  }, [isSignedIn, user, getToken, router]); // Add getToken to dependencies


  // --- Main Effect Hook ---
  useEffect(() => {
    console.log(`Dashboard Effect: isLoaded=${isLoaded}, isSignedIn=${isSignedIn}, status=${status}`);

    if (!isLoaded) {
        if (status !== 'loading') setStatus('loading');
        return; // Wait for Clerk
    }

    if (!isSignedIn) {
        if (status !== 'redirecting_signin') {
            console.log("Dashboard: Not signed in, redirecting...");
            setStatus('redirecting_signin');
            router.replace('/sign-in?redirect_url=/dashboard');
        }
        return; // Redirecting
    }

    // If Clerk is loaded and user is signed in:
    if (isSignedIn && user) {
        // Check profile only if we are in the initial loading state
        if (status === 'loading') {
            checkProfile(); // Call the memoized check function
        }
        // If status is 'authorized', 'error', 'redirecting_*', the effect has done its job for now
    }

  }, [isLoaded, isSignedIn, user, router, status, checkProfile]); // Add checkProfile to dependencies


  // --- Render Logic (No changes needed here from previous version) ---

  if (status === 'loading' || status === 'checking_profile' || status === 'redirecting_register' || status === 'redirecting_signin') {
    let loadingMessage = 'Loading Dashboard...';
    if (status === 'checking_profile') loadingMessage = 'Checking profile...';
    if (status === 'redirecting_register') loadingMessage = 'Redirecting to registration...';
    if (status === 'redirecting_signin') loadingMessage = 'Redirecting to sign in...';
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] w-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">{loadingMessage}</span>
        </div>
     );
  }

  if (status === 'error') {
     return (
       <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] w-full text-center px-4">
         <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
         <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Dashboard</h2>
         <p className="text-muted-foreground max-w-md">
            {errorMessage || "We couldn't load dashboard information. Please try refreshing."}
         </p>
         <Button onClick={() => window.location.reload()} variant="outline" className="mt-6"> Refresh Page </Button>
       </div>
     );
  }

  if (status === 'authorized' && isSignedIn) {
      return (
        <div className="flex flex-col gap-8 py-8 dark:bg-gray-900/50 light:bg-gray-100 flex-grow">
          <PageHeader
            title="Your AI Career Dashboard"
            description="Track your progress and get personalized insights." // Simplified description
             gradient="from-purple-600/80 to-blue-600/80 dark:from-purple-600/20 dark:to-blue-600/20"
          />
          <div className="container px-4 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <DashboardStats /> </div>
            {/* Other Dashboard Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6"> <JobMatches /> <CourseProgress /> </div>
              <div className="space-y-6"> <UpcomingSessions /> <AiInsights /> </div>
            </div>
          </div>
        </div>
      );
  }

  // Fallback
   return (
       <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Initializing...</span>
       </div>
   );
}
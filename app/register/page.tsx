// app/register/page.tsx
'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs'; // Import useAuth for token
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Loader2, AlertCircle, AlertTriangle } from "lucide-react"; // Added AlertTriangle

// Interface for form data state (using strings for input binding)
interface CareerFormData {
  name: string;
  email: string;
  age: string;
  education: string;
  year_of_study: string;
  gpa: string;
  interests: string;
  skills: string;
  soft_skills: string;
  certifications: string;
  goals: string;
  study_hours: string;
  timeline: string;
  learning_type: string;
  language: string;
  feedback: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth(); // Get token function
  const [formData, setFormData] = useState<CareerFormData>({
    name: '', email: '', age: '', education: '', year_of_study: '', gpa: '',
    interests: '', skills: '', soft_skills: '', certifications: '', goals: '',
    study_hours: '', timeline: '', learning_type: '', language: '', feedback: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for clarity
  const [error, setError] = useState<string | null>(null);
  // Status for initial check: loading_clerk, checking_db, ready, error
  const [pageStatus, setPageStatus] = useState<'loading_clerk' | 'checking_db' | 'ready' | 'error'>('loading_clerk');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component did mount
  }, []);

  // Effect for initial checks and redirects
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    console.log(`RegisterPage Effect: isLoaded=${isLoaded}, isSignedIn=${isSignedIn}, user=${!!user}, status=${pageStatus}`);

    if (!isLoaded) {
      setPageStatus('loading_clerk');
      return;
    }

    if (!isSignedIn) {
      console.log("RegisterPage: Not signed in, redirecting to sign-in.");
      router.replace('/sign-in?redirect_url=/register'); // Use replace
      return;
    }

    // Only check DB if Clerk is loaded, user is signed in, and we haven't checked yet
    if (isSignedIn && user && pageStatus === 'loading_clerk') {
      setPageStatus('checking_db');
      console.log("RegisterPage: Checking if profile exists for user:", user.id);

      const checkProfileExists = async () => {
        try {
            const token = await getToken(); // Get token for API call
             if (!token) throw new Error("Authentication token not available.");

            const response = await fetch('/api/profile/status', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json().catch(()=>({}));
                throw new Error(errData.error || `Failed to check profile status: ${response.status}`);
            }

            const data = await response.json();

            if (data.exists) {
                console.log("RegisterPage: Profile already exists, redirecting to dashboard.");
                router.replace('/dashboard'); // Already registered
            } else {
                console.log("RegisterPage: Profile does not exist. Ready for form input.");
                // Pre-fill from Clerk if form isn't already partially filled
                setFormData(prev => ({
                    ...prev,
                    name: prev.name || user.fullName || '',
                    email: prev.email || user.primaryEmailAddress?.emailAddress || '',
                }));
                setPageStatus('ready'); // Ready to show the form
            }
        } catch (err: any) {
            console.error("RegisterPage: Error checking profile status:", err);
            setError(err.message || "Could not verify registration status. Please try again later.");
            setPageStatus('error');
        }
      };

      checkProfileExists();
    } else if (isLoaded && !isSignedIn) {
        // Handles case where user signs out while on page maybe?
        setPageStatus('error'); // Or redirect again
        setError("You are not signed in.");
    }

  }, [isClient, isLoaded, isSignedIn, user, router, getToken, pageStatus]); // Added getToken & pageStatus


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Re-check authentication status directly before submitting
    if (!isSignedIn || !user) {
        setError('Authentication error. Please ensure you are logged in and refresh.');
        console.warn("RegisterPage Submit: User not signed in or user object missing.");
        return;
    }

    setIsSubmitting(true);

    try {
      const token = await getToken(); // Get fresh token for submission
       if (!token) throw new Error("Authentication token not available for submission.");

      console.log("RegisterPage: Submitting form data for user:", user.id);
      const response = await fetch('/api/career-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send token with request
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors returned by the API
         throw new Error(result.error || result.details || `Form submission failed: ${response.statusText}`);
      }

      console.log("RegisterPage: Form submitted successfully, redirecting to dashboard...");
      router.push('/dashboard'); // Use push here as it's a successful forward navigation

    } catch (err: any) {
      console.error('RegisterPage: Form submission error:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic based on pageStatus ---

  if (pageStatus === 'loading_clerk' || pageStatus === 'checking_db') {
      return (
          <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] w-full">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <span className="ml-3 text-muted-foreground">
                {pageStatus === 'loading_clerk' ? 'Initializing...' : 'Checking registration status...'}
             </span>
          </div>
      );
  }

   if (pageStatus === 'error') {
     return (
       <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] w-full text-center px-4">
         <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
         <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
         <p className="text-muted-foreground max-w-md">
            {error || "Something went wrong. Please try refreshing the page."}
         </p>
         <Button onClick={() => window.location.reload()} variant="outline" className="mt-6">
             Refresh Page
         </Button>
       </div>
     );
  }

  // Render the form only when status is 'ready'
  if (pageStatus === 'ready' && isSignedIn) {
      return (
        <div className="flex flex-col min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950/50 light:bg-gray-50">
          <PageHeader
            title="Complete Your Career Profile"
            description="Help us understand your goals and preferences to provide personalized guidance."
            gradient="from-teal-600/80 to-cyan-600/80 dark:from-teal-600/20 dark:to-cyan-600/20"
          />

          <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-card dark:bg-gray-800/40 light:bg-white p-6 md:p-10 rounded-xl shadow-xl border border-border/50"
            >
              <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white border-b border-border/30 pb-3">
                About You & Your Aspirations
              </h2>

              {/* Submission Error Display Area */}
              {error && !isSubmitting && ( // Only show submit error when not actively submitting
                <div className="mb-6 p-4 text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700/60 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0"/>
                  <span>{error}</span>
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                {/* --- Sections and Fields --- */}

                {/* Basic Info */}
                <div className="md:col-span-2"> <h3 className="text-lg font-medium mb-1 text-foreground dark:text-gray-200">Basic Information</h3> </div>
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1.5">Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name"/>
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1.5">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com"/>
                </div>
                <div>
                  <Label htmlFor="age" className="block text-sm font-medium text-muted-foreground mb-1.5">Age</Label>
                  <Input id="age" name="age" type="number" min="10" max="100" value={formData.age} onChange={handleChange} placeholder="e.g., 22"/>
                </div>
                 <div>
                    <Label htmlFor="language" className="block text-sm font-medium text-muted-foreground mb-1.5">Preferred Language</Label>
                    <Input id="language" name="language" value={formData.language} onChange={handleChange} placeholder="e.g., English, Hindi"/>
                </div>

                {/* Education */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-border/20"> <h3 className="text-lg font-medium mb-1 text-foreground dark:text-gray-200">Education</h3> </div>
                <div>
                  <Label htmlFor="education" className="block text-sm font-medium text-muted-foreground mb-1.5">Highest Qualification</Label>
                  <Input id="education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g., B.Tech CSE, MBA"/>
                </div>
                <div>
                  <Label htmlFor="year_of_study" className="block text-sm font-medium text-muted-foreground mb-1.5">Year of Study/Graduation</Label>
                  <Input id="year_of_study" name="year_of_study" value={formData.year_of_study} onChange={handleChange} placeholder="e.g., 3rd Year, 2023"/>
                </div>
                <div>
                  <Label htmlFor="gpa" className="block text-sm font-medium text-muted-foreground mb-1.5">CGPA / Percentage <span className="text-xs">(Optional)</span></Label>
                  <Input id="gpa" name="gpa" type="text" value={formData.gpa} onChange={handleChange} placeholder="e.g., 8.5 or 85%"/>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="certifications" className="block text-sm font-medium text-muted-foreground mb-1.5">Relevant Certifications <span className="text-xs">(Optional)</span></Label>
                  <Textarea id="certifications" name="certifications" rows={2} value={formData.certifications} onChange={handleChange} placeholder="List any relevant certifications, comma-separated"/>
                </div>

                {/* Skills & Interests */}
                 <div className="md:col-span-2 mt-4 pt-4 border-t border-border/20"> <h3 className="text-lg font-medium mb-1 text-foreground dark:text-gray-200">Skills & Interests</h3> </div>
                <div className="md:col-span-2">
                  <Label htmlFor="interests" className="block text-sm font-medium text-muted-foreground mb-1.5">Areas of Interest <span className="text-red-500">*</span> <span className="text-xs">(comma-separated)</span></Label>
                  <Textarea id="interests" name="interests" rows={3} value={formData.interests} onChange={handleChange} required placeholder="e.g., Artificial Intelligence, Web Development, Stock Market"/>
                </div>
                 <div className="md:col-span-2">
                  <Label htmlFor="skills" className="block text-sm font-medium text-muted-foreground mb-1.5">Technical Skills <span className="text-red-500">*</span> <span className="text-xs">(comma-separated)</span></Label>
                  <Textarea id="skills" name="skills" rows={3} value={formData.skills} onChange={handleChange} required placeholder="e.g., Python, React, SQL, AWS, Data Analysis, Excel"/>
                </div>
                 <div className="md:col-span-2">
                  <Label htmlFor="soft_skills" className="block text-sm font-medium text-muted-foreground mb-1.5">Key Soft Skills <span className="text-xs">(comma-separated)</span></Label>
                  <Textarea id="soft_skills" name="soft_skills" rows={2} value={formData.soft_skills} onChange={handleChange} placeholder="e.g., Communication, Teamwork, Problem Solving"/>
                </div>

                {/* Goals & Preferences */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-border/20"> <h3 className="text-lg font-medium mb-1 text-foreground dark:text-gray-200">Career Goals & Preferences</h3> </div>
                <div className="md:col-span-2">
                  <Label htmlFor="goals" className="block text-sm font-medium text-muted-foreground mb-1.5">Primary Career Goals <span className="text-xs">(comma-separated)</span></Label>
                  <Textarea id="goals" name="goals" rows={2} value={formData.goals} onChange={handleChange} placeholder="e.g., Become Data Scientist, Lead a Product Team"/>
                </div>
                <div>
                  <Label htmlFor="study_hours" className="block text-sm font-medium text-muted-foreground mb-1.5">Weekly Study/Upskilling Hours</Label>
                  <Input id="study_hours" name="study_hours" value={formData.study_hours} onChange={handleChange} placeholder="e.g., 5-10 hours, 10+ hours"/>
                </div>
                <div>
                  <Label htmlFor="timeline" className="block text-sm font-medium text-muted-foreground mb-1.5">Desired Job Timeline</Label>
                  <Input id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} placeholder="e.g., Immediately, 3-6 months"/>
                </div>
                 <div className="md:col-span-2">
                  <Label htmlFor="learning_type" className="block text-sm font-medium text-muted-foreground mb-1.5">Preferred Learning Style</Label>
                  <Input id="learning_type" name="learning_type" value={formData.learning_type} onChange={handleChange} placeholder="e.g., Videos, Projects, Reading, Live Classes"/>
                </div>

                {/* Feedback */}
                 <div className="md:col-span-2 mt-4 pt-4 border-t border-border/20"> <h3 className="text-lg font-medium mb-1 text-foreground dark:text-gray-200">Anything Else? <span className="text-xs">(Optional)</span></h3> </div>
                <div className="md:col-span-2">
                  <Label htmlFor="feedback" className="block text-sm font-medium text-muted-foreground mb-1.5">Share relevant info or specific requests</Label>
                  <Textarea id="feedback" name="feedback" rows={3} value={formData.feedback} onChange={handleChange} />
                </div>
              </div> {/* End Form Fields Grid */}

              {/* Submit Button */}
              <div className="mt-10 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px] px-6 py-2.5 text-base">
                  {isSubmitting ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                   ) : (
                       'Submit & Go to Dashboard'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  // Fallback if not loading, not error, not ready (shouldn't usually happen)
  return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] w-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
    );
}
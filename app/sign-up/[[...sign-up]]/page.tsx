// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - PathFinderAI India",
  description: "Create an account to start your AI-powered career journey with PathFinderAI India.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950/50 light:bg-gray-50">
       <SignUp
         path="/sign-up"
         routing="path"
         signInUrl="/sign-in"
         afterSignUpUrl="/dashboard" // Send directly to dashboard now
         // afterSignInUrl="/dashboard" // Keep if needed
       />
    </div>
  );
}
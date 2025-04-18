// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next"; // Optional: Add metadata

export const metadata: Metadata = {
  title: "Sign In - PathFinderAI India",
  description: "Sign in to access your PathFinderAI India dashboard.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950/50 light:bg-gray-50">
       {/* This component renders Clerk's prebuilt sign-in UI */}
       <SignIn
    path="/sign-in"
    routing="path"
    signUpUrl="/sign-up"
    afterSignInUrl="/dashboard" // <-- OK if this is ALWAYS the destination after login
 />
    </div>
  );
}
// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Ensure this is your consolidated globals.css
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PathFinderAI India - AI-Powered Career Guidance",
  description:
    "Discover your perfect career path with personalized learning recommendations and expert guidance powered by advanced AI.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* The body tag will now get its background from globals.css based on the theme */}
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* Removed dark:bg-[#010817] light:bg-[#f8fafc] from this div */}
            <div className="min-h-screen flex flex-col">
              <Navbar />
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

// Remove the duplicate import if app/globals.css is already being handled
// import './globals.css'
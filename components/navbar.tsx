"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PlaneTakeoff, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/courses", label: "Courses" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/30 backdrop-blur-lg bg-background/60 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative">
            <PlaneTakeoff className="h-6 w-6 text-india-saffron dark:text-orange-500" />
            <motion.div
              className="absolute inset-0 rounded-full bg-orange-500/30 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 dark:from-orange-400 dark:via-blue-400 dark:to-green-400">
            PathFinderAI India
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 dark:from-orange-400 dark:via-blue-400 dark:to-green-400"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 dark:from-orange-400 dark:via-blue-400 dark:to-green-400 hover:from-orange-600 hover:via-blue-600 hover:to-green-600 dark:hover:from-orange-500 dark:hover:via-blue-500 dark:hover:to-green-500 text-white border-0"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex flex-col gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full justify-start">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 dark:from-orange-400 dark:via-blue-400 dark:to-green-400 hover:from-orange-600 hover:via-blue-600 hover:to-green-600 dark:hover:from-orange-500 dark:hover:via-blue-500 dark:hover:to-green-500 text-white border-0">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

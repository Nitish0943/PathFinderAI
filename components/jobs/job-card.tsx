// components/jobs/job-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase, ChevronDown, ChevronUp, Star, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: number | string; // Allow string ID too
    title: string;
    company: string | null; // Allow null
    logo?: string | null; // Make logo optional
    location: string | null; // Allow null
    salary: string | null; // Allow null
    type: string | null; // Allow null
    experience: string | null; // Allow null
    // Ensure skills is treated as potentially undefined or an array
    skills?: string[] | null | undefined;
    posted?: string | null; // Make posted optional
    description: string | null; // Allow null
    featured?: boolean; // Make featured optional
  };
}

export function JobCard({ job }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Provide default values for potentially null fields for display
  const companyName = job.company || "N/A";
  const location = job.location || "N/A";
  const salary = job.salary || "Not Specified";
  const jobType = job.type || "N/A";
  const posted = job.posted || "N/A";
  const description = job.description || "No description provided.";
  const logoUrl = job.logo || "/placeholder.svg?text=" + (companyName[0] || '?'); // Basic fallback

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border overflow-hidden transition-all duration-300",
        job.featured ? "border-orange-600/50 bg-orange-950/30" : "border-orange-800/30 bg-orange-950/20",
        isHovered ? "shadow-lg shadow-orange-900/20" : "shadow-sm",
      )}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Featured badge */}
      {job.featured && (
        <div className="absolute top-0 right-0 z-10"> {/* Ensure z-index */}
          <div className="bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">Featured</div>
        </div>
      )}

      <div className="relative p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Company logo */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-md bg-card flex items-center justify-center overflow-hidden border border-border/50">
              <Image
                // Use a key for potential URL changes, though id is better if stable
                key={logoUrl}
                src={logoUrl}
                alt={`${companyName} logo`}
                width={40}
                height={40}
                className="object-contain"
                // Add error handling for images if needed
                onError={(e) => { e.currentTarget.src = '/placeholder.svg?text=?'; }} // Fallback on error
              />
            </div>
          </div>

          {/* Job details */}
          <div className="flex-grow space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-foreground dark:text-white">{job.title}</h3>
                {job.featured && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <p>{companyName}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="truncate" title={location}>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="truncate" title={salary}>{salary}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="truncate" title={jobType}>{jobType}</span>
              </div>
            </div>

            {/* Skills Badges */}
            {/* --- FIX: Check if job.skills is an array before mapping --- */}
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((skill) => ( // Use || [] to provide default empty array
                <Badge
                  key={skill} // Assuming skills are unique strings for keys
                  variant="secondary"
                  className="bg-orange-900/30 text-orange-300 hover:bg-orange-800/40 border border-orange-800/50 text-xs" // Fine-tuned styles
                >
                  {skill}
                </Badge>
              ))}
              {/* Optionally show something if skills array is empty/missing */}
              {(!job.skills || job.skills.length === 0) && (
                 <p className="text-xs text-muted-foreground italic">No specific skills listed.</p>
              )}
            </div>
            {/* --- End FIX --- */}


            {/* Description (Conditional) */}
            {isExpanded && (
              <motion.div
                className="pt-4 text-muted-foreground prose prose-sm prose-invert max-w-none" // Added prose for basic formatting
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium mb-2 text-foreground dark:text-gray-300">Job Description</h4>
                 {/* Render description safely */}
                <p className="text-sm">{description}</p>
              </motion.div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/20 mt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                 {posted !== "N/A" && ( // Only show if posted date exists
                    <>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Posted {posted}</span>
                    </>
                 )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-800/50 bg-transparent text-orange-300 hover:bg-orange-900/30 hover:text-orange-200 h-8 px-3" // Adjusted size/padding
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <> <ChevronUp className="mr-1 h-4 w-4" /> Less </>
                  ) : (
                    <> <ChevronDown className="mr-1 h-4 w-4" /> More </>
                  )}
                </Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-4"> {/* Adjusted size/padding */}
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
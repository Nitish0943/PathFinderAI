"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MentorCardProps {
  mentor: {
    id: number
    name: string
    role: string
    company: string
    avatar: string
    expertise: string[]
    experience: string
    rate: string
    availability: string
    rating: number
    reviews: number
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative h-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300",
        isHovered ? "shadow-lg shadow-primary/5" : "shadow-sm",
      )}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glowing border effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-400/10 dark:to-blue-400/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className={cn(
              "w-24 h-24 rounded-full overflow-hidden border-2 transition-all duration-300",
              isHovered
                ? "border-purple-500 dark:border-purple-400 shadow-lg shadow-purple-500/20 dark:shadow-purple-400/20"
                : "border-border",
            )}
          >
            <Image src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} fill className="object-cover" />
          </div>
        </div>

        {/* Mentor details */}
        <div className="space-y-3 w-full">
          <div>
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {mentor.role} at {mentor.company}
            </p>
          </div>

          {/* Expertise */}
          <div className="flex flex-wrap justify-center gap-2">
            {mentor.expertise.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                +{mentor.expertise.length - 3}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{mentor.rating}</span>
            <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{mentor.experience}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{mentor.availability}</span>
            </div>
          </div>

          {/* Rate and action */}
          <div className="pt-3 flex flex-col gap-2">
            <div className="font-semibold">{mentor.rate}</div>
            <Button className="w-full">Book a Session</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for upcoming sessions
const upcomingSessions = [
  {
    id: 1,
    mentor: "Sarah Johnson",
    role: "Senior Product Manager",
    date: "Tomorrow",
    time: "10:00 AM - 11:00 AM",
    type: "Video Call",
  },
  {
    id: 2,
    mentor: "Michael Chen",
    role: "Staff Engineer",
    date: "Friday, Jun 21",
    time: "3:00 PM - 4:00 PM",
    type: "Video Call",
  },
]

export function UpcomingSessions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled mentorship sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="p-3 rounded-lg border border-border/50 bg-card/50 space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <h3 className="font-medium">{session.mentor}</h3>
                  <p className="text-sm text-muted-foreground">{session.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{session.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Video className="h-3 w-3" />
                    <span>{session.type}</span>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">No upcoming sessions scheduled</div>
          )}

          {upcomingSessions.length > 0 && (
            <Button variant="outline" className="w-full mt-2">
              Schedule New Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

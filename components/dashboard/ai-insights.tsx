"use client"

import { motion } from "framer-motion"
import { Lightbulb, TrendingUp, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for AI insights
const aiInsights = [
  {
    id: 1,
    title: "Skill Gap Analysis",
    description: "You're missing key skills for your target role. Consider learning React Native.",
    icon: Lightbulb,
    action: "View Skills",
  },
  {
    id: 2,
    title: "Career Trajectory",
    description: "Your profile matches the Senior Developer career path. 2 years to reach target.",
    icon: TrendingUp,
    action: "View Path",
  },
  {
    id: 3,
    title: "Achievement Unlocked",
    description: "You've completed 5 courses in Frontend Development. Keep it up!",
    icon: Award,
    action: "View Badges",
  },
]

export function AiInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Personalized career recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              className="p-3 rounded-lg border border-border/50 bg-card/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex gap-3">
                <div className="mt-0.5 p-2 rounded-full bg-primary/10 text-primary">
                  <insight.icon className="h-4 w-4" />
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="font-medium">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>

                  <Button variant="link" className="p-0 h-auto text-sm" asChild>
                    <a href="#" className="flex items-center gap-1">
                      {insight.action}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

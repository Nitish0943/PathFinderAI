"use client"

import { motion } from "framer-motion"
import { TrendingUp, Award, BookOpen } from "lucide-react"

const stats = [
  {
    title: "Career Score",
    value: "78/100",
    change: "+12 pts",
    trend: "up",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400",
  },
  {
    title: "Skills Mastered",
    value: "14",
    change: "+3 this month",
    trend: "up",
    icon: Award,
    color: "from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400",
  },
  {
    title: "Learning Hours",
    value: "42",
    change: "12 hrs this week",
    trend: "up",
    icon: BookOpen,
    color: "from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400",
  },
]

export function DashboardStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>

            <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  )
}

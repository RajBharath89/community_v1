"use client"

import { Users, UserX, Crown, Heart, Star, Sparkles } from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import { StatsCardsSkeleton } from "./skeleton-loaders"

const stats = [
  {
    title: "Active Users",
    count: 5,
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
  },
  {
    title: "Inactive Users",
    count: 1,
    icon: UserX,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500",
  },
  {
    title: "Priests",
    count: 1,
    icon: Star,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500",
  },
  {
    title: "Volunteers",
    count: 2,
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-500",
  },
  {
    title: "Trustees",
    count: 1,
    icon: Crown,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500",
  },
  {
    title: "Devotees",
    count: 1,
    icon: Sparkles,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-500",
  },
]

export function StatsCards() {
  const { isLoading } = useUserStore()

  if (isLoading) {
    return <StatsCardsSkeleton />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer group transform-gpu will-change-transform"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.bgColor} group-hover:w-2 transition-all duration-300`}
            />

            <div className="flex items-center justify-between pl-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground transition-colors duration-300 origin-left">
                  {stat.count}
                </p>
              </div>
              <Icon
                className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${stat.color} flex-shrink-0 ml-1 sm:ml-2 group-hover:rotate-12 transition-all duration-300 transform-gpu`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

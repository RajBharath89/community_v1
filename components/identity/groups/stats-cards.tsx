"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useGroupStore } from "@/stores/group-store"
import { Users, CheckCircle, XCircle } from "lucide-react"

export function StatsCards() {
  const { groups, isLoading } = useGroupStore()

  const totalGroups = groups.length
  const activeGroups = groups.filter((group) => group.status === "Active").length
  const inactiveGroups = groups.filter((group) => group.status === "Inactive").length
  const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0)

  const stats = [
    {
      title: "Total Groups",
      value: totalGroups,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Groups",
      value: activeGroups,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-500",
    },
    {
      title: "Inactive Groups",
      value: inactiveGroups,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-500",
    },
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
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
                <p className="text-xl sm:text-2xl font-bold text-card-foreground transition-colors duration-300 origin-left">
                  {stat.value}
                </p>
              </div>
              <Icon
                className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0 ml-2 group-hover:rotate-12 transition-all duration-300 transform-gpu`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

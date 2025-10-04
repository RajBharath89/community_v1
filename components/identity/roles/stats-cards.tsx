"use client"

import { useRolesStore } from "@/stores/roles-store"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Shield, 
  Users, 
  UserX, 
  Crown, 
  Settings, 
  Heart 
} from "lucide-react"

export function StatsCards() {
  const { stats, isLoading } = useRolesStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Roles",
      value: stats.totalRoles,
      icon: <Shield className="h-5 w-5" />,
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Active Roles",
      value: stats.activeRoles,
      icon: <Users className="h-5 w-5" />,
      bgColor: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Inactive Roles",
      value: stats.inactiveRoles,
      icon: <UserX className="h-5 w-5" />,
      bgColor: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    {
      title: "System Roles",
      value: stats.systemRoles,
      icon: <Crown className="h-5 w-5" />,
      bgColor: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Custom Roles",
      value: stats.customRoles,
      icon: <Settings className="h-5 w-5" />,
      bgColor: "bg-orange-500",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Heart className="h-5 w-5" />,
      bgColor: "bg-pink-500",
      textColor: "text-pink-600",
      bgLight: "bg-pink-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.bgColor}`} />

          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                <div className={`${stat.textColor} group-hover:rotate-12 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

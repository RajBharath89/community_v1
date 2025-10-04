"use client"

import { LifeBuoy, Clock, CheckCircle, AlertTriangle, XCircle, MessageSquare } from "lucide-react"
import { useSupportTicketStore } from "@/stores/support-ticket-store"
import { StatsCardsSkeleton } from "./skeleton-loaders"

export function StatsCards() {
  const { tickets, isLoading } = useSupportTicketStore()

  if (isLoading) {
    return <StatsCardsSkeleton />
  }

  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "Open").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length
  const closedTickets = tickets.filter((t) => t.status === "Closed").length
  const pendingTickets = tickets.filter((t) => t.status === "Pending").length
  const criticalTickets = tickets.filter((t) => t.priority === "Critical").length
  const highPriorityTickets = tickets.filter((t) => t.priority === "High").length
  const totalComments = tickets.reduce((sum, ticket) => sum + ticket.comments.length, 0)

  const stats = [
    {
      title: "Total Tickets",
      count: totalTickets,
      icon: LifeBuoy,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500",
    },
    {
      title: "Open",
      count: openTickets,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500",
    },
    {
      title: "In Progress",
      count: inProgressTickets,
      icon: MessageSquare,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Resolved",
      count: resolvedTickets,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500",
    },
    {
      title: "Closed",
      count: closedTickets,
      icon: XCircle,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-500",
    },
    {
      title: "Critical",
      count: criticalTickets,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500",
    },
  ]

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

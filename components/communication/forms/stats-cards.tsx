"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, TrendingUp, CheckCircle } from "lucide-react"
import { useFormStore } from "@/stores/form-store"

export function StatsCards() {
  console.log(" StatsCards component rendering")

  const { forms } = useFormStore()

  console.log(" Forms from store:", forms?.length || 0)

  const totalForms = forms.length
  const publishedForms = forms.filter((form) => form.status === "Published").length
  const totalSubmissions = forms.reduce((sum, form) => sum + form.submissionCount, 0)
  const avgCompletionRate =
    forms.length > 0 ? forms.reduce((sum, form) => sum + form.completionRate, 0) / forms.length : 0

  const stats = [
    {
      title: "Total Forms",
      value: totalForms.toString(),
      icon: FileText,
      bgColor: "bg-red-500",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Published Forms",
      value: publishedForms.toString(),
      icon: CheckCircle,
      bgColor: "bg-green-500",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Submissions",
      value: totalSubmissions.toString(),
      icon: Users,
      bgColor: "bg-purple-500",
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Completion Rate",
      value: `${avgCompletionRate.toFixed(1)}%`,
      icon: TrendingUp,
      bgColor: "bg-orange-500",
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group"
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.bgColor}`} />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div
                className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}
              >
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-700`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Heart,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from "lucide-react"
import { useDonationStore } from "@/stores/donation-store"
import { useRouter } from "next/navigation"

export function DonationSummaryCard() {
  const { donations } = useDonationStore()
  const router = useRouter()

  const totalDonations = donations.length
  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const approvedDonations = donations.filter(d => d.status === "approved").length
  const pendingDonations = donations.filter(d => d.status === "pending").length
  const rejectedDonations = donations.filter(d => d.status === "rejected").length
  const reviewedDonations = donations.filter(d => d.status === "reviewed").length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Donations",
      value: totalDonations.toString(),
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount),
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Approved",
      value: approvedDonations.toString(),
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Pending",
      value: pendingDonations.toString(),
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => router.push("/contributions/donation-requests")}
          className="flex-1 bg-red-500 hover:bg-red-600"
        >
          <Heart className="h-4 w-4 mr-2" />
          Make a Donation
        </Button>
        <Button 
          onClick={() => router.push("/contributions/donation-tracker")}
          variant="outline"
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Track Donations
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Donation Status Overview</CardTitle>
          <CardDescription>
            Current status of all donation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{approvedDonations}</p>
              <p className="text-sm text-green-600">Approved</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{pendingDonations}</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{reviewedDonations}</p>
              <p className="text-sm text-blue-600">Reviewed</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{rejectedDonations}</p>
              <p className="text-sm text-red-600">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

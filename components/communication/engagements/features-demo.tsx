"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  Building, 
  Car, 
  Heart, 
  Calendar, 
  Cloud,
  Users,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle
} from "lucide-react"

export function FeaturesDemo() {
  const features = [
    {
      title: "Delivery Confirmation",
      description: "Require recipients to confirm receipt of engagements",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "Email and in-app confirmation methods",
        "Customizable confirmation deadlines",
        "Automated reminder system",
        "Auto-escalation for non-responders",
        "Confirmation rate tracking"
      ]
    },
    {
      title: "Venue Capacity Management",
      description: "Track venue limits and manage registrations",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "Multiple venue types (temple hall, outdoor, etc.)",
        "Real-time capacity tracking",
        "Waitlist management",
        "Registration deadlines",
        "Overflow venue options"
      ]
    },
    {
      title: "Parking Information",
      description: "Manage parking spots and shuttle services",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "On-site and off-site parking options",
        "Handicap parking spots",
        "Shuttle service coordination",
        "Pickup location management",
        "Parking instructions and rules"
      ]
    },
    {
      title: "Donation Integration",
      description: "Connect engagements with donation system",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      features: [
        "Multiple donation types (general, project, seva)",
        "Fundraising goal tracking",
        "Payment method management",
        "Tax-deductible receipt options",
        "Anonymous donation support"
      ]
    },
    {
      title: "Calendar Sync",
      description: "Google Calendar and Outlook integration",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Google Calendar integration",
        "Microsoft Outlook sync",
        "iCal feed generation",
        "Automatic event creation",
        "Calendar reminder management"
      ]
    },
    {
      title: "Weather Integration",
      description: "Weather-dependent event planning",
      icon: Cloud,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      features: [
        "Real-time weather monitoring",
        "Weather-dependent event types",
        "Automated weather alerts",
        "Backup plan management",
        "Temperature and condition tracking"
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">New Engagement Features</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Enhanced features for better engagement management, venue coordination, and attendee experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className={`${feature.borderColor} ${feature.bgColor} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full ${feature.color} ${feature.borderColor} hover:${feature.bgColor}`}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admin Benefits Section */}
      <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Admin Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Increased Donations</h3>
              <p className="text-sm text-gray-600">Better donation tracking and management</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Better Planning</h3>
              <p className="text-sm text-gray-600">Venue and capacity management</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Time Savings</h3>
              <p className="text-sm text-gray-600">Automated processes and integrations</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Risk Mitigation</h3>
              <p className="text-sm text-gray-600">Weather alerts and backup plans</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-green-800 flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span>Implementation Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">All Features Implemented</span>
              <Badge variant="outline" className="text-green-600 border-green-300">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Admin Interface Ready</span>
              <Badge variant="outline" className="text-green-600 border-green-300">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Data Models Updated</span>
              <Badge variant="outline" className="text-green-600 border-green-300">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Integration Points</span>
              <Badge variant="outline" className="text-green-600 border-green-300">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

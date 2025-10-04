"use client"

import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"

const contactInfo = [
  {
    type: "Helpline",
    icon: Phone,
    details: [
      { label: "Emergency", value: "+91-98765-43210" },
      { label: "General Inquiry", value: "+91-98765-43211" },
      { label: "Donation Support", value: "+91-98765-43212" }
    ]
  },
  {
    type: "Email",
    icon: Mail,
    details: [
      { label: "General", value: "info@ABC.org" },
      { label: "Support", value: "support@ABC.org" },
      { label: "Donations", value: "donations@ABC.org" }
    ]
  },
  {
    type: "WhatsApp",
    icon: MessageCircle,
    details: [
      { label: "Main", value: "+91-98765-43210" },
      { label: "Support", value: "+91-98765-43211" }
    ]
  },
  {
    type: "Address",
    icon: MapPin,
    details: [
      { label: "Main Temple", value: "ABC Baba Temple, Shirdi" },
      { label: "Office", value: "ABC Office, Mumbai, Netherlands" }
    ]
  },
  {
    type: "Timings",
    icon: Clock,
    details: [
      { label: "Temple Hours", value: "5:00 AM - 10:00 PM" },
      { label: "Office Hours", value: "9:00 AM - 6:00 PM" }
    ]
  }
]

export function ContactDropdown() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
          <Phone className="h-5 w-5" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-96 p-0">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Contact Information</span>
          </div>
        </div>
        <Separator />
        
        <div className="max-h-96 overflow-y-auto">
          {contactInfo.map((section, index) => (
            <div key={section.type}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <section.icon className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium text-sm">{section.type}</h4>
                </div>
                <div className="space-y-2">
                  {section.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">{detail.label}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {index < contactInfo.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        
        <Separator />
        <div className="p-2">
          <div className="text-center text-sm text-blue-600 cursor-pointer hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors">
            Need immediate help? Call Emergency Line
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useDonationStore } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Repeat,
  Receipt,
  Info,
} from "lucide-react"
import { toast } from "sonner"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "reviewed":
      return <FileText className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "reviewed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "online":
      return <CreditCard className="h-4 w-4" />
    case "offline":
      return <Receipt className="h-4 w-4" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

export function DonationTracker() {
  const { donations } = useDonationStore()
  const [searchPhone, setSearchPhone] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!searchPhone.trim()) {
      toast.error("Please enter a phone number")
      return
    }

    const results = donations.filter(donation => 
      donation.donor.phone && donation.donor.phone.toLowerCase().includes(searchPhone.toLowerCase())
    )

    setSearchResults(results)
    setHasSearched(true)

    if (results.length === 0) {
      toast.info("No donations found for this phone number")
    } else {
      toast.success(`Found ${results.length} donation(s)`)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-50 to-orange-45 rounded-xl p-4 sm:p-6 border border-red-100 mb-6">
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-70">
          <img
            src="/sai-baba-receiving-offerings-and-donations-with-ha.png"
            alt="Sai Baba receiving offerings"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
          />
        </div>
        <div className="relative z-10 ml-20 sm:ml-28 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Track Donations</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
            Check the status of your donations
          </p>
        </div>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Donations</span>
          </CardTitle>
          <CardDescription>
            Enter the mobile number you used when making your donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="searchPhone" className="sr-only">
                Mobile Number
              </Label>
              <Input
                id="searchPhone"
                type="tel"
                placeholder="Enter your mobile number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No donations found for the mobile number "{searchPhone}". 
                Please check your mobile number and try again.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Your Donations ({searchResults.length})
                </h2>
                <Badge variant="outline">
                  {searchResults.length} donation{searchResults.length !== 1 ? 's' : ''} found
                </Badge>
              </div>

              <div className="space-y-4">
                {searchResults.map((donation) => (
                  <Card key={donation.id} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Donation Details */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Donation #{donation.id}</h3>
                            <Badge className={getStatusColor(donation.status)}>
                              {getStatusIcon(donation.status)}
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">
                                Amount: {formatCurrency(donation.amount, donation.currency)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              {getTypeIcon(donation.type)}
                              <span className="text-sm text-gray-600">
                                {donation.type.charAt(0).toUpperCase() + donation.type.slice(1)} donation
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Date: {formatDate(donation.date)}
                              </span>
                            </div>

                            {donation.frequency !== "one-time" && (
                              <div className="flex items-center space-x-2">
                                <Repeat className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {donation.frequency.charAt(0).toUpperCase() + donation.frequency.slice(1)} recurring
                                </span>
                              </div>
                            )}

                            {donation.paymentMethod && (
                              <div className="flex items-center space-x-2">
                                {donation.type === "online" ? (
                                  <CreditCard className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Receipt className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-sm text-gray-600 capitalize">
                                  {donation.paymentMethod.replace("-", " ")}
                                </span>
                              </div>
                            )}
                            {donation.receiptFile && (
                              <div className="flex items-center space-x-2">
                                <Receipt className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-blue-600">
                                  Receipt: {donation.receiptFile}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Donor Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Donor Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{donation.donor.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{donation.donor.email}</span>
                            </div>
                            {donation.donor.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{donation.donor.phone}</span>
                              </div>
                            )}
                            {donation.donor.street && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {donation.donor.street}, {donation.donor.city}, {donation.donor.country}
                                </span>
                              </div>
                            )}
                          </div>

                          {donation.donor.message && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Message:</span>
                              </div>
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                "{donation.donor.message}"
                              </p>
                            </div>
                          )}

                          {donation.adminNotes && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-gray-700">Admin Notes:</span>
                              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                {donation.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status-specific information */}
                      {donation.status === "approved" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Your donation has been approved and processed successfully.
                            </span>
                          </div>
                        </div>
                      )}

                      {donation.status === "rejected" && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">
                              Your donation was not approved. Please contact us for more information.
                            </span>
                          </div>
                        </div>
                      )}

                      {donation.status === "pending" && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                              Your donation is under review. We will notify you once it's processed.
                            </span>
                          </div>
                        </div>
                      )}

                      {donation.status === "reviewed" && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Your donation has been reviewed and is awaiting final approval.
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useDonationStore, type DonationRequest } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  Upload,
  Repeat,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Gift,
} from "lucide-react"

interface DonationTableContentProps {
  searchTerm: string
  statusFilter: string
  typeFilter: string
  viewMode: "table" | "card"
}

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
    case "received":
      return <CheckCircle className="h-4 w-4" />
    case "distributed":
      return <CheckCircle className="h-4 w-4" />
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
    case "received":
      return "bg-purple-100 text-purple-800"
    case "distributed":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "online":
      return <CreditCard className="h-4 w-4" />
    case "offline":
      return <Upload className="h-4 w-4" />
    case "material":
      return <Gift className="h-4 w-4" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

const getFrequencyIcon = (frequency: string) => {
  switch (frequency) {
    case "one-time":
      return <DollarSign className="h-4 w-4" />
    default:
      return <Repeat className="h-4 w-4" />
  }
}

export function DonationTableContent({ searchTerm, statusFilter, typeFilter, viewMode }: DonationTableContentProps) {
  const { filteredDonations, openDrawer, deleteDonation, updateDonation, toggleSort, sortField, sortDirection } = useDonationStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const donations = filteredDonations()
  const totalPages = Math.ceil(donations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDonations = donations.slice(startIndex, endIndex)

  const handleSort = (field: string) => {
    toggleSort(field)
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
      month: "short",
      day: "numeric",
    })
  }

  if (viewMode === "card") {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentDonations.map((donation) => (
            <Card key={donation.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {donation.donor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-medium">{donation.donor.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{donation.donor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(donation.type)}
                    {getFrequencyIcon(donation.frequency)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  {donation.type === "material" ? (
                    <div className="text-lg font-bold text-blue-600">
                      {donation.materialQuantity} Items
                      <div className="text-xs text-gray-500 capitalize">
                        {donation.materialType}
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(donation.amount, donation.currency)}
                    </span>
                  )}
                  <Badge className={`${getStatusColor(donation.status)} flex items-center gap-1`}>
                    {getStatusIcon(donation.status)}
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(donation.date)}</span>
                  </div>
                  {donation.donor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{donation.donor.phone}</span>
                    </div>
                  )}
                  {donation.donor.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{donation.donor.city}, {donation.donor.country}</span>
                    </div>
                  )}
                </div>

                {donation.type === "material" && donation.materialDescription && (
                  <div className="bg-blue-50 p-2 rounded-md">
                    <p className="text-xs text-blue-600 font-medium">
                      {donation.materialDescription}
                    </p>
                    {donation.dropOffDate && (
                      <p className="text-xs text-blue-500 mt-1">
                        Drop-off: {formatDate(donation.dropOffDate)} at {donation.dropOffTime}
                      </p>
                    )}
                  </div>
                )}

                {donation.isRecurring && donation.nextPaymentDate && (
                  <div className="bg-blue-50 p-2 rounded-md">
                    <p className="text-xs text-blue-600 font-medium">
                      Next payment: {formatDate(donation.nextPaymentDate)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDrawer("view", donation)}
                    className="flex-1 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                  {donation.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateDonation(donation.id, { status: "approved" })
                        }}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateDonation(donation.id, { status: "rejected" })
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {donation.type === "material" && donation.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateDonation(donation.id, { status: "received" })
                      }}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Received
                    </Button>
                  )}
                  {donation.type === "material" && donation.status === "received" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateDonation(donation.id, { status: "distributed" })
                      }}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Distributed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {donations.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No donations found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "All Status" || typeFilter !== "All Types"
                ? "Try adjusting your search criteria"
                : "Start by adding your first donation"}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("donorName")}>
              <div className="flex items-center gap-2">
                Donor
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
              <div className="flex items-center gap-2">
                Amount/Items
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              <div className="flex items-center gap-2">
                Date
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDonations.map((donation) => (
            <TableRow key={donation.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-xs">
                      {donation.donor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{donation.donor.name}</div>
                    <div className="text-xs text-muted-foreground">{donation.donor.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {donation.type === "material" ? (
                  <div className="font-medium text-blue-600">
                    {donation.materialQuantity} Items
                    <div className="text-xs text-gray-500 capitalize">
                      {donation.materialType}
                    </div>
                  </div>
                ) : (
                  <div className="font-medium text-green-600">
                    {formatCurrency(donation.amount, donation.currency)}
                  </div>
                )}
                {donation.isRecurring && (
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    Recurring
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(donation.type)}
                  <span className="text-sm capitalize">{donation.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFrequencyIcon(donation.frequency)}
                  <span className="text-sm capitalize">{donation.frequency.replace("-", " ")}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(donation.status)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(donation.status)}
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatDate(donation.date)}</div>
                {donation.nextPaymentDate && (
                  <div className="text-xs text-blue-600">
                    Next: {formatDate(donation.nextPaymentDate)}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDrawer("view", donation)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {donation.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateDonation(donation.id, { status: "approved" })}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateDonation(donation.id, { status: "rejected" })}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {donation.type === "material" && donation.status === "approved" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateDonation(donation.id, { status: "received" })}
                      className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      title="Mark as Received"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {donation.type === "material" && donation.status === "received" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateDonation(donation.id, { status: "distributed" })}
                      className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      title="Mark as Distributed"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {donations.length === 0 && (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No donations found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "All Status" || typeFilter !== "All Types"
              ? "Try adjusting your search criteria"
              : "Start by adding your first donation"}
          </p>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useDonationStore, type DonationRequest, type Donor } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Save,
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
  MessageSquare,
  Receipt,
  Eye,
  EyeOff,
  Gift,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const frequencies = ["one-time", "weekly", "monthly", "quarterly", "yearly"]
const paymentMethods = ["stripe", "paypal", "razorpay", "bank-transfer", "cheque", "cash"]
const statuses = ["pending", "reviewed", "approved", "rejected", "received", "distributed"]
const currencies = ["INR", "USD", "EUR", "GBP"]

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

export function DonationDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedDonation,
    closeDrawer,
    addDonation,
    updateDonation,
    deleteDonation,
  } = useDonationStore()

  const [formData, setFormData] = useState<Partial<DonationRequest>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedDonation) {
      setFormData(selectedDonation)
    } else {
      setFormData({
        type: "online",
        donor: {
          id: "",
          name: "",
          email: "",
          phone: "",
          street: "",
          zipcode: "",
          city: "",
          country: "",
          message: ""
        },
        amount: 0,
        currency: "INR",
        frequency: "one-time",
        paymentMethod: "stripe",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        isRecurring: false
      })
    }
    setIsEditing(drawerMode === "create" || drawerMode === "edit")
    setValidationErrors({})
  }, [selectedDonation, drawerMode])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.donor?.name?.trim()) {
      errors.donorName = "Donor name is required"
    }

    if (!formData.donor?.email?.trim()) {
      errors.donorEmail = "Donor email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donor.email)) {
      errors.donorEmail = "Please enter a valid email address"
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0"
    }

    if (!formData.date?.trim()) {
      errors.date = "Date is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    if (drawerMode === "create") {
      const newDonation: DonationRequest = {
        ...(formData as DonationRequest),
        id: Date.now().toString(),
        donor: {
          ...formData.donor!,
          id: formData.donor?.id || Date.now().toString()
        }
      }
      addDonation(newDonation)
    } else if (drawerMode === "edit" && selectedDonation) {
      updateDonation(selectedDonation.id, {
        ...formData,
        donor: {
          ...formData.donor!,
          id: formData.donor?.id || selectedDonation.donor.id
        }
      })
    }
    closeDrawer()
  }

  const handleDelete = () => {
    if (selectedDonation && confirm("Are you sure you want to delete this donation?")) {
      deleteDonation(selectedDonation.id)
      closeDrawer()
    }
  }

  const handleCancel = () => {
    closeDrawer()
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
    <>
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-full sm:w-[500px] lg:w-[600px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {drawerMode === "create" && "Review New Donation"}
                  {drawerMode === "view" && "Donation Review"}
                  {drawerMode === "edit" && "Update Donation Status"}
                </SheetTitle>
                <SheetDescription>
                  {drawerMode === "create" && "Review and approve/reject a donation request"}
                  {drawerMode === "view" && "Review donation details and make approval decision"}
                  {drawerMode === "edit" && "Update donation status and send notifications"}
                </SheetDescription>
              </div>
              {drawerMode === "view" && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Donor Information Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg">
                    {formData.donor?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "D"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                {!isEditing ? (
                  <div>
                    <h3 className="text-lg font-semibold">{formData.donor?.name}</h3>
                    <p className="text-sm text-muted-foreground">{formData.donor?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(formData.status || "")}>
                        {getStatusIcon(formData.status || "")}
                        {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(formData.type || "")}
                        {formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="donorName" className="text-sm font-medium">
                        Donor Name *
                      </Label>
                      <Input
                        id="donorName"
                        value={formData.donor?.name || ""}
                        onChange={(e) => setFormData((prev) => ({ 
                          ...prev, 
                          donor: { ...prev.donor!, name: e.target.value }
                        }))}
                        placeholder="Enter donor name"
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.donorName && <p className="text-sm text-red-600">{validationErrors.donorName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donorEmail" className="text-sm font-medium">
                        Donor Email *
                      </Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        value={formData.donor?.email || ""}
                        onChange={(e) => setFormData((prev) => ({ 
                          ...prev, 
                          donor: { ...prev.donor!, email: e.target.value }
                        }))}
                        placeholder="Enter donor email"
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.donorEmail && <p className="text-sm text-red-600">{validationErrors.donorEmail}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Donation Details Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Donation Details</h4>
              
              {formData.type === "material" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="materialType" className="text-sm font-medium">
                        Material Type
                      </Label>
                      {isEditing ? (
                        <Select
                          value={formData.materialType || ""}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, materialType: value }))}
                        >
                          <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            <SelectValue placeholder="Select material type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="worship">Worship Materials</SelectItem>
                            <SelectItem value="food">Food & Prasad</SelectItem>
                            <SelectItem value="clothing">Clothing & Textiles</SelectItem>
                            <SelectItem value="decorative">Decorative Items</SelectItem>
                            <SelectItem value="furniture">Furniture & Equipment</SelectItem>
                            <SelectItem value="books">Books & Educational</SelectItem>
                            <SelectItem value="garden">Garden & Plants</SelectItem>
                            <SelectItem value="medical">Medical & Health</SelectItem>
                            <SelectItem value="technology">Technology & Digital</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground capitalize">
                          {formData.materialType || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="materialQuantity" className="text-sm font-medium">
                        Quantity
                      </Label>
                      {isEditing ? (
                        <Input
                          id="materialQuantity"
                          type="number"
                          value={formData.materialQuantity || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, materialQuantity: parseInt(e.target.value) || 1 }))}
                          placeholder="Enter quantity"
                          className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                        />
                      ) : (
                        <p className="mt-1 text-lg font-semibold text-blue-600">
                          {formData.materialQuantity || 0} Items
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialDescription" className="text-sm font-medium">
                      Material Description
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="materialDescription"
                        value={formData.materialDescription || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, materialDescription: e.target.value }))}
                        placeholder="Describe the materials being donated"
                        rows={3}
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formData.materialDescription || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="materialCondition" className="text-sm font-medium">
                        Condition
                      </Label>
                      {isEditing ? (
                        <Select
                          value={formData.materialCondition || ""}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, materialCondition: value as any }))}
                        >
                          <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used - Good</SelectItem>
                            <SelectItem value="good">Used - Good</SelectItem>
                            <SelectItem value="fair">Used - Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground capitalize">
                          {formData.materialCondition || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropOffDate" className="text-sm font-medium">
                        Drop-off Date
                      </Label>
                      {isEditing ? (
                        <Input
                          id="dropOffDate"
                          type="date"
                          value={formData.dropOffDate || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dropOffDate: e.target.value }))}
                          className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formData.dropOffDate ? formatDate(formData.dropOffDate) : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                  {formData.dropOffTime && (
                    <div className="space-y-2">
                      <Label htmlFor="dropOffTime" className="text-sm font-medium">
                        Drop-off Time
                      </Label>
                      {isEditing ? (
                        <Select
                          value={formData.dropOffTime}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, dropOffTime: value }))}
                        >
                          <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formData.dropOffTime || "Not specified"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium">
                      Amount *
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                          placeholder="Enter amount"
                          className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                        />
                        {validationErrors.amount && <p className="text-sm text-red-600">{validationErrors.amount}</p>}
                      </>
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {formData.amount ? formatCurrency(formData.amount, formData.currency || "INR") : "Not specified"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Currency
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{formData.currency || "INR"}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as "online" | "offline" }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Online
                          </div>
                        </SelectItem>
                        <SelectItem value="offline">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Offline
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getTypeIcon(formData.type || "")}
                        {formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-sm font-medium">
                    Frequency
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value as any }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            <div className="flex items-center gap-2">
                              {frequency === "one-time" ? <DollarSign className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                              {frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("-", " ")}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {formData.frequency === "one-time" ? <DollarSign className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                        {formData.frequency?.charAt(0).toUpperCase() + formData.frequency?.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {formData.type === "online" && (
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">
                    Payment Method
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value as any }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.filter(method => ["stripe", "paypal", "razorpay"].includes(method)).map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground capitalize">
                      {formData.paymentMethod || "Not specified"}
                    </p>
                  )}
                </div>
              )}

              {formData.type === "offline" && (
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">
                    Payment Method
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value as any }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.filter(method => ["bank-transfer", "cheque", "cash"].includes(method)).map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.charAt(0).toUpperCase() + method.slice(1).replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground capitalize">
                      {formData.paymentMethod?.replace("-", " ") || "Not specified"}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Date *
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.date && <p className="text-sm text-red-600">{validationErrors.date}</p>}
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formData.date ? formatDate(formData.date) : "Not specified"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge className={`${getStatusColor(formData.status || "")} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(formData.status || "")}
                        {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Contact Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.donor?.phone || ""}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      donor: { ...prev.donor!, phone: e.target.value }
                    }))}
                    placeholder="Enter phone number"
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formData.donor?.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium">
                  Street Address
                </Label>
                {isEditing ? (
                  <Input
                    id="street"
                    value={formData.donor?.street || ""}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      donor: { ...prev.donor!, street: e.target.value }
                    }))}
                    placeholder="Enter street address"
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {formData.donor?.street || "Not provided"}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.donor?.city || ""}
                      onChange={(e) => setFormData((prev) => ({ 
                        ...prev, 
                        donor: { ...prev.donor!, city: e.target.value }
                      }))}
                      placeholder="Enter city"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{formData.donor?.city || "Not provided"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-sm font-medium">
                    Zipcode
                  </Label>
                  {isEditing ? (
                    <Input
                      id="zipcode"
                      value={formData.donor?.zipcode || ""}
                      onChange={(e) => setFormData((prev) => ({ 
                        ...prev, 
                        donor: { ...prev.donor!, zipcode: e.target.value }
                      }))}
                      placeholder="Enter zipcode"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{formData.donor?.zipcode || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={formData.donor?.country || ""}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      donor: { ...prev.donor!, country: e.target.value }
                    }))}
                    placeholder="Enter country"
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{formData.donor?.country || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                {isEditing ? (
                  <Textarea
                    id="message"
                    value={formData.donor?.message || ""}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      donor: { ...prev.donor!, message: e.target.value }
                    }))}
                    placeholder="Enter donor message"
                    rows={3}
                    className="bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent resize-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5" />
                    {formData.donor?.message || "No message provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Receipt Section for Offline Donations */}
            {formData.type === "offline" && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Receipt Information</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="receiptFile" className="text-sm font-medium">
                    Receipt File
                  </Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormData((prev) => ({ ...prev, receiptFile: file.name }))
                          }
                        }}
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {formData.receiptFile || "No receipt uploaded"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recurring Information */}
            {formData.frequency !== "one-time" && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Recurring Information</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="isRecurring" className="text-sm font-medium">
                    Recurring Donation
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.isRecurring ? "true" : "false"}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, isRecurring: value === "true" }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select recurring status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      {formData.isRecurring ? "Yes" : "No"}
                    </p>
                  )}
                </div>

                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label htmlFor="nextPaymentDate" className="text-sm font-medium">
                      Next Payment Date
                    </Label>
                    {isEditing ? (
                      <Input
                        id="nextPaymentDate"
                        type="date"
                        value={formData.nextPaymentDate || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nextPaymentDate: e.target.value }))}
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formData.nextPaymentDate ? formatDate(formData.nextPaymentDate) : "Not scheduled"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin Review Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Admin Review</h4>
              
              <div className="space-y-2">
                <Label htmlFor="adminNotes" className="text-sm font-medium">
                  Review Notes
                </Label>
                {isEditing ? (
                  <Textarea
                    id="adminNotes"
                    value={formData.adminNotes || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, adminNotes: e.target.value }))}
                    placeholder="Enter review notes or comments"
                    rows={3}
                    className="bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent resize-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formData.adminNotes || "No review notes"}
                  </p>
                )}
              </div>

              {/* Template Selection for Notifications */}
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="notificationTemplate" className="text-sm font-medium">
                    Notification Template
                  </Label>
                  <Select
                    value={formData.notificationTemplate || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, notificationTemplate: value }))}
                  >
                    <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <SelectValue placeholder="Select notification template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acknowledgment">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Acknowledgment
                        </div>
                      </SelectItem>
                      <SelectItem value="rejection">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Rejection
                        </div>
                      </SelectItem>
                      <SelectItem value="clarification">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Clarification Request
                        </div>
                      </SelectItem>
                      <SelectItem value="recurring-confirmation">
                        <div className="flex items-center gap-2">
                          <Repeat className="h-4 w-4" />
                          Recurring Confirmation
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: "approved" }))
                      handleSave()
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Donation
                  </Button>
                  <Button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: "rejected" }))
                      handleSave()
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Donation
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  {drawerMode === "view" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, status: "approved" }))
                          handleSave()
                        }}
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quick Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, status: "rejected" }))
                          handleSave()
                        }}
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Quick Reject
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Donation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this donation? This action cannot be undone and will permanently remove the donation record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-primary-foreground"
            >
              Delete Donation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

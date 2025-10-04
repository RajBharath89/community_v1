"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDonationStore, type DonationRequest, type Donor } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CreditCard,
  Heart,
  Shield,
  CheckCircle,
  Info,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Repeat,
  Lock,
  Gift,
  Star,
  Receipt,
} from "lucide-react"
import { toast } from "sonner"

const frequencies = [
  { value: "one-time", label: "One-time", description: "Single donation" },
  { value: "weekly", label: "Weekly", description: "Every week" },
  { value: "monthly", label: "Monthly", description: "Every month" },
  { value: "quarterly", label: "Quarterly", description: "Every 3 months" },
  { value: "yearly", label: "Yearly", description: "Every year" },
]

const paymentMethods = [
  { value: "stripe", label: "Credit/Debit Card", description: "Visa, Mastercard, American Express" },
  { value: "razorpay", label: "UPI & Digital Wallets", description: "Google Pay, PhonePe, Paytm" },
  { value: "paypal", label: "PayPal", description: "PayPal account" },
]

const offlinePaymentMethods = [
  { value: "bank-transfer", label: "Bank Transfer", description: "Direct bank transfer" },
  { value: "cheque", label: "Cheque", description: "Cheque payment" },
  { value: "cash", label: "Cash", description: "Cash donation" },
]

const currencies = [
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
]

const presetAmounts = [100, 500, 1000, 2500, 5000, 10000]

export function DonationRequestForm() {
  const { addDonation } = useDonationStore()
  
  const [formData, setFormData] = useState({
    donor: {
      name: "",
      email: "",
      phone: "",
      street: "",
      zipcode: "",
      city: "",
      country: "India",
      message: "",
    },
    amount: 0,
    currency: "EUR",
    frequency: "one-time",
    paymentMethod: "stripe",
    donationType: "online", // "online", "offline", or "material"
    receiptFile: null as File | null,
    isAnonymous: false,
    isRecurring: false,
    // Material donation fields
    materialType: "",
    materialDescription: "",
    materialQuantity: 1,
    materialCondition: "new" as "new" | "used" | "good" | "fair",
    dropOffDate: "",
    dropOffTime: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const totalSteps = 3

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.donor.name.trim()) {
        errors.donorName = "Name is required"
      }
      if (!formData.donor.email.trim()) {
        errors.donorEmail = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donor.email)) {
        errors.donorEmail = "Please enter a valid email address"
      }
      if (formData.donationType !== "material") {
        if (!formData.amount || formData.amount <= 0) {
          errors.amount = "Please enter a valid donation amount"
        }
      } else {
        if (!formData.materialDescription.trim()) {
          errors.materialDescription = "Material description is required"
        }
        if (!formData.materialType) {
          errors.materialType = "Please select a material type"
        }
      }
    }

    if (step === 2) {
      if (formData.donationType !== "material") {
        if (!formData.paymentMethod) {
          errors.paymentMethod = "Please select a payment method"
        }
        if (formData.donationType === "offline" && !formData.receiptFile) {
          errors.receiptFile = "Please upload a receipt for offline donations"
        }
      } else {
        if (!formData.dropOffDate) {
          errors.dropOffDate = "Please select a drop-off date"
        }
        if (!formData.dropOffTime) {
          errors.dropOffTime = "Please select a drop-off time"
        }
      }
    }

    if (step === 3) {
      if (!acknowledged) {
        errors.acknowledge = "Please acknowledge the terms before submitting"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newDonation: DonationRequest = {
        id: Date.now().toString(),
        type: formData.donationType as "online" | "offline" | "material",
        donor: {
          id: Date.now().toString(),
          name: formData.isAnonymous ? "Anonymous Donor" : formData.donor.name,
          email: formData.donor.email,
          phone: formData.donor.phone,
          street: formData.donor.street,
          zipcode: formData.donor.zipcode,
          city: formData.donor.city,
          country: formData.donor.country,
          message: formData.donor.message,
        },
        amount: formData.donationType !== "material" ? formData.amount : undefined,
        currency: formData.donationType !== "material" ? formData.currency : undefined,
        frequency: formData.frequency as any,
        paymentMethod: formData.donationType !== "material" ? formData.paymentMethod as any : undefined,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        receiptFile: formData.receiptFile ? formData.receiptFile.name : undefined,
        isRecurring: formData.frequency !== "one-time",
        recurringId: formData.frequency !== "one-time" ? `rec_${Date.now()}` : undefined,
        nextPaymentDate: formData.frequency !== "one-time" ? 
          new Date(Date.now() + (formData.frequency === "weekly" ? 7 : 
                                formData.frequency === "monthly" ? 30 : 
                                formData.frequency === "quarterly" ? 90 : 365) * 24 * 60 * 60 * 1000)
            .toISOString().split("T")[0] : undefined,
        // Material donation fields
        materialType: formData.donationType === "material" ? formData.materialType : undefined,
        materialDescription: formData.donationType === "material" ? formData.materialDescription : undefined,
        materialQuantity: formData.donationType === "material" ? formData.materialQuantity : undefined,
        materialCondition: formData.donationType === "material" ? formData.materialCondition : undefined,
        dropOffDate: formData.donationType === "material" ? formData.dropOffDate : undefined,
        dropOffTime: formData.donationType === "material" ? formData.dropOffTime : undefined,
      }

      addDonation(newDonation)
      setShowSuccess(true)
      toast.success("Donation submitted successfully! Thank you for your generosity.")
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.value === currency)
    const symbol = currencyData?.symbol || currency
    return `${symbol} ${amount.toLocaleString()}`
  }

  const getCurrencySymbol = (currency: string) => {
    return currencies.find(c => c.value === currency)?.symbol || currency
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800">Donation Submitted Successfully!</h3>
                <p className="text-green-600 mt-2">
                  {formData.donationType === "material" 
                    ? `Thank you for your generous material donation of ${formData.materialQuantity} items. Your contribution will be reviewed and we will contact you to confirm the drop-off schedule.`
                    : `Thank you for your generous donation of ${formatCurrency(formData.amount, formData.currency)}. ${formData.donationType === "offline" 
                      ? " Your receipt has been submitted for review. We will process your donation and notify you once it's approved."
                      : " Your contribution helps us continue our spiritual and community services."
                    }`
                  }
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setShowSuccess(false)
                    setCurrentStep(1)
                    setFormData({
                      donor: {
                        name: "",
                        email: "",
                        phone: "",
                        street: "",
                        zipcode: "",
                        city: "",
                        country: "India",
                        message: "",
                      },
                      amount: 0,
                      currency: "INR",
                      frequency: "one-time",
                      paymentMethod: "stripe",
                      donationType: "online",
                      receiptFile: null,
                      isAnonymous: false,
                      isRecurring: false,
                      materialType: "",
                      materialDescription: "",
                      materialQuantity: 1,
                      materialCondition: "new",
                      dropOffDate: "",
                      dropOffTime: "",
                    })
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Make Another Donation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Donation Requests</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
            Submit and track donation requests
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-red-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Donation Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Donation Details</span>
                </CardTitle>
                <CardDescription>
                  Enter your donation amount and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Donation Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.donationType === "online"
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, donationType: "online" }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-9 w-9 text-gray-600" />
                          <div>
                            <p className="font-medium">Online Donation</p>
                            <p className="text-sm text-gray-600">Pay directly through our secure payment gateway</p>
                          </div>
                        </div>
                        {formData.donationType === "online" && (
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.donationType === "offline"
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, donationType: "offline" }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Receipt className="h-9 w-9 text-gray-600" />
                          <div>
                            <p className="font-medium">Offline Donation</p>
                            <p className="text-sm text-gray-600">Upload receipt from external donation platform</p>
                          </div>
                        </div>
                        {formData.donationType === "offline" && (
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.donationType === "material"
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, donationType: "material" }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Gift className="h-9 w-9 text-gray-600" />
                          <div>
                            <p className="font-medium">Material Donation</p>
                            <p className="text-sm text-gray-600">Donate materials and items to the temple</p>
                          </div>
                        </div>
                        {formData.donationType === "material" && (
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amount Selection */}
                {formData.donationType !== "material" && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Donation Amount</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={formData.amount || ""}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          amount: parseFloat(e.target.value) || 0 
                        }))}
                        className="flex-1"
                      />
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={formData.amount === amount ? "default" : "outline"}
                          onClick={() => setFormData(prev => ({ ...prev, amount }))}
                          className="h-12 text-sm"
                        >
                          {getCurrencySymbol(formData.currency)}{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    
                    {validationErrors.amount && (
                      <p className="text-sm text-red-600">{validationErrors.amount}</p>
                    )}
                  </div>
                )}

                {/* <Separator /> */}

                {/* Material Donation Fields */}
                {formData.donationType === "material" && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Material Details</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Material Type *</Label>
                        <Select value={formData.materialType} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, materialType: value }))
                        }>
                          <SelectTrigger>
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
                        {validationErrors.materialType && (
                          <p className="text-sm text-red-600">{validationErrors.materialType}</p>
                        )}
                      </div>
                      
                      {/* <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select value={formData.materialCondition} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, materialCondition: value as "new" | "used" | "good" | "fair" }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used - Good</SelectItem>
                            <SelectItem value="good">Used - Good</SelectItem>
                            <SelectItem value="fair">Used - Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Item Description *</Label>
                      <Textarea
                        value={formData.materialDescription}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          materialDescription: e.target.value 
                        }))}
                        placeholder="Describe the items you want to donate (e.g., Fresh flowers, incense sticks, rice, books, etc.)"
                        rows={3}
                      />
                      {validationErrors.materialDescription && (
                        <p className="text-sm text-red-600">{validationErrors.materialDescription}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={formData.materialQuantity}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          materialQuantity: parseInt(e.target.value) || 1 
                        }))}
                        min="1"
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Frequency Selection */}
                {formData.donationType !== "material" && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Donation Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label} — {freq.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Personal Information */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Personal Information</Label>
                  
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        isAnonymous: checked as boolean 
                      }))}
                    />
                    <Label htmlFor="isAnonymous" className="text-sm">
                      Make this donation anonymous
                    </Label>
                  </div> */}

                  {!formData.isAnonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donorName">Full Name *</Label>
                        <Input
                          id="donorName"
                          value={formData.donor.name}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            donor: { ...prev.donor, name: e.target.value }
                          }))}
                          placeholder="Enter your full name"
                        />
                        {validationErrors.donorName && (
                          <p className="text-sm text-red-600">{validationErrors.donorName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email Address *</Label>
                        <Input
                          id="donorEmail"
                          type="email"
                          value={formData.donor.email}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            donor: { ...prev.donor, email: e.target.value }
                          }))}
                          placeholder="Enter your email"
                        />
                        {validationErrors.donorEmail && (
                          <p className="text-sm text-red-600">{validationErrors.donorEmail}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="donorMessage">Message (Optional)</Label>
                    <Textarea
                      id="donorMessage"
                      value={formData.donor.message}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        donor: { ...prev.donor, message: e.target.value }
                      }))}
                      placeholder="Share a message with your donation..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method / Drop-off Scheduling */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {formData.donationType === "material" ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  <span>{formData.donationType === "material" ? "Drop-off Scheduling" : "Payment Method"}</span>
                </CardTitle>
                <CardDescription>
                  {formData.donationType === "material"
                    ? "Choose a convenient date and time to drop off your materials"
                    : "Choose your preferred payment method"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.donationType === "material" ? (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Drop-off Scheduling</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Preferred Drop-off Date *</Label>
                        <Input
                          type="date"
                          value={formData.dropOffDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dropOffDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {validationErrors.dropOffDate && (
                          <p className="text-sm text-red-600">{validationErrors.dropOffDate}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Preferred Drop-off Time *</Label>
                        <Select value={formData.dropOffTime} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, dropOffTime: value }))
                        }>
                          <SelectTrigger>
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
                        {validationErrors.dropOffTime && (
                          <p className="text-sm text-red-600">{validationErrors.dropOffTime}</p>
                        )}
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Please bring your material donations to the temple during the scheduled time. 
                        Our volunteers will be available to receive and acknowledge your generous contribution.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : formData.donationType === "online" ? (
                  <div className="grid grid-cols-1 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">{method.label}</p>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          {formData.paymentMethod === method.value && (
                            <CheckCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {offlinePaymentMethods.map((method) => (
                        <div
                          key={method.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.paymentMethod === method.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Receipt className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="font-medium">{method.label}</p>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                            {formData.paymentMethod === method.value && (
                              <CheckCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Receipt Upload Section */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Upload Receipt *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData(prev => ({ ...prev, receiptFile: file }))
                            }
                          }}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          <div className="space-y-2">
                            <Receipt className="h-8 w-8 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formData.receiptFile ? formData.receiptFile.name : "Click to upload receipt"}
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, JPG, PNG up to 10MB
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                      {validationErrors.receiptFile && (
                        <p className="text-sm text-red-600">{validationErrors.receiptFile}</p>
                      )}
                    </div>
                  </div>
                )}

                {formData.donationType !== "material" && validationErrors.paymentMethod && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{validationErrors.paymentMethod}</AlertDescription>
                  </Alert>
                )}

                {formData.donationType === "material" ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Please bring your materials during the scheduled slot. Our volunteers will assist you at the temple reception.
                    </AlertDescription>
                  </Alert>
                ) : formData.donationType === "online" ? (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      For offline donations, please upload a clear receipt or proof of payment from the external donation platform. 
                      Our team will review and approve your donation within 2-3 business days.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Review & Confirm</span>
                </CardTitle>
                <CardDescription>
                  Please review your donation details before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {formData.donationType === "material" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Donation Type:</span>
                        <span className="text-lg font-semibold text-blue-600">Material Donation</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Material Type:</span>
                        <span className="capitalize">{formData.materialType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Quantity:</span>
                        <span>{formData.materialQuantity} items</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Condition:</span>
                        <span className="capitalize">{formData.materialCondition}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Drop-off Date:</span>
                        <span>{formData.dropOffDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Drop-off Time:</span>
                        <span>{formData.dropOffTime}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Donation Amount:</span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(formData.amount, formData.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Frequency:</span>
                        <span>{frequencies.find(f => f.value === formData.frequency)?.label}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Payment Method:</span>
                        <span>
                          {formData.donationType === "online" 
                            ? paymentMethods.find(p => p.value === formData.paymentMethod)?.label
                            : offlinePaymentMethods.find(p => p.value === formData.paymentMethod)?.label
                          }
                        </span>
                      </div>
                    </>
                  )}
                  {formData.donationType === "offline" && formData.receiptFile && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Receipt File:</span>
                      <span className="text-sm text-blue-600">{formData.receiptFile.name}</span>
                    </div>
                  )}
                  {!formData.isAnonymous && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Donor Name:</span>
                      <span>{formData.donor.name}</span>
                    </div>
                  )}
                  {formData.isAnonymous && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Donation Type:</span>
                      <Badge variant="outline">Anonymous</Badge>
                    </div>
                  )}
                </div>

                {formData.donationType === "material" && formData.materialDescription && (
                  <div className="space-y-2">
                    <Label className="font-medium">Material Description:</Label>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      "{formData.materialDescription}"
                    </p>
                  </div>
                )}

                {formData.donor.message && (
                  <div className="space-y-2">
                    <Label className="font-medium">Your Message:</Label>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      "{formData.donor.message}"
                    </p>
                  </div>
                )}

                {/* Acknowledgement */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <Checkbox id="acknowledge" checked={acknowledged} onCheckedChange={(v) => setAcknowledged(!!v)} />
                    <span className="text-sm text-gray-700">
                      By submitting this donation, you agree to our <a href="#" className="underline underline-offset-2">terms of service</a> and <a href="#" className="underline underline-offset-2">privacy policy</a>. Your donation will be processed securely and you will receive a confirmation email.
                    </span>
                  </label>
                  {validationErrors.acknowledge && (
                    <p className="text-sm text-red-600 mt-2">{validationErrors.acknowledge}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !acknowledged}
                className="bg-red-500 hover:bg-red-600"
              >
                {isSubmitting ? "Processing..." : "Submit Donation"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Donation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {formData.donationType === "material" ? (
                  <>
                    <div className="text-3xl font-bold text-blue-600">
                      {formData.materialQuantity} Items
                    </div>
                    <div className="text-sm text-gray-600">
                      Material Donation
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.materialType && formData.materialType.charAt(0).toUpperCase() + formData.materialType.slice(1)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(formData.amount, formData.currency)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {frequencies.find(f => f.value === formData.frequency)?.label} donation
                    </div>
                  </>
                )}
              </div>
              
              {formData.frequency !== "one-time" && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">
                    <Repeat className="h-4 w-4 inline mr-1" />
                    Recurring donation
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Why Donate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Why Donate?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Support spiritual and community services</span>
              </div>
              <div className="flex items-start space-x-2">
                <Gift className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Help maintain temple facilities</span>
              </div>
              <div className="flex items-start space-x-2">
                <User className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Support educational programs</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-red-500 mt-0.5" />
                <span>Contribute to community welfare</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Secure Donation</h4>
                  <p className="text-sm text-green-600 mt-1">
                    Your donation is processed securely with industry-standard encryption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>Need Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Donation Helpline</p>
                    <p className="text-blue-600">+91 98765 43210</p>
                    <p className="text-blue-600">+91 87654 32109</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Email Support</p>
                    <p className="text-blue-600">donations@temple.org</p>
                    <p className="text-blue-600">support@temple.org</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Support Hours</p>
                    <p className="text-blue-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-blue-600">Sat-Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">WhatsApp Support</p>
                    <p className="text-blue-600">+91 98765 43210</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  For urgent matters, please call our helpline. We're here to help with any donation-related questions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

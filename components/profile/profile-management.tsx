"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  Edit,
  Camera,
  Church,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Users,
  DollarSign,
  Key,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Mail,
  User,
  Lock,
} from "lucide-react"

const roles = ["Admin", "Priest", "Trustee", "Volunteer", "Member"]
const departments = ["Religious Affairs", "Administration", "Community Service", "Management", "Finance"]
const genders = ["Male", "Female", "Other", "Prefer not to say"]
const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
]

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Church className="h-4 w-4" />
    case "Priest":
      return <Church className="h-4 w-4" />
    case "Trustee":
      return <Shield className="h-4 w-4" />
    case "Volunteer":
      return <Heart className="h-4 w-4" />
    case "Member":
      return <Users className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4" />
    case "Inactive":
      return <XCircle className="h-4 w-4" />
    case "Pending":
      return <Clock className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getDepartmentIcon = (department: string) => {
  switch (department) {
    case "Religious Affairs":
      return <Church className="h-4 w-4" />
    case "Administration":
      return <Building className="h-4 w-4" />
    case "Community Service":
      return <Heart className="h-4 w-4" />
    case "Management":
      return <Users className="h-4 w-4" />
    case "Finance":
      return <DollarSign className="h-4 w-4" />
    default:
      return <Building className="h-4 w-4" />
  }
}

export default function ProfileManagement() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNukiCode, setShowNukiCode] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState("+91")
  const [alternateCountryCode, setAlternateCountryCode] = useState("+91")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternateMobile: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    department: "",
    organization: "",
    joinDate: "",
    nukiCode: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        alternateMobile: user.alternateMobile || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipcode: user.zipcode || "",
        country: user.country || "",
        department: user.department || "",
        organization: user.organization || "",
        joinDate: user.joinDate || "",
        nukiCode: user.nukiCode || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setImagePreview(user.avatar || null)
      
      if (user.phone) {
        const phoneMatch = user.phone.match(/^(\+\d+)\s*(.*)/)
        if (phoneMatch) {
          setCountryCode(phoneMatch[1])
        }
      }
      if (user.alternateMobile) {
        const altPhoneMatch = user.alternateMobile.match(/^(\+\d+)\s*(.*)/)
        if (altPhoneMatch) {
          setAlternateCountryCode(altPhoneMatch[1])
        }
      }
    }
  }, [user])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      errors.name = "Full name is required"
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required"
    }

    // Password validation only if changing password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = "Current password is required to change password"
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = "New password must be at least 6 characters"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Here you would typically make an API call to update the user profile
    console.log("Saving profile data:", formData)
    
    // For now, just exit edit mode
    setIsEditing(false)
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={isEditing ? "" : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-32 h-32">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={imagePreview || user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload profile image"
                />
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={getStatusColor(user.status || "Active")}>
                  {getStatusIcon(user.status || "Active")}
                  {user.status || "Active"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getRoleIcon(user.role || "Member")}
                  {user.role || "Member"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                      {validationErrors.name && <p className="text-sm text-red-600">{validationErrors.name}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{formData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                          className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      {validationErrors.email && <p className="text-sm text-red-600">{validationErrors.email}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 py-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {formData.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  {isEditing ? (
                    <>
                      <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-24 border-gray-200 focus:border-red-500 focus:ring-red-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          value={formData.phone?.replace(/^\+\d+\s*/, "") || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="flex-1 border-gray-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      {validationErrors.phone && <p className="text-sm text-red-600">{validationErrors.phone}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 py-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formData.phone || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateMobile" className="text-sm font-medium">
                    Alternate Mobile
                  </Label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Select value={alternateCountryCode} onValueChange={setAlternateCountryCode}>
                        <SelectTrigger className="w-24 border-gray-200 focus:border-red-500 focus:ring-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="alternateMobile"
                        value={formData.alternateMobile?.replace(/^\+\d+\s*/, "") || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, alternateMobile: e.target.value }))}
                        placeholder="Enter alternate mobile number"
                        className="flex-1 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 py-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formData.alternateMobile || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{formData.gender || "Not provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
              <CardDescription>Your residential address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                    rows={3}
                    className="border-gray-200 focus:border-red-500 focus:ring-red-500 resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-700 py-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {formData.address || "Not provided"}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{formData.city || "Not provided"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{formData.state || "Not provided"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-sm font-medium">
                    Zipcode
                  </Label>
                  {isEditing ? (
                    <Input
                      id="zipcode"
                      value={formData.zipcode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                      placeholder="Enter zipcode"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{formData.zipcode || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-700 py-2">{formData.country || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Information
              </CardTitle>
              <CardDescription>Your role and organizational details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            <div className="flex items-center gap-2">
                              {getDepartmentIcon(dept)}
                              {dept}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-700 py-2 flex items-center gap-2">
                      {formData.department && getDepartmentIcon(formData.department)}
                      {formData.department || "Not assigned"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-sm font-medium">
                    Organization
                  </Label>
                  {isEditing ? (
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                      placeholder="Enter organization"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {formData.organization || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="text-sm font-medium">
                    Join Date
                  </Label>
                  {isEditing ? (
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, joinDate: e.target.value }))}
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">
                      {formData.joinDate ? new Date(formData.joinDate).toLocaleDateString() : "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nukiCode" className="text-sm font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Nuki Code
                  </Label>
                  {isEditing ? (
                    <Input
                      id="nukiCode"
                      value={formData.nukiCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nukiCode: e.target.value }))}
                      placeholder="Enter Nuki access code"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500 font-mono text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-700 py-2 font-mono">
                        {formData.nukiCode ? (showNukiCode ? formData.nukiCode : "••••••••") : "Not assigned"}
                      </p>
                      {formData.nukiCode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNukiCode(!showNukiCode)}
                          className="h-6 w-6 p-0"
                        >
                          {showNukiCode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.currentPassword && <p className="text-sm text-red-600">{validationErrors.currentPassword}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {validationErrors.newPassword && <p className="text-sm text-red-600">{validationErrors.newPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="pl-10 pr-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    {validationErrors.confirmPassword && <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

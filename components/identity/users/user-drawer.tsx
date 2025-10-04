"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useUserStore, type User } from "@/stores/user-store"
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
  Copy,
  UserCheck,
  UserX,
  Crown,
  ChevronDown,
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
      return <Crown className="h-4 w-4" />
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

export function UserDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedUser,
    closeDrawer,
    addUser,
    updateUser,
    deleteUser,
    duplicateUser,
    promoteUser,
    demoteUser,
    toggleUserStatus,
    openDrawer,
  } = useUserStore()

  const [formData, setFormData] = useState<Partial<User>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState("+91")
  const [alternateCountryCode, setAlternateCountryCode] = useState("+91") // Added alternate mobile country code
  const [showNukiCode, setShowNukiCode] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser)
      setImagePreview(selectedUser.avatar || null)
      if (selectedUser.phone) {
        const phoneMatch = selectedUser.phone.match(/^(\+\d+)\s*(.*)/)
        if (phoneMatch) {
          setCountryCode(phoneMatch[1])
        }
      }
      if (selectedUser.alternateMobile) {
        const altPhoneMatch = selectedUser.alternateMobile.match(/^(\+\d+)\s*(.*)/)
        if (altPhoneMatch) {
          setAlternateCountryCode(altPhoneMatch[1])
        }
      }
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Member",
        status: "Active",
        phone: "",
        alternateMobile: "", // Added alternate mobile
        dateOfBirth: "", // Added date of birth
        gender: "", // Added gender
        address: "",
        city: "", // Added city
        state: "", // Added state
        zipcode: "", // Added zipcode
        country: "", // Added country
        department: "",
        organization: "", // Added organization
        joinDate: new Date().toISOString().split("T")[0],
        nukiCode: "",
      })
      setImagePreview(null)
      setCountryCode("+91")
      setAlternateCountryCode("+91") // Reset alternate country code
    }
    setIsEditing(drawerMode === "create" || drawerMode === "edit")
    setValidationErrors({})
    setShowNukiCode(false)
  }, [selectedUser, drawerMode])

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

    if (!formData.role?.trim()) {
      errors.role = "Role is required"
    }

    if (!formData.status?.trim()) {
      errors.status = "Status is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const phoneWithCountryCode = formData.phone ? `${countryCode} ${formData.phone}` : ""
    const alternateMobileWithCountryCode = formData.alternateMobile
      ? `${alternateCountryCode} ${formData.alternateMobile}`
      : ""

    if (drawerMode === "create") {
      const newUser: User = {
        ...(formData as User),
        id: Date.now().toString(),
        joinDate: formData.joinDate || new Date().toISOString().split("T")[0],
        avatar: imagePreview || undefined,
        phone: phoneWithCountryCode,
        alternateMobile: alternateMobileWithCountryCode, // Added alternate mobile
      }
      addUser(newUser)
    } else if (drawerMode === "edit" && selectedUser) {
      updateUser(selectedUser.id, {
        ...formData,
        avatar: imagePreview || undefined,
        phone: phoneWithCountryCode,
        alternateMobile: alternateMobileWithCountryCode, // Added alternate mobile
      })
    }
    closeDrawer()
  }

  const handleDelete = () => {
    if (selectedUser && confirm("Are you sure you want to delete this user?")) {
      deleteUser(selectedUser.id)
      closeDrawer()
    }
  }

  const handleDuplicate = () => {
    console.log(" Opening duplicate dialog")
    setShowDuplicateDialog(true)
  }

  const confirmDuplicate = () => {
    if (selectedUser) {
      duplicateUser(selectedUser.id)
      closeDrawer()
    }
    setShowDuplicateDialog(false)
  }

  const handlePromote = () => {
    if (selectedUser) {
      const currentRoleIndex = roles.indexOf(selectedUser.role)
      const nextRole = currentRoleIndex > 0 ? roles[currentRoleIndex - 1] : roles[0]
      promoteUser(selectedUser.id, nextRole)
      setFormData((prev) => ({ ...prev, role: nextRole }))
    }
  }

  const handleDemote = () => {
    if (selectedUser) {
      const currentRoleIndex = roles.indexOf(selectedUser.role)
      const nextRole = currentRoleIndex < roles.length - 1 ? roles[currentRoleIndex + 1] : roles[roles.length - 1]
      demoteUser(selectedUser.id, nextRole)
      setFormData((prev) => ({ ...prev, role: nextRole }))
    }
  }

  const handleToggleStatus = () => {
    if (selectedUser && selectedUser.status === "Active") {
      console.log(" Opening deactivate dialog")
      setShowDeactivateDialog(true)
    } else if (selectedUser) {
      toggleUserStatus(selectedUser.id)
      const newStatus = selectedUser.status === "Active" ? "Inactive" : "Active"
      setFormData((prev) => ({ ...prev, status: newStatus as "Active" | "Inactive" | "Pending" }))
    }
  }

  const confirmDeactivate = () => {
    if (selectedUser) {
      toggleUserStatus(selectedUser.id)
      const newStatus = "Inactive"
      setFormData((prev) => ({ ...prev, status: newStatus as "Active" | "Inactive" | "Pending" }))
    }
    setShowDeactivateDialog(false)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    closeDrawer()
  }

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-full sm:w-[500px] lg:w-[600px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {drawerMode === "create" && "Create New User"}
                  {drawerMode === "view" && "User Details"}
                  {drawerMode === "edit" && "Edit User"}
                </SheetTitle>
                <SheetDescription>
                  {drawerMode === "create" && "Add a new user to the temple management system"}
                  {drawerMode === "view" && "View and manage user information"}
                  {drawerMode === "edit" && "Update user information"}
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
            {/* Avatar and Basic Info Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={imagePreview || formData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {formData.name
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
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
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
              <div className="flex-1">
                {!isEditing ? (
                  <div>
                    <h3 className="text-lg font-semibold">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(formData.status || "")}>{formData.status}</Badge>
                      <Badge variant="outline">{formData.role}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.name && <p className="text-sm text-red-600">{validationErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.email && <p className="text-sm text-red-600">{validationErrors.email}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Role and Status Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role *
                </Label>
                {isEditing ? (
                  <>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(role)}
                              {role}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.role && <p className="text-sm text-red-600">{validationErrors.role}</p>}
                  </>
                ) : (
                  <div className="mt-2">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getRoleIcon(formData.role || "")}
                      {formData.role}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status *
                </Label>
                {isEditing ? (
                  <>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value as "Active" | "Inactive" | "Pending" }))
                      }
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="Inactive">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value="Pending">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pending
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.status && <p className="text-sm text-red-600">{validationErrors.status}</p>}
                  </>
                ) : (
                  <div className="mt-2">
                    <Badge className={`${getStatusColor(formData.status || "")} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(formData.status || "")}
                      {formData.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Contact Information</h4>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                {isEditing ? (
                  <>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-24 border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
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
                        className="flex-1 border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                    </div>
                    {validationErrors.phone && <p className="text-sm text-red-600">{validationErrors.phone}</p>}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formData.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternateMobile" className="text-sm font-medium">
                  Alternate Mobile Number
                </Label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Select value={alternateCountryCode} onValueChange={setAlternateCountryCode}>
                      <SelectTrigger className="w-24 border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
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
                      className="flex-1 border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formData.alternateMobile || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
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
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
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
                    <p className="mt-1 text-sm text-muted-foreground">{formData.gender || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Address Information</h4>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                    rows={3}
                    className="bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent resize-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {formData.address || "Not provided"}
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
                      value={formData.city || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{formData.city || "Not provided"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData.state || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{formData.state || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-sm font-medium">
                    Zipcode
                  </Label>
                  {isEditing ? (
                    <Input
                      id="zipcode"
                      value={formData.zipcode || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                      placeholder="Enter zipcode"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{formData.zipcode || "Not provided"}</p>
                  )}
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
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent">
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
                    <p className="mt-1 text-sm text-muted-foreground">{formData.country || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent">
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
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
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
                    value={formData.organization || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                    placeholder="Enter organization"
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {formData.organization || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-sm font-medium">
                  Join Date
                </Label>
                {isEditing ? (
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, joinDate: e.target.value }))}
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
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
                    value={formData.nukiCode || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nukiCode: e.target.value }))}
                    placeholder="Enter Nuki access code"
                    className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent font-mono text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="mt-1 text-sm text-muted-foreground font-mono">
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

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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
                        onClick={() => {
                          handleDuplicate()
                        }}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handlePromote}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Promote
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleDemote()
                        }}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Demote
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleToggleStatus()
                        }}
                        className={
                          formData.status === "Active"
                            ? "text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-300"
                        }
                      >
                        {formData.status === "Active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {selectedUser?.name}? This will prevent them from accessing the system
              and participating in temple activities. You can reactivate them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeactivate}
              className="bg-red-600 hover:bg-red-700 text-primary-foreground"
            >
              Deactivate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate User</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of {selectedUser?.name} with "(Copy)" added to their name and "copy_" prefixed to
              their email address. You'll need to update their information manually after creation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDuplicate}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Duplicate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Eye,
  EyeOff,
  List,
  Grid,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Church,
  Shield,
  Heart,
  User,
  Users,
  ArrowUpDown,
} from "lucide-react"
import { useUserStore } from "@/stores/user-store"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  viewMode: "table" | "card"
  setViewMode: (mode: "table" | "card") => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Inactive":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Crown className="h-4 w-4 text-purple-500" />
    case "Priest":
      return <Church className="h-4 w-4 text-blue-500" />
    case "Trustee":
      return <Shield className="h-4 w-4 text-indigo-500" />
    case "Volunteer":
      return <Heart className="h-4 w-4 text-pink-500" />
    case "Devotee":
      return <User className="h-4 w-4 text-gray-500" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  viewMode,
  setViewMode,
}: SearchFiltersProps) {
  const { showSensitiveFields, toggleSensitiveFields, openAdvancedFilter, sortField, sortDirection, setSorting } =
    useUserStore()

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "role", label: "Role" },
    { value: "status", label: "Status" },
    { value: "joinDate", label: "Join Date" },
    { value: "lastLogin", label: "Last Login" },
  ]

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-")
    setSorting(field, direction as "asc" | "desc")
  }

  return (
    <div className="p-3 sm:p-4 border-b border-gray-200">
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Sensitive Fields Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="relative flex-1 transition-all duration-300 hover:scale-[1.02] group transform-gpu">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-300 group-hover:text-red-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all duration-300 hover:bg-muted/70 hover:shadow-md"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:rotate-12 transform-gpu"
            onClick={toggleSensitiveFields}
            title={showSensitiveFields ? "Hide sensitive fields" : "Show sensitive fields"}
          >
            {showSensitiveFields ? (
              <EyeOff className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <Eye className="h-4 w-4 transition-transform duration-300" />
            )}
          </Button>
        </div>

                 {/* Filters and Controls - Mobile Optimized */}
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0">
           <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-md p-1 transition-all duration-300 hover:shadow-md hover:bg-gray-200 transform-gpu">
             <Button
               variant="ghost"
               size="icon"
               className={
                 viewMode === "table"
                   ? "bg-red-500 text-white hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg transform-gpu"
                   : "hover:bg-gray-200 transition-all duration-300 transform-gpu"
               }
               onClick={() => setViewMode("table")}
             >
               <List className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
             </Button>
             <Button
               variant="ghost"
               size="icon"
               className={
                 viewMode === "card"
                   ? "bg-red-500 text-white hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg transform-gpu"
                   : "hover:bg-gray-200 transition-all duration-300 transform-gpu"
               }
               onClick={() => setViewMode("card")}
             >
               <Grid className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
             </Button>
           </div>

           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="All Status">
                 <div className="flex items-center space-x-2">
                   <Users className="h-4 w-4 text-gray-500" />
                   <span>All Status</span>
                 </div>
               </SelectItem>
               <SelectItem value="Active">
                 <div className="flex items-center space-x-2">
                   <CheckCircle className="h-4 w-4 text-green-500" />
                   <span>Active</span>
                 </div>
               </SelectItem>
               <SelectItem value="Inactive">
                 <div className="flex items-center space-x-2">
                   <XCircle className="h-4 w-4 text-red-500" />
                   <span>Inactive</span>
                 </div>
               </SelectItem>
             </SelectContent>
           </Select>

           <Select value={roleFilter} onValueChange={setRoleFilter}>
             <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="All Roles">
                 <div className="flex items-center space-x-2">
                   <Users className="h-4 w-4 text-gray-500" />
                   <span>All Roles</span>
                 </div>
               </SelectItem>
               <SelectItem value="Admin">
                 <div className="flex items-center space-x-2">
                   <Crown className="h-4 w-4 text-purple-500" />
                   <span>Admin</span>
                 </div>
               </SelectItem>
               <SelectItem value="Priest">
                 <div className="flex items-center space-x-2">
                   <Church className="h-4 w-4 text-blue-500" />
                   <span>Priest</span>
                 </div>
               </SelectItem>
               <SelectItem value="Volunteer">
                 <div className="flex items-center space-x-2">
                   <Heart className="h-4 w-4 text-pink-500" />
                   <span>Volunteer</span>
                 </div>
               </SelectItem>
               <SelectItem value="Trustee">
                 <div className="flex items-center space-x-2">
                   <Shield className="h-4 w-4 text-indigo-500" />
                   <span>Trustee</span>
                 </div>
               </SelectItem>
               <SelectItem value="Devotee">
                 <div className="flex items-center space-x-2">
                   <User className="h-4 w-4 text-gray-500" />
                   <span>Devotee</span>
                 </div>
               </SelectItem>
             </SelectContent>
           </Select>

           {viewMode === "card" && (
             <Select value={`${sortField}-${sortDirection}`} onValueChange={handleSortChange}>
               <SelectTrigger className="w-full sm:w-40 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
                 <div className="flex items-center space-x-2">
                   <ArrowUpDown className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
                   <SelectValue />
                 </div>
               </SelectTrigger>
               <SelectContent>
                 {sortOptions.map((option) => (
                   <div key={option.value}>
                     <SelectItem value={`${option.value}-asc`}>
                       <span>{option.label} (A-Z)</span>
                     </SelectItem>
                     <SelectItem value={`${option.value}-desc`}>
                       <span>{option.label} (Z-A)</span>
                     </SelectItem>
                   </div>
                 ))}
               </SelectContent>
             </Select>
           )}

           <Button
             variant="outline"
             className="flex items-center space-x-2 bg-transparent whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transform-gpu"
             onClick={openAdvancedFilter}
           >
             <Filter className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-red-500" />
             <span className="transition-colors duration-300 group-hover:text-red-600">Advanced</span>
           </Button>
         </div>
      </div>
    </div>
  )
}

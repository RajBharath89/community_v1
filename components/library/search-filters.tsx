"use client"

import { Search, Filter, Grid, List, Users, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  onAdvancedFilter: () => void
}

const typeOptions = [
  { value: "All Types", label: "All Types" },
  { value: "ebook", label: "Ebooks" },
  { value: "audiobook", label: "Audiobooks" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "document", label: "Documents" },
]

const categoryOptions = [
  { value: "All Categories", label: "All Categories" },
  { value: "Spiritual Texts", label: "Spiritual Texts" },
  { value: "Epics", label: "Epics" },
  { value: "Architecture", label: "Architecture" },
  { value: "Rituals", label: "Rituals" },
  { value: "Language Learning", label: "Language Learning" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "History", label: "History" },
  { value: "Music", label: "Music" },
  { value: "Art", label: "Art" },
]

const statusOptions = [
  { value: "All Status", label: "All Status" },
  { value: "Available", label: "Available" },
  { value: "Borrowed", label: "Borrowed" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Archived", label: "Archived" },
]

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  onAdvancedFilter,
}: SearchFiltersProps) {
  return (
    <div className="p-4 border-b bg-gray-50/50">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-red-300 focus:ring-red-200 rounded-lg"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-lg p-1 bg-white">
          <Button
            onClick={() => setViewMode("list")}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-100"}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setViewMode("grid")}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-100"}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {/* All Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-auto min-w-[120px] bg-white border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <SelectValue />
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* All Types Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-auto min-w-[120px] bg-white border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <SelectValue />
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filter */}
          <Button
            onClick={onAdvancedFilter}
            variant="outline"
            className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 rounded-lg"
          >
            <Filter className="h-4 w-4 text-gray-600" />
            <span>Advanced</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

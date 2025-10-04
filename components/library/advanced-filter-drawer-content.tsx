"use client"

import { useState, useEffect } from "react"
import { AdvancedFilters } from "@/stores/library-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"

interface AdvancedFilterDrawerContentProps {
  isOpen: boolean
  onClose: () => void
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  onClearFilters: () => void
}

const typeOptions = ["ebook", "audiobook", "image", "video", "document"]
const categoryOptions = [
  "Spiritual Texts",
  "Epics",
  "Architecture",
  "Rituals",
  "Language Learning",
  "Philosophy",
  "History",
  "Music",
  "Art",
  "Biography",
  "Meditation",
  "Yoga",
  "Ayurveda",
  "Astrology",
  "Mythology",
]
const statusOptions = ["Available", "Borrowed", "Maintenance", "Archived"]
const languageOptions = [
  "English",
  "Hindi",
  "Sanskrit",
  "Tamil",
  "Telugu",
  "Bengali",
  "Gujarati",
  "Marathi",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Urdu",
]

export function AdvancedFilterDrawerContent({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}: AdvancedFilterDrawerContentProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (field: keyof AdvancedFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayFilterChange = (field: keyof AdvancedFilters, value: string, checked: boolean) => {
    setLocalFilters(prev => {
      const currentArray = (prev[field] as string[]) || []
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      }
    })
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleClearFilters = () => {
    onClearFilters()
    onClose()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.selectedTypes.length > 0) count++
    if (localFilters.selectedCategories.length > 0) count++
    if (localFilters.selectedStatuses.length > 0) count++
    if (localFilters.selectedLanguages.length > 0) count++
    if (localFilters.selectedAuthors.length > 0) count++
    if (localFilters.selectedTags.length > 0) count++
    if (localFilters.publishDateFrom) count++
    if (localFilters.publishDateTo) count++
    if (localFilters.addedDateFrom) count++
    if (localFilters.addedDateTo) count++
    if (localFilters.hasThumbnail !== null) count++
    if (localFilters.isPublic !== null) count++
    if (localFilters.isFeatured !== null) count++
    if (localFilters.minRating > 0) count++
    if (localFilters.maxRating < 5) count++
    if (localFilters.minDownloadCount > 0) count++
    if (localFilters.maxDownloadCount < 10000) count++
    if (localFilters.titleContains) count++
    if (localFilters.descriptionContains) count++
    if (localFilters.authorContains) count++
    if (localFilters.tagContains) count++
    return count
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Use advanced filters to find specific library items
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Types</Label>
            <div className="space-y-2">
              {typeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.selectedTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedTypes", type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Categories</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categoryOptions.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={localFilters.selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedCategories", category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.selectedStatuses.includes(status)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedStatuses", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Languages</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={localFilters.selectedLanguages.includes(language)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedLanguages", language, checked as boolean)
                    }
                  />
                  <Label htmlFor={`language-${language}`} className="text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Filters */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Date Range</Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="publishDateFrom" className="text-sm">Publish Date From</Label>
                <Input
                  id="publishDateFrom"
                  type="date"
                  value={localFilters.publishDateFrom}
                  onChange={(e) => handleFilterChange("publishDateFrom", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDateTo" className="text-sm">Publish Date To</Label>
                <Input
                  id="publishDateTo"
                  type="date"
                  value={localFilters.publishDateTo}
                  onChange={(e) => handleFilterChange("publishDateTo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addedDateFrom" className="text-sm">Added Date From</Label>
                <Input
                  id="addedDateFrom"
                  type="date"
                  value={localFilters.addedDateFrom}
                  onChange={(e) => handleFilterChange("addedDateFrom", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addedDateTo" className="text-sm">Added Date To</Label>
                <Input
                  id="addedDateTo"
                  type="date"
                  value={localFilters.addedDateTo}
                  onChange={(e) => handleFilterChange("addedDateTo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Rating Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rating Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="minRating" className="text-sm">Min Rating</Label>
                <Select
                  value={localFilters.minRating.toString()}
                  onValueChange={(value) => handleFilterChange("minRating", parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRating" className="text-sm">Max Rating</Label>
                <Select
                  value={localFilters.maxRating.toString()}
                  onValueChange={(value) => handleFilterChange("maxRating", parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Download Count Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Download Count</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="minDownloads" className="text-sm">Min Downloads</Label>
                <Input
                  id="minDownloads"
                  type="number"
                  value={localFilters.minDownloadCount}
                  onChange={(e) => handleFilterChange("minDownloadCount", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDownloads" className="text-sm">Max Downloads</Label>
                <Input
                  id="maxDownloads"
                  type="number"
                  value={localFilters.maxDownloadCount}
                  onChange={(e) => handleFilterChange("maxDownloadCount", parseInt(e.target.value) || 10000)}
                />
              </div>
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Properties</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasThumbnail"
                  checked={localFilters.hasThumbnail === true}
                  onCheckedChange={(checked) =>
                    handleFilterChange("hasThumbnail", checked ? true : null)
                  }
                />
                <Label htmlFor="hasThumbnail" className="text-sm">
                  Has Thumbnail
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={localFilters.isPublic === true}
                  onCheckedChange={(checked) =>
                    handleFilterChange("isPublic", checked ? true : null)
                  }
                />
                <Label htmlFor="isPublic" className="text-sm">
                  Public Access
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={localFilters.isFeatured === true}
                  onCheckedChange={(checked) =>
                    handleFilterChange("isFeatured", checked ? true : null)
                  }
                />
                <Label htmlFor="isFeatured" className="text-sm">
                  Featured Items
                </Label>
              </div>
            </div>
          </div>

          {/* Text Search Filters */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Text Search</Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="titleContains" className="text-sm">Title Contains</Label>
                <Input
                  id="titleContains"
                  value={localFilters.titleContains}
                  onChange={(e) => handleFilterChange("titleContains", e.target.value)}
                  placeholder="Search in titles..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionContains" className="text-sm">Description Contains</Label>
                <Input
                  id="descriptionContains"
                  value={localFilters.descriptionContains}
                  onChange={(e) => handleFilterChange("descriptionContains", e.target.value)}
                  placeholder="Search in descriptions..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorContains" className="text-sm">Author Contains</Label>
                <Input
                  id="authorContains"
                  value={localFilters.authorContains}
                  onChange={(e) => handleFilterChange("authorContains", e.target.value)}
                  placeholder="Search in authors..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagContains" className="text-sm">Tag Contains</Label>
                <Input
                  id="tagContains"
                  value={localFilters.tagContains}
                  onChange={(e) => handleFilterChange("tagContains", e.target.value)}
                  placeholder="Search in tags..."
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
          
          <div className="flex-1" />
          
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleApplyFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

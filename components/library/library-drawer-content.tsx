"use client"

import { useState, useEffect } from "react"
import { LibraryItem } from "@/stores/library-store"
import { useLibraryStore } from "@/stores/library-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { 
  BookOpen, 
  Headphones, 
  Image, 
  Video, 
  FileText, 
  Star, 
  Download, 
  Eye, 
  Calendar,
  User,
  Clock,
  Tag,
  X,
  Plus
} from "lucide-react"
import { toast } from "sonner"

interface LibraryDrawerContentProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "view" | "edit" | null
  item: LibraryItem | null
}

const typeOptions = [
  { value: "ebook", label: "Ebook" },
  { value: "audiobook", label: "Audiobook" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
]

const statusOptions = [
  { value: "Available", label: "Available" },
  { value: "Borrowed", label: "Borrowed" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Archived", label: "Archived" },
]

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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "ebook":
      return BookOpen
    case "audiobook":
      return Headphones
    case "image":
      return Image
    case "video":
      return Video
    case "document":
      return FileText
    default:
      return FileText
  }
}

export function LibraryDrawerContent({ isOpen, onClose, mode, item }: LibraryDrawerContentProps) {
  const { addItem, updateItem, deleteItem } = useLibraryStore()
  const [formData, setFormData] = useState<Partial<LibraryItem>>({})
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        type: "ebook",
        status: "Available",
        language: "English",
        tags: [],
        isPublic: true,
        isFeatured: false,
        downloadCount: 0,
        viewCount: 0,
        addedDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
      })
    } else if (item) {
      setFormData({ ...item })
    }
  }, [mode, item])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.type || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        const newItem: LibraryItem = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description || "",
          type: formData.type as any,
          category: formData.category,
          author: formData.author,
          narrator: formData.narrator,
          duration: formData.duration,
          fileSize: formData.fileSize,
          language: formData.language || "English",
          status: formData.status as any || "Available",
          tags: formData.tags || [],
          thumbnail: formData.thumbnail,
          fileUrl: formData.fileUrl,
          isbn: formData.isbn,
          publishDate: formData.publishDate,
          addedDate: formData.addedDate || new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          rating: formData.rating,
          downloadCount: formData.downloadCount || 0,
          viewCount: formData.viewCount || 0,
          isPublic: formData.isPublic || false,
          isFeatured: formData.isFeatured || false,
          metadata: formData.metadata,
        }
        addItem(newItem)
        toast.success("Library item created successfully")
      } else if (mode === "edit" && item) {
        const updatedItem = {
          ...item,
          ...formData,
          lastModified: new Date().toISOString().split("T")[0],
        }
        updateItem(item.id, updatedItem)
        toast.success("Library item updated successfully")
      }
      onClose()
    } catch (error) {
      toast.error("An error occurred while saving the item")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (item && confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteItem(item.id)
      toast.success("Library item deleted successfully")
      onClose()
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {mode === "create" && <Plus className="h-5 w-5" />}
            {mode === "edit" && <FileText className="h-5 w-5" />}
            {mode === "view" && getTypeIcon(formData.type || "document") && (
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getTypeIcon(formData.type || "document")
                  return <Icon className="h-5 w-5" />
                })()}
              </div>
            )}
            {mode === "create" && "Add New Library Item"}
            {mode === "edit" && "Edit Library Item"}
            {mode === "view" && "View Library Item"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create" && "Add a new item to the digital library"}
            {mode === "edit" && "Update the library item details"}
            {mode === "view" && "View library item information"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter item title"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => handleInputChange("type", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleInputChange("category", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter item description"
                rows={3}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Author & Language */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Author & Language</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author || ""}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter author name"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language || ""}
                  onValueChange={(value) => handleInputChange("language", value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.type === "audiobook" || formData.type === "video") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="narrator">Narrator</Label>
                  <Input
                    id="narrator"
                    value={formData.narrator || ""}
                    onChange={(e) => handleInputChange("narrator", e.target.value)}
                    placeholder="Enter narrator name"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration || ""}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 2:30:45"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">File Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileUrl">File URL</Label>
                <Input
                  id="fileUrl"
                  value={formData.fileUrl || ""}
                  onChange={(e) => handleInputChange("fileUrl", e.target.value)}
                  placeholder="Enter file URL"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileSize">File Size</Label>
                <Input
                  id="fileSize"
                  value={formData.fileSize || ""}
                  onChange={(e) => handleInputChange("fileSize", e.target.value)}
                  placeholder="e.g., 15.2 MB"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail || ""}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                  placeholder="Enter thumbnail URL"
                  disabled={isReadOnly}
                />
              </div>

              {formData.type === "ebook" && (
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn || ""}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                    placeholder="Enter ISBN"
                    disabled={isReadOnly}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tags</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  disabled={isReadOnly}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isReadOnly || !newTag.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    {!isReadOnly && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                        title={`Remove ${tag} tag`}
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Access</Label>
                  <p className="text-sm text-gray-500">Make this item publicly accessible</p>
                </div>
                <Switch
                  checked={formData.isPublic || false}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Item</Label>
                  <p className="text-sm text-gray-500">Highlight this item as featured</p>
                </div>
                <Switch
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Statistics (View Mode Only) */}
          {mode === "view" && item && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Download className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Downloads</p>
                    <p className="text-lg font-bold">{item.downloadCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Views</p>
                    <p className="text-lg font-bold">{item.viewCount}</p>
                  </div>
                </div>

                {item.rating && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-lg font-bold">{item.rating}/5</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Added</p>
                    <p className="text-sm font-bold">{new Date(item.addedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex gap-2">
          {mode === "edit" && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
          
          <div className="flex-1" />
          
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          
          {mode !== "view" && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

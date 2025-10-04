"use client"

import { LibraryItem } from "@/stores/library-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpen, 
  Headphones, 
  Image, 
  Video, 
  FileText, 
  Star, 
  Download, 
  Eye, 
  MoreVertical,
  Calendar,
  User,
  Clock,
  Play
} from "lucide-react"
import { useLibraryStore } from "@/stores/library-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LibraryGridViewProps {
  items: LibraryItem[]
}

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

const getPlaceholderImage = (type: string) => {
  switch (type) {
    case "ebook":
      return "/placeholder-ebook.svg"
    case "audiobook":
      return "/placeholder-audiobook.svg"
    case "image":
      return "/placeholder-image.svg"
    case "video":
      return "/placeholder-video.svg"
    case "document":
      return "/placeholder-document.svg"
    default:
      return "/placeholder-document.svg"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800"
    case "Borrowed":
      return "bg-orange-100 text-orange-800"
    case "Maintenance":
      return "bg-yellow-100 text-yellow-800"
    case "Archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function LibraryGridView({ items }: LibraryGridViewProps) {
  const { openDrawer, duplicateItem, deleteItem, openActionModal } = useLibraryStore()

  const handleView = (item: LibraryItem) => {
    openDrawer("view", item)
  }

  const handleEdit = (item: LibraryItem) => {
    openDrawer("edit", item)
  }

  const handleDuplicate = (item: LibraryItem) => {
    duplicateItem(item.id)
  }

  const handleDelete = (item: LibraryItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteItem(item.id)
    }
  }

  const handleActionClick = (item: LibraryItem, action: "read" | "play" | "view") => {
    openActionModal(item, action)
  }


  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => {
          const TypeIcon = getTypeIcon(item.type)
          return (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={getPlaceholderImage(item.type)}
                      alt={`${item.type} placeholder`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {item.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>

                  {/* Action Icon */}
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const action = item.type === "ebook" || item.type === "document" ? "read" : 
                                      item.type === "image" ? "view" : "play"
                        handleActionClick(item, action as any)
                      }}
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {(() => {
                        switch (item.type) {
                          case "ebook":
                          case "document":
                            return <BookOpen className="h-4 w-4 text-blue-600" />
                          case "audiobook":
                          case "video":
                            return <Play className="h-4 w-4 text-green-600" />
                          case "image":
                            return <Eye className="h-4 w-4 text-purple-600" />
                          default:
                            return <Play className="h-4 w-4 text-gray-600" />
                        }
                      })()}
                    </Button>
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Author */}
                  {item.author && (
                    <div className="flex items-center gap-1 mb-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">{item.author}</span>
                    </div>
                  )}

                  {/* Duration for audiobooks/videos */}
                  {item.duration && (
                    <div className="flex items-center gap-1 mb-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{item.duration}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{item.downloadCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.viewCount}</span>
                      </div>
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Added Date */}
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Added {new Date(item.addedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}

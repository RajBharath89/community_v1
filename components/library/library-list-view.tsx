"use client"

import { LibraryItem } from "@/stores/library-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

interface LibraryListViewProps {
  items: LibraryItem[]
  sortField: string
  sortDirection: "asc" | "desc"
  onSort: (field: string) => void
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

const getSortIcon = (field: string, currentField: string, direction: "asc" | "desc") => {
  if (field !== currentField) {
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />
  }
  return direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
}

export function LibraryListView({ 
  items, 
  sortField, 
  sortDirection, 
  onSort
}: LibraryListViewProps) {
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

  const handleSort = (field: string) => {
    onSort(field)
  }

  const handleActionClick = (item: LibraryItem, action: "read" | "play" | "view") => {
    openActionModal(item, action)
  }


  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Title
                  {getSortIcon("title", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("type")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Type
                  {getSortIcon("type", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Category
                  {getSortIcon("category", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Status
                  {getSortIcon("status", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("downloadCount")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Downloads
                  {getSortIcon("downloadCount", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("addedDate")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Added Date
                  {getSortIcon("addedDate", sortField, sortDirection)}
                </Button>
              </th>
              <th className="text-left p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const TypeIcon = getTypeIcon(item.type)
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <img
                            src={getPlaceholderImage(item.type)}
                            alt={`${item.type} placeholder`}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        {/* Action Icon */}
                        <Button
                          onClick={() => {
                            const action = item.type === "ebook" || item.type === "document" ? "read" : 
                                          item.type === "image" ? "view" : "play"
                            handleActionClick(item, action as any)
                          }}
                          size="sm"
                          className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {(() => {
                            switch (item.type) {
                              case "ebook":
                              case "document":
                                return <BookOpen className="h-3 w-3 text-blue-600" />
                              case "audiobook":
                              case "video":
                                return <Play className="h-3 w-3 text-green-600" />
                              case "image":
                                return <Eye className="h-3 w-3 text-purple-600" />
                              default:
                                return <Play className="h-3 w-3 text-gray-600" />
                            }
                          })()}
                        </Button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate hover:text-red-600 cursor-pointer" onClick={() => handleView(item)}>
                            {item.title}
                          </h3>
                          {item.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {item.description}
                        </p>
                        {item.author && (
                          <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{item.author}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </td>
                  <td className="p-3">
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Download className="h-4 w-4" />
                      <span>{item.downloadCount}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.addedDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

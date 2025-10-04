"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Download, Plus, Grid, List } from "lucide-react"
import { useLibraryStore } from "@/stores/library-store"
import * as XLSX from "xlsx"
import { useRef } from "react"
import { toast } from "sonner"

export function ActionButtons() {
  const { openDrawer, filteredItems, addItem, viewMode, setViewMode } = useLibraryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddItem = () => {
    openDrawer("create")
  }

  const handleImportItems = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        let importedCount = 0
        let errorCount = 0

        jsonData.forEach((row: any, index) => {
          try {
            if (!row.Title || !row.Type || !row.Category) {
              errorCount++
              return
            }

            const newItem = {
              id: Date.now().toString() + index,
              title: row.Title || "",
              description: row.Description || "",
              type: row.Type.toLowerCase() as "ebook" | "audiobook" | "image" | "video" | "document",
              category: row.Category || "",
              author: row.Author || "",
              narrator: row.Narrator || "",
              duration: row.Duration || "",
              fileSize: row.FileSize || "",
              language: row.Language || "English",
              status: "Available" as const,
              tags: row.Tags ? row.Tags.split(",").map((tag: string) => tag.trim()) : [],
              thumbnail: row.Thumbnail || "",
              fileUrl: row.FileUrl || "",
              isbn: row.ISBN || "",
              publishDate: row.PublishDate || "",
              addedDate: new Date().toISOString().split("T")[0],
              lastModified: new Date().toISOString().split("T")[0],
              rating: row.Rating ? parseFloat(row.Rating) : undefined,
              downloadCount: 0,
              viewCount: 0,
              isPublic: row.IsPublic === "true" || row.IsPublic === true,
              isFeatured: row.IsFeatured === "true" || row.IsFeatured === true,
              metadata: {
                pages: row.Pages ? parseInt(row.Pages) : undefined,
                format: row.Format || "",
                quality: row.Quality || "",
                resolution: row.Resolution || "",
                bitrate: row.Bitrate || "",
              },
            }

            addItem(newItem)
            importedCount++
          } catch (error) {
            errorCount++
          }
        })

        if (importedCount > 0) {
          toast.success(
            `Successfully imported ${importedCount} items${errorCount > 0 ? ` (${errorCount} errors)` : ""}`,
          )
        } else {
          toast.error("No valid items found in the Excel file")
        }
      } catch (error) {
        toast.error("Error reading Excel file. Please check the file format.")
      }
    }

    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  const handleExportItems = () => {
    const items = filteredItems()

    const exportData = items.map((item) => ({
      Title: item.title,
      Description: item.description,
      Type: item.type,
      Category: item.category,
      Author: item.author || "",
      Narrator: item.narrator || "",
      Duration: item.duration || "",
      FileSize: item.fileSize || "",
      Language: item.language,
      Status: item.status,
      Tags: item.tags.join(", "),
      Thumbnail: item.thumbnail || "",
      FileUrl: item.fileUrl || "",
      ISBN: item.isbn || "",
      PublishDate: item.publishDate || "",
      AddedDate: item.addedDate,
      LastModified: item.lastModified,
      Rating: item.rating || "",
      DownloadCount: item.downloadCount,
      ViewCount: item.viewCount,
      IsPublic: item.isPublic,
      IsFeatured: item.isFeatured,
      Pages: item.metadata?.pages || "",
      Format: item.metadata?.format || "",
      Quality: item.metadata?.quality || "",
      Resolution: item.metadata?.resolution || "",
      Bitrate: item.metadata?.bitrate || "",
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    const colWidths = [
      { wch: 30 }, // Title
      { wch: 40 }, // Description
      { wch: 12 }, // Type
      { wch: 15 }, // Category
      { wch: 20 }, // Author
      { wch: 20 }, // Narrator
      { wch: 12 }, // Duration
      { wch: 12 }, // FileSize
      { wch: 10 }, // Language
      { wch: 10 }, // Status
      { wch: 30 }, // Tags
      { wch: 20 }, // Thumbnail
      { wch: 20 }, // FileUrl
      { wch: 15 }, // ISBN
      { wch: 12 }, // PublishDate
      { wch: 12 }, // AddedDate
      { wch: 12 }, // LastModified
      { wch: 8 }, // Rating
      { wch: 12 }, // DownloadCount
      { wch: 10 }, // ViewCount
      { wch: 8 }, // IsPublic
      { wch: 10 }, // IsFeatured
      { wch: 8 }, // Pages
      { wch: 10 }, // Format
      { wch: 10 }, // Quality
      { wch: 12 }, // Resolution
      { wch: 10 }, // Bitrate
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Library Items")

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `library-items-${currentDate}.xlsx`

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
        aria-label="Import library items from Excel file"
      />
      <Button
        onClick={handleImportItems}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Items</span>
        <span className="md:hidden">Import</span>
      </Button>
      <Button
        onClick={handleExportItems}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
      {/* <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          onClick={() => setViewMode("grid")}
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
      </div> */}
      <Button
        onClick={handleAddItem}
        className="bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Plus className="h-4 w-4 group-hover:rotate-90 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Add Item</span>
        <span className="md:hidden">Add</span>
      </Button>
    </div>
  )
}

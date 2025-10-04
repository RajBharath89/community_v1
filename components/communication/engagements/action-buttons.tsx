"use client"

import type React from "react"

import { useRef } from "react"
import { useEngagementStore } from "@/stores/engagement-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Plus, Upload, Download } from "lucide-react"
import * as XLSX from "xlsx"

export function ActionButtons() {
  const { openDrawer, filteredEngagements, addEngagement } = useEngagementStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportEngagements = () => {
    const engagements = filteredEngagements

    const exportData = engagements.map((engagement) => ({
      Title: engagement.title,
      Subject: engagement.subject,
      Status: engagement.status,
      Priority: engagement.priority,
      "Message Type": engagement.messageType,
      "Target Audience": engagement.targetAudience,
      "Delivery Channels": engagement.deliveryChannels.join(", "),
      "Total Recipients": engagement.totalRecipients,
      Delivered: engagement.deliveredCount,
      Read: engagement.readCount,
      Clicks: engagement.clickCount,
      "Created Date": engagement.createdDate,
      "Scheduled Date": engagement.scheduledDate || "",
      "Sent Date": engagement.sentDate || "",
      "Created By": engagement.createdBy,
      "Has Attachments": engagement.attachments.length > 0 ? "Yes" : "No",
      "Has Links": engagement.links && engagement.links.length > 0 ? "Yes" : "No",
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Title
      { wch: 30 }, // Subject
      { wch: 12 }, // Status
      { wch: 10 }, // Priority
      { wch: 15 }, // Message Type
      { wch: 15 }, // Target Audience
      { wch: 20 }, // Delivery Channels
      { wch: 12 }, // Total Recipients
      { wch: 10 }, // Delivered
      { wch: 8 }, // Read
      { wch: 8 }, // Clicks
      { wch: 12 }, // Created Date
      { wch: 12 }, // Scheduled Date
      { wch: 12 }, // Sent Date
      { wch: 15 }, // Created By
      { wch: 12 }, // Has Attachments
      { wch: 10 }, // Has Links
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Engagements")

    const filename = `temple-engagements-${new Date().toISOString().split("T")[0]}.xlsx`

    // Generate file as array buffer for browser compatibility
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`Exported ${engagements.length} engagements to Excel`)
  }

  const handleImportEngagements = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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

        jsonData.forEach((row: any) => {
          try {
            if (!row.Title || !row.Subject) {
              errorCount++
              return
            }

            const newEngagement = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              title: row.Title,
              subject: row.Subject,
              content: `<p>${row.Subject}</p>`, // Basic content from subject
              status:
                row.Status && ["Draft", "Scheduled", "Sent", "Failed"].includes(row.Status) ? row.Status : "Draft",
              priority:
                row.Priority && ["Low", "Normal", "High", "Urgent"].includes(row.Priority) ? row.Priority : "Normal",
              messageType:
                row["Message Type"] &&
                ["Announcement", "Event", "Newsletter", "Alert", "Meeting"].includes(row["Message Type"])
                  ? row["Message Type"]
                  : "Announcement",
              createdDate: new Date().toISOString().split("T")[0],
              targetAudience:
                row["Target Audience"] && ["all", "groups", "users", "mixed"].includes(row["Target Audience"])
                  ? row["Target Audience"]
                  : "all",
              targetGroups: [],
              targetUsers: [],
              deliveryChannels: row["Delivery Channels"]
                ? row["Delivery Channels"]
                    .split(", ")
                    .filter((channel: string) => ["in-app", "email", "sms"].includes(channel))
                : ["in-app"],
              attachments: [],
              attachedForms: [],
              totalRecipients: Number(row["Total Recipients"]) || 0,
              deliveredCount: Number(row.Delivered) || 0,
              readCount: Number(row.Read) || 0,
              clickCount: Number(row.Clicks) || 0,
              createdBy: row["Created By"] || "Imported User",
              lastModified: new Date().toISOString().split("T")[0],
              scheduledDate: row["Scheduled Date"] || undefined,
              sentDate: row["Sent Date"] || undefined,
            }

            addEngagement(newEngagement)
            importedCount++
          } catch (error) {
            console.error("Error processing row:", error)
            errorCount++
          }
        })

        if (importedCount > 0) {
          toast.success(`Successfully imported ${importedCount} engagements`)
        }
        if (errorCount > 0) {
          toast.error(`Failed to import ${errorCount} engagements (missing required fields)`)
        }
      } catch (error) {
        console.error("Import error:", error)
        toast.error("Failed to import engagements. Please check the file format.")
      }
    }
    reader.readAsArrayBuffer(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <Input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />

      <Button
        variant="outline"
        onClick={handleImportEngagements}
        className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-0.5 whitespace-nowrap"
      >
        <Upload className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
        <span className="hidden md:inline">Import Engagements</span>
        <span className="md:hidden">Import</span>
      </Button>

      <Button
        variant="outline"
        onClick={handleExportEngagements}
        className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-0.5 whitespace-nowrap"
      >
        <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
        <span className="hidden md:inline">Export Engagements</span>
        <span className="md:hidden">Export</span>
      </Button>

      <Button
        onClick={() => openDrawer("create")}
        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-0.5 whitespace-nowrap"
      >
        <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        <span className="hidden md:inline">Add Engagement</span>
        <span className="md:hidden">Add</span>
      </Button>
    </div>
  )
}

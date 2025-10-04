"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Download, Plus } from "lucide-react"
import { useSupportTicketStore } from "@/stores/support-ticket-store"
import * as XLSX from "xlsx"
import { useRef } from "react"
import { toast } from "sonner"

export function ActionButtons() {
  const { openDrawer, filteredTickets, addTicket } = useSupportTicketStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreateTicket = () => {
    openDrawer("create")
  }

  const handleImportTickets = () => {
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
            if (!row.Title || !row.Description) {
              errorCount++
              return
            }

            const newTicket = {
              id: `TKT-${Date.now()}-${index}`,
              title: row.Title || "",
              description: row.Description || "",
              category: (row.Category as "Technical" | "General" | "Account" | "Billing" | "Feature Request" | "Bug Report") || "General",
              priority: (row.Priority as "Low" | "Medium" | "High" | "Critical") || "Medium",
              status: "Open" as const,
              assignedTo: row.AssignedTo || undefined,
              createdBy: row.CreatedBy || "System Import",
              createdDate: new Date().toISOString().split("T")[0],
              updatedDate: new Date().toISOString().split("T")[0],
              attachments: row.Attachments ? row.Attachments.split(",").map((a: string) => a.trim()) : [],
              comments: [],
              tags: row.Tags ? row.Tags.split(",").map((t: string) => t.trim()) : [],
              estimatedResolution: row.EstimatedResolution || undefined,
            }

            addTicket(newTicket)
            importedCount++
          } catch (error) {
            errorCount++
          }
        })

        if (importedCount > 0) {
          toast.success(
            `Successfully imported ${importedCount} tickets${errorCount > 0 ? ` (${errorCount} errors)` : ""}`
          )
        } else {
          toast.error("No valid tickets found in the Excel file")
        }
      } catch (error) {
        toast.error("Error reading Excel file. Please check the file format.")
      }
    }

    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  const handleExportTickets = () => {
    const tickets = filteredTickets()

    const exportData = tickets.map((ticket) => ({
      "Ticket ID": ticket.id,
      Title: ticket.title,
      Description: ticket.description,
      Category: ticket.category,
      Priority: ticket.priority,
      Status: ticket.status,
      "Assigned To": ticket.assignedTo || "",
      "Created By": ticket.createdBy,
      "Created Date": ticket.createdDate,
      "Updated Date": ticket.updatedDate,
      "Resolved Date": ticket.resolvedDate || "",
      Attachments: ticket.attachments?.join(", ") || "",
      Tags: ticket.tags.join(", "),
      "Estimated Resolution": ticket.estimatedResolution || "",
      "Actual Resolution": ticket.actualResolution || "",
      "Comments Count": ticket.comments.length,
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    const colWidths = [
      { wch: 12 }, // Ticket ID
      { wch: 30 }, // Title
      { wch: 50 }, // Description
      { wch: 15 }, // Category
      { wch: 10 }, // Priority
      { wch: 12 }, // Status
      { wch: 20 }, // Assigned To
      { wch: 20 }, // Created By
      { wch: 12 }, // Created Date
      { wch: 12 }, // Updated Date
      { wch: 12 }, // Resolved Date
      { wch: 30 }, // Attachments
      { wch: 20 }, // Tags
      { wch: 18 }, // Estimated Resolution
      { wch: 18 }, // Actual Resolution
      { wch: 15 }, // Comments Count
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Support Tickets")

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `support-tickets-${currentDate}.xlsx`

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
        aria-label="Import tickets from Excel file"
      />
      <Button
        onClick={handleImportTickets}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Tickets</span>
        <span className="md:hidden">Import</span>
      </Button>
      <Button
        onClick={handleExportTickets}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
      <Button
        onClick={handleCreateTicket}
        className="bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Plus className="h-4 w-4 group-hover:rotate-90 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Create Ticket</span>
        <span className="md:hidden">Create</span>
      </Button>
    </div>
  )
}

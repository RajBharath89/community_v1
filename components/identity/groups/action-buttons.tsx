"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useGroupStore } from "@/stores/group-store"
import { Plus, Upload, Download } from "lucide-react"
import { useRef } from "react"
import * as XLSX from "xlsx"
import { toast } from "sonner"

export function ActionButtons() {
  const { openDrawer, addGroup, filteredGroups, simulateLoading } = useGroupStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddGroup = () => {
    openDrawer("create")
  }

  const handleImportGroups = () => {
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
        jsonData.forEach((row: any) => {
          if (row["Name"] && row["Status"]) {
            const newGroup = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: row["Name"],
              description: row["Description"] || "",
              status: row["Status"] === "Active" ? "Active" : "Inactive",
              createdDate: new Date().toISOString().split("T")[0],
              memberCount: Number.parseInt(row["Member Count"]) || 0,
              groupType: row["Group Type"] || "user-based",
              roleMembers: row["Role Members"] ? row["Role Members"].split(",").map((r: string) => r.trim()) : [],
              userMembers: row["User Members"] ? row["User Members"].split(",").map((u: string) => u.trim()) : [],
              createdBy: "Admin",
              lastModified: new Date().toISOString().split("T")[0],
            }
            addGroup(newGroup)
            importedCount++
          }
        })

        toast.success(`Successfully imported ${importedCount} groups`)
      } catch (error) {
        toast.error("Failed to import groups. Please check the file format.")
      }
    }
    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  const handleExportGroups = () => {
    const groups = filteredGroups()
    const exportData = groups.map((group) => ({
      Name: group.name,
      Description: group.description || "",
      Status: group.status,
      "Group Type": group.groupType,
      "Member Count": group.memberCount,
      "Role Members": group.roleMembers.join(", "),
      "User Members": group.userMembers.join(", "),
      "Created By": group.createdBy,
      "Created Date": group.createdDate,
      "Last Modified": group.lastModified,
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    const colWidths = [
      { wch: 25 }, // Name
      { wch: 40 }, // Description
      { wch: 12 }, // Status
      { wch: 15 }, // Group Type
      { wch: 15 }, // Member Count
      { wch: 30 }, // Role Members
      { wch: 30 }, // User Members
      { wch: 20 }, // Created By
      { wch: 15 }, // Created Date
      { wch: 15 }, // Last Modified
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Groups")

    const filename = `temple-groups-${new Date().toISOString().split("T")[0]}.xlsx`
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`Exported ${groups.length} groups successfully`)
  }

  return (
    <div className="flex items-center space-x-3">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />

      <Button
        variant="outline"
        onClick={handleImportGroups}
        className="flex items-center space-x-2 bg-transparent hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transition-all duration-300 transform-gpu"
      >
        <Upload className="h-4 w-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-red-500" />
        <span className="transition-colors duration-300 group-hover:text-red-600">Import</span>
      </Button>

      <Button
        variant="outline"
        onClick={handleExportGroups}
        className="flex items-center space-x-2 bg-transparent hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transition-all duration-300 transform-gpu"
      >
        <Download className="h-4 w-4 transition-all duration-300 group-hover:translate-y-1 group-hover:text-red-500" />
        <span className="transition-colors duration-300 group-hover:text-red-600">Export</span>
      </Button>

      <Button
        onClick={handleAddGroup}
        className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg transition-all duration-300 transform-gpu"
      >
        <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
        <span>Add Group</span>
      </Button>
    </div>
  )
}

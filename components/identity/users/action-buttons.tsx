"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Download, Plus } from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import * as XLSX from "xlsx"
import { useRef } from "react"
import { toast } from "sonner"

export function ActionButtons() {
  const { openDrawer, filteredUsers, addUser } = useUserStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddUser = () => {
    openDrawer("create")
  }

  const handleImportUsers = () => {
    fileInputRef.current?.click()
  }

  const parseDate = (dateString: string): string | undefined => {
    if (!dateString || dateString === "Never") return undefined

    try {
      // Handle DD/M/YYYY or DD/MM/YYYY format (like "15/1/2024")
      if (dateString.includes("/")) {
        const parts = dateString.split("/")
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0")
          const month = parts[1].padStart(2, "0")
          const year = parts[2]
          const isoDate = `${year}-${month}-${day}`
          const date = new Date(isoDate)
          if (!isNaN(date.getTime())) {
            return date.toISOString()
          }
        }
      }

      // Handle YYYY-MM-DD format (like "2023-01-15")
      if (dateString.includes("-")) {
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
      }

      // Try direct parsing as fallback
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }

      return undefined
    } catch (error) {
      console.log(" Date parsing error for:", dateString, error)
      return undefined
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log(" File selected:", file.name)

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        console.log(" File read successfully")
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log(" Parsed JSON data:", jsonData)

        let importedCount = 0
        let errorCount = 0

        jsonData.forEach((row: any, index) => {
          try {
            console.log(" Processing row:", row)

            if (!row.Name || !row.Email) {
              console.log(" Row missing required fields:", { name: row.Name, email: row.Email })
              errorCount++
              return
            }

            const joinDate = row["Join Date"]
              ? row["Join Date"].includes("-")
                ? row["Join Date"]
                : parseDate(row["Join Date"])?.split("T")[0]
              : new Date().toISOString().split("T")[0]

            const lastLoginDate = parseDate(row["Last Login"])

            const newUser = {
              id: Date.now().toString() + index,
              name: row.Name || "",
              email: row.Email || "",
              role: row.Role || "Volunteer",
              status:
                row.Status === "Active" || row.Status === "Inactive" || row.Status === "Pending"
                  ? (row.Status as "Active" | "Inactive" | "Pending")
                  : ("Active" as "Active" | "Inactive" | "Pending"),
              joinDate: joinDate,
              phone: row.Phone || "",
              address: row.Address || "",
              department: row.Department || "",
              nukiCode: row["Nuki Code"] || "",
              lastLoginDate: lastLoginDate,
            }

            console.log(" Created user object:", newUser)
            addUser(newUser)
            console.log(" User added to store")
            importedCount++
          } catch (error) {
            console.log(" Error processing row:", error)
            errorCount++
          }
        })

        console.log(" Import completed:", { importedCount, errorCount })

        // Clear the console logs now that we've fixed the issue
        setTimeout(() => {
          console.clear()
        }, 2000)

        if (importedCount > 0) {
          toast.success(
            `Successfully imported ${importedCount} users${errorCount > 0 ? ` (${errorCount} errors)` : ""}`,
          )
        } else {
          toast.error("No valid users found in the Excel file")
        }
      } catch (error) {
        console.log(" Error reading Excel file:", error)
        toast.error("Error reading Excel file. Please check the file format.")
      }
    }

    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  const handleExportUsers = () => {
    const users = filteredUsers()

    const exportData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      Phone: user.phone || "",
      Address: user.address || "",
      Department: user.department || "",
      "Nuki Code": user.nukiCode || "",
      "Join Date": user.joinDate,
      "Last Login": user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : "Never",
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    const colWidths = [
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 12 }, // Role
      { wch: 10 }, // Status
      { wch: 15 }, // Phone
      { wch: 30 }, // Address
      { wch: 15 }, // Department
      { wch: 15 }, // Nuki Code
      { wch: 12 }, // Join Date
      { wch: 12 }, // Last Login
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Users")

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `temple-users-${currentDate}.xlsx`

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
        style={{ display: "none" }}
        aria-label="Import users from Excel file"
      />
      <Button
        onClick={handleImportUsers}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Upload className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Users</span>
        <span className="md:hidden">Import</span>
      </Button>
      <Button
        onClick={handleExportUsers}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
      <Button
        onClick={handleAddUser}
        className="bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Plus className="h-4 w-4 group-hover:rotate-90 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Add User</span>
        <span className="md:hidden">Add</span>
      </Button>
    </div>
  )
}

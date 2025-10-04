"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Plus, FileText } from "lucide-react"
import { useRolesStore } from "@/stores/roles-store"
import { useRef } from "react"
import { toast } from "sonner"

export function ActionButtons() {
  const { 
    openDrawer, 
    exportRoles 
  } = useRolesStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddRole = () => {
    openDrawer("create")
  }

  const handleImportRoles = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name)
    toast.info("Import functionality coming soon!")
    event.target.value = ""
  }

  const handleExportRoles = () => {
    exportRoles()
    toast.success("Roles exported successfully")
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
        aria-label="Import roles from file"
      />
      
      <Button
        onClick={handleImportRoles}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <FileText className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Roles</span>
        <span className="md:hidden">Import</span>
      </Button>

      <Button
        onClick={handleExportRoles}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>

      <Button
        onClick={handleAddRole}
        className="bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Plus className="h-4 w-4 group-hover:rotate-90 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Add Role</span>
        <span className="md:hidden">Add</span>
      </Button>
    </div>
  )
}

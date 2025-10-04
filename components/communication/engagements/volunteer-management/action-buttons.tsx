"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Plus, FileText, CheckCircle, XCircle, Users, Filter } from "lucide-react"
import { useVolunteerStore } from "@/stores/volunteer-store"
import { useRef } from "react"
import { toast } from "sonner"

export function VolunteerActionButtons() {
  const { 
    openDrawer, 
    filteredApplications, 
    bulkApprove, 
    bulkReject, 
    exportApplications,
    setAdvancedFilterOpen 
  } = useVolunteerStore()
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleImportApplications = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name)
    toast.info("Import functionality coming soon!")
    event.target.value = ""
  }

  const handleExportApplications = () => {
    exportApplications()
    toast.success("Volunteer applications exported successfully")
  }

  const handleOpenFilters = () => {
    setAdvancedFilterOpen(true)
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
        aria-label="Import volunteer applications from file"
      />
      
      <Button
        onClick={handleImportApplications}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <FileText className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Applications</span>
        <span className="md:hidden">Import</span>
      </Button>

      <Button
        onClick={handleExportApplications}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
    </div>
  )
}
